import { NextResponse } from 'next/server';

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

      // Try dynamic token verification if idToken provided
      if (body?.idToken) {
        try {
          const { adminAuth, isFirebaseAdminConfigured } = await import('@/lib/firebase/admin');
          if (isFirebaseAdminConfigured) {
            const decoded = await adminAuth.verifyIdToken(body.idToken);
            if (decoded.email) {
              email = decoded.email;
            }
          }
        } catch {}
      }
    } catch {
      // Body empty or invalid JSON
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

    // 3. Direct match against allowed admin list (FAST PATH)
    if (allowedAdmins.includes(cleanEmail)) {
      return NextResponse.json({ authorized: true, role: 'Admin' }, { status: 200 });
    }

    // 4. Query Firestore admin_managers collection safely via dynamic import
    try {
      const { adminDb, isFirebaseAdminConfigured } = await import('@/lib/firebase/admin');
      if (isFirebaseAdminConfigured) {
        const snap = await adminDb.collection('admin_managers').where('email', '==', cleanEmail).get();
        if (!snap.empty) {
          const manager = snap.docs[0].data();
          return NextResponse.json({ authorized: true, role: manager.role || 'Admin' }, { status: 200 });
        }
      }
    } catch (adminErr) {
      console.warn('[verify-admin] Firebase Admin module query notice:', adminErr);
    }

    // 5. Account not authorized
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





