import { NextResponse } from 'next/server';
import { adminDb, isFirebaseAdminConfigured } from '@/lib/firebase/admin';

const DIRECT_ADMINS = [
  'souvikgon377@gmail.com',
  'work.innovatechsolutions@gmail.com',
];

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ authorized: false, error: 'Email parameter required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Direct admin authorization
    const envAdmins = (process.env.ADMIN_EMAILS || process.env.SUPER_ADMIN_EMAILS || '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    const allowedAdmins = Array.from(new Set([...DIRECT_ADMINS, ...envAdmins]));

    if (allowedAdmins.includes(cleanEmail)) {
      return NextResponse.json({ authorized: true, role: 'Admin' });
    }

    // 2. Check if Firebase Admin SDK is configured to query Firestore
    if (!isFirebaseAdminConfigured) {
      return NextResponse.json(
        {
          authorized: false,
          error: `Access Denied: Account (${cleanEmail}) is not an authorized Devzite Studio Admin.`,
        },
        { status: 403 }
      );
    }

    // 3. Query Firestore admin_managers collection for authorized admin documents
    const snap = await adminDb.collection('admin_managers').where('email', '==', cleanEmail).get();

    if (!snap.empty) {
      const manager = snap.docs[0].data();
      return NextResponse.json({ authorized: true, role: manager.role || 'Admin Manager' });
    }

    // 4. Email not found in Firestore admin_managers collection
    return NextResponse.json(
      {
        authorized: false,
        error: `Access Denied: Account (${cleanEmail}) is not an authorized Devzite Studio Admin.`,
      },
      { status: 403 }
    );
  } catch (error: any) {
    console.error('API /api/auth/verify-admin Error:', error);
    return NextResponse.json(
      { authorized: false, error: error?.message || 'Server error verifying admin account' },
      { status: 500 }
    );
  }
}



