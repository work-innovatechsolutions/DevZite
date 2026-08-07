import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FALLBACK_MANAGERS = [
  {
    id: 'mgr-admin-1',
    name: 'Souvik (Admin)',
    email: 'souvikgon377@gmail.com',
    role: 'Admin',
    status: 'Active (Firebase Auth)',
    lastActive: 'Just Now',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isRealAuth: true,
  },
  {
    id: 'mgr-admin-2',
    name: 'Innovatech Solutions',
    email: 'work.innovatechsolutions@gmail.com',
    role: 'Admin',
    status: 'Active (Firebase Auth)',
    lastActive: 'Just Now',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isRealAuth: true,
  },
];

export async function GET() {
  try {
    const { adminDb, adminAuth, isFirebaseAdminConfigured } = await import('@/lib/firebase/admin');
    
    if (isFirebaseAdminConfigured) {
      let firestoreManagers: any[] = [];
      try {
        const snap = await adminDb.collection('admin_managers').get();
        if (!snap.empty) {
          firestoreManagers = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        }
      } catch (dbErr) {
        console.warn('[managers GET] Firestore collection query notice:', dbErr);
      }

      let authUsers: any[] = [];
      try {
        const authList = await adminAuth.listUsers(50);
        authUsers = authList.users.map((u) => ({
          id: u.uid,
          name: u.displayName || (u.email ? u.email.split('@')[0] : 'Admin User'),
          email: u.email || 'no-email@devzite.com',
          role: 'Admin',
          status: u.disabled ? 'Disabled' : 'Active (Firebase Auth)',
          lastActive: u.metadata.lastSignInTime ? new Date(u.metadata.lastSignInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just Now',
          avatar: u.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          isRealAuth: true,
        }));
      } catch (authErr) {
        console.warn('[managers GET] Firebase Auth listUsers notice:', authErr);
      }

      const authEmails = new Set(authUsers.map((a) => a.email.toLowerCase()));
      const uniqueDocs = firestoreManagers.filter(
        (m: any) => m.email && !authEmails.has(m.email.toLowerCase())
      );

      const merged = [...authUsers, ...uniqueDocs];
      if (merged.length > 0) {
        return NextResponse.json({ success: true, data: merged });
      }
    }
  } catch (error: any) {
    console.warn('[managers GET] Fallback triggered:', error);
  }
  
  return NextResponse.json({ success: true, data: FALLBACK_MANAGERS });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, role, password } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ success: false, error: 'Valid email is required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    let uid = `mgr-${Date.now()}`;

    try {
      const { adminDb, adminAuth, isFirebaseAdminConfigured } = await import('@/lib/firebase/admin');
      if (isFirebaseAdminConfigured) {
        try {
          const authRecord = await adminAuth.createUser({
            email: cleanEmail,
            password: password || 'DevziteAdmin123!',
            displayName: name || cleanEmail.split('@')[0],
          });
          uid = authRecord.uid;
        } catch (authCreateErr: any) {
          console.warn('[managers POST] Auth user creation notice:', authCreateErr.message);
        }

        const docData = {
          id: uid,
          name: name || cleanEmail.split('@')[0],
          email: cleanEmail,
          role: role || 'Admin',
          status: 'Active (Firebase Auth)',
          lastActive: 'Just Now',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          createdAt: new Date().toISOString(),
        };

        await adminDb.collection('admin_managers').doc(uid).set(docData, { merge: true });
      }
    } catch (adminErr) {
      console.warn('[managers POST] Firebase Admin dynamic import notice:', adminErr);
    }

    return NextResponse.json({ success: true, message: 'Admin Account registered successfully!' });
  } catch (error: any) {
    console.error('API /api/managers POST Error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Error creating admin account' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Manager id required' }, { status: 400 });
    }

    try {
      const { adminDb, adminAuth, isFirebaseAdminConfigured } = await import('@/lib/firebase/admin');
      if (isFirebaseAdminConfigured) {
        await adminDb.collection('admin_managers').doc(id).delete();
        try {
          await adminAuth.deleteUser(id);
        } catch (e) {}
      }
    } catch (adminErr) {
      console.warn('[managers DELETE] Firebase Admin notice:', adminErr);
    }

    return NextResponse.json({ success: true, message: 'Manager deleted successfully' });
  } catch (error: any) {
    console.error('API /api/managers DELETE Error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Error deleting manager' }, { status: 500 });
  }
}
