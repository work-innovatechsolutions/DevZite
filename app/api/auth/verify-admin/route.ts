import { NextResponse } from 'next/server';
import { adminDb, isFirebaseAdminConfigured } from '@/lib/firebase/admin';

const DEFAULT_SUPER_ADMIN_EMAILS = [
  'work.innovatechsolutions@gmail.com',
  'souvikgon377@gmail.com',
];

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ authorized: false, error: 'Email parameter required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Check seed super admin emails (env var + fallback list)
    const envSuperAdmins = (process.env.SUPER_ADMIN_EMAILS || '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    const allowedSuperAdmins = Array.from(
      new Set([...DEFAULT_SUPER_ADMIN_EMAILS, ...envSuperAdmins])
    );

    if (allowedSuperAdmins.includes(cleanEmail)) {
      return NextResponse.json({ authorized: true, role: 'Super Admin' });
    }

    // 2. Check if Firebase Admin SDK is configured before querying Firestore
    if (!isFirebaseAdminConfigured) {
      return NextResponse.json(
        {
          authorized: false,
          error: `Access Denied: (${cleanEmail}) is not a designated Super Admin, and Firebase Admin SDK server environment variables are missing on Vercel.`,
        },
        { status: 403 }
      );
    }

    // 3. Query Firestore admin_managers collection
    const snap = await adminDb.collection('admin_managers').where('email', '==', cleanEmail).get();

    if (!snap.empty) {
      const manager = snap.docs[0].data();
      return NextResponse.json({ authorized: true, role: manager.role || 'Admin Manager' });
    }

    // 4. Email not found in Admin Roster
    return NextResponse.json(
      {
        authorized: false,
        error: `Access Denied: The account (${cleanEmail}) is not an authorized Devzite Studio Admin.`,
      },
      { status: 403 }
    );
  } catch (error: any) {
    console.error('API /api/auth/verify-admin Error:', error);
    return NextResponse.json(
      { authorized: false, error: error?.message || 'Server error verifying admin' },
      { status: 500 }
    );
  }
}

