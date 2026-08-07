import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  let isConfigured = false;
  let errorMsg = 'None';
  let snapEmpty = null;
  let testDocCount = 0;

  try {
    const { adminDb, isFirebaseAdminConfigured } = await import('@/lib/firebase/admin');
    isConfigured = isFirebaseAdminConfigured;
    
    if (isFirebaseAdminConfigured) {
      const snap = await adminDb.collection('registered_users').get();
      snapEmpty = snap.empty;
      testDocCount = snap.size;
    }
  } catch (err: any) {
    errorMsg = err?.message || String(err);
  }

  return NextResponse.json({
    success: true,
    isConfigured,
    errorMsg,
    snapEmpty,
    testDocCount,
    timestamp: new Date().toISOString(),
  });
}
