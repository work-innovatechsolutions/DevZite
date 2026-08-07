import { NextResponse } from 'next/server';
import { adminDb, isFirebaseAdminConfigured } from '@/lib/firebase/admin';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ authorized: false, error: 'Email parameter required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Check Super Admin Emails configured in environment variables
    const envSuperAdmins = (process.env.SUPER_ADMIN_EMAILS || '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    if (envSuperAdmins.includes(cleanEmail)) {
      return NextResponse.json({ authorized: true, role: 'Super Admin' });
    }

    // 2. Check if Firebase Admin SDK is configured to query Firestore
    if (!isFirebaseAdminConfigured) {
      return NextResponse.json(
        {
          authorized: false,
          error: `Server Configuration Error: Firebase Admin SDK environment variables (FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) are missing in Vercel. Please set them in Vercel Project Settings to enable Firestore admin checks.`,
        },
        { status: 500 }
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
        error: `Access Denied: Account (${cleanEmail}) is not listed in the Firestore admin_managers collection or SUPER_ADMIN_EMAILS.`,
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


