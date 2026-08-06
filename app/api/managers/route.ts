import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase/admin';

export async function GET() {
  try {
    // 1. Fetch Firestore admin_managers collection docs
    const snap = await adminDb.collection('admin_managers').get();
    const firestoreManagers = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // 2. Fetch real Firebase Auth registered accounts
    let authUsers: any[] = [];
    try {
      const authList = await adminAuth.listUsers(50);
      authUsers = authList.users.map((u) => ({
        id: u.uid,
        name: u.displayName || (u.email ? u.email.split('@')[0] : 'Admin User'),
        email: u.email || 'no-email@devzite.com',
        role: u.email?.toLowerCase().includes('souvik') ? 'Super Admin' : 'Firebase Verified Admin',
        status: u.disabled ? 'Disabled' : 'Active (Firebase Auth)',
        lastActive: u.metadata.lastSignInTime ? new Date(u.metadata.lastSignInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just Now',
        avatar: u.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        isRealAuth: true,
      }));
    } catch (authErr) {
      console.warn('Could not list Firebase Auth users:', authErr);
    }

    // Combine arrays avoiding duplicate email entries
    const authEmails = new Set(authUsers.map((a) => a.email.toLowerCase()));
    const uniqueDocs = firestoreManagers.filter(
      (m: any) => m.email && !authEmails.has(m.email.toLowerCase())
    );

    const merged = [...authUsers, ...uniqueDocs];

    return NextResponse.json({ success: true, data: merged });
  } catch (error: any) {
    console.error('API /api/managers GET Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, role, password } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    let uid = `mgr-${Date.now()}`;

    // Create real user in Firebase Authentication if password provided
    try {
      const authRecord = await adminAuth.createUser({
        email,
        password: password || 'DevziteAdmin123!',
        displayName: name || email.split('@')[0],
      });
      uid = authRecord.uid;
    } catch (authCreateErr: any) {
      console.warn('Firebase Auth user creation notice (user may already exist):', authCreateErr.message);
    }

    const docData = {
      id: uid,
      name: name || email.split('@')[0],
      email,
      role: role || 'Lead Architect',
      status: 'Active (Firebase Auth)',
      lastActive: 'Just Now',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
    };

    await adminDb.collection('admin_managers').doc(uid).set(docData, { merge: true });

    return NextResponse.json({ success: true, message: 'Real Admin Account created in Firebase Auth & Firestore!' });
  } catch (error: any) {
    console.error('API /api/managers POST Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Manager id required' }, { status: 400 });
    }

    // Remove from Firestore
    await adminDb.collection('admin_managers').doc(id).delete();

    // Remove from Firebase Auth if valid UID
    try {
      await adminAuth.deleteUser(id);
    } catch (e) {}

    return NextResponse.json({ success: true, message: 'Manager deleted successfully' });
  } catch (error: any) {
    console.error('API /api/managers DELETE Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
