import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const displayName = typeof name === 'string' && name.trim() ? name.trim() : cleanEmail.split('@')[0];

    let uid: string;
    try {
      const user = await adminAuth.getUserByEmail(cleanEmail);
      uid = user.uid;
    } catch {
      const user = await adminAuth.createUser({
        email: cleanEmail,
        displayName,
      });
      uid = user.uid;
    }

    await adminDb.collection('admin_managers').doc(uid).set(
      {
        id: uid,
        name: displayName,
        email: cleanEmail,
        role: 'Admin',
        status: 'Active (Firebase Auth)',
        lastActive: 'Just Now',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString(),
      },
      { merge: true },
    );

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('API /api/auth/bootstrap-admin Error:', error);
    const message = error instanceof Error ? error.message : 'Unexpected bootstrap admin error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
