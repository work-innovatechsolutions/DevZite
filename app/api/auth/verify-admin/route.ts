import { NextResponse } from 'next/server';
import { adminDb, adminAuth, isFirebaseAdminConfigured } from '@/lib/firebase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DIRECT_ADMINS = [
  'souvikgon377@gmail.com',
  'work.innovatechsolutions@gmail.com',
];

export async function POST(req: Request) {
  try {
    let email: string | undefined;

    // 1. Parse JSON payload safely
    try {
      const body = await req.json();
      email = body?.email;

      // Extract email from ID token if provided
      if (body?.idToken && isFirebaseAdminConfigured) {
        try {
          const decoded = await adminAuth.verifyIdToken(body.idToken);
          if (decoded.email) {
            email = decoded.email;
          }
        } catch (tokenErr) {
          console.warn('verify-admin: ID token verification failed, falling back to body email:', tokenErr);
        }
      }
    } catch {
      // Body empty or invalid JSON
    }

    // Also check Authorization header for Bearer token if available
    const authHeader = req.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ') && isFirebaseAdminConfigured) {
      const token = authHeader.substring(7).trim();
      if (token) {
        try {
          const decoded = await adminAuth.verifyIdToken(token);
          if (decoded.email) {
            email = decoded.email;
          }
        } catch (tokenErr) {
          console.warn('verify-admin: Authorization header token verification failed:', tokenErr);
        }
      }
    }

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { authorized: false, error: 'Valid email address or authentication token is required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 2. Parse environment variable admin allowlists robustly
    const rawEnv = `${process.env.ADMIN_EMAILS || ''},${process.env.SUPER_ADMIN_EMAILS || ''}`;
    const envAdmins = rawEnv
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    const allowedAdmins = Array.from(new Set([...DIRECT_ADMINS, ...envAdmins]));

    // Debug log for non-production environments
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[verify-admin] Verifying: ${cleanEmail} against allowed admins count: ${allowedAdmins.length}`);
    }

    // 3. Direct match against allowed admin list
    if (allowedAdmins.includes(cleanEmail)) {
      return NextResponse.json({ authorized: true, role: 'Admin' }, { status: 200 });
    }

    // 4. Query Firestore admin_managers collection if Admin SDK is initialized
    if (isFirebaseAdminConfigured) {
      try {
        const snap = await adminDb.collection('admin_managers').where('email', '==', cleanEmail).get();
        if (!snap.empty) {
          const manager = snap.docs[0].data();
          return NextResponse.json({ authorized: true, role: manager.role || 'Admin' }, { status: 200 });
        }
      } catch (dbErr) {
        console.error('[verify-admin] Firestore admin_managers query failed:', dbErr);
      }
    }

    // 5. Account not authorized in env list or Firestore
    return NextResponse.json(
      {
        authorized: false,
        error: `Access Denied: Account (${cleanEmail}) is not an authorized Devzite Studio Admin.`,
      },
      { status: 403 }
    );
  } catch (error: any) {
    console.error('[verify-admin] Unexpected error:', error);
    return NextResponse.json(
      { authorized: false, error: error?.message || 'Internal server error verifying admin account.' },
      { status: 500 }
    );
  }
}




