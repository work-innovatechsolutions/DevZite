import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

const SUPER_ADMIN_EMAILS = [
  'souvikgon377@gmail.com',
  'souvik@devzite.com',
  'alex@devzite.com',
  'elena@devzite.com',
  'admin@devzite.com',
];

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ authorized: false, error: 'Email parameter required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Check seed super admin emails
    if (SUPER_ADMIN_EMAILS.includes(cleanEmail)) {
      return NextResponse.json({ authorized: true, role: 'Super Admin' });
    }

    // 2. Query Firestore admin_managers collection
    const snap = await adminDb.collection('admin_managers').where('email', '==', cleanEmail).get();

    if (!snap.empty) {
      const manager = snap.docs[0].data();
      return NextResponse.json({ authorized: true, role: manager.role || 'Admin Manager' });
    }

    // 3. Email not found in Admin Roster
    return NextResponse.json({
      authorized: false,
      error: `Access Denied: The account (${email}) is not an authorized Devzite Studio Admin.`,
    }, { status: 403 });
  } catch (error: any) {
    console.error('API /api/auth/verify-admin Error:', error);
    return NextResponse.json({ authorized: false, error: error.message }, { status: 500 });
  }
}
