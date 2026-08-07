import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const INITIAL_COUPONS = [
  {
    code: 'DEVZITE20',
    discountPercent: 20,
    description: '20% off on all pricing tiers',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    code: 'WELCOME10',
    discountPercent: 10,
    description: '10% intro discount for new client projects',
    active: true,
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    const { adminDb, isFirebaseAdminConfigured } = await import('@/lib/firebase/admin');
    if (isFirebaseAdminConfigured) {
      const snap = await adminDb.collection('coupons').get();
      if (!snap.empty) {
        const coupons = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        return NextResponse.json({ success: true, data: coupons });
      }
    }
  } catch (error: any) {
    console.warn('API /api/coupons GET warning:', error);
  }
  return NextResponse.json({ success: true, data: INITIAL_COUPONS });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, discountPercent, description, active } = body;

    if (!code) {
      return NextResponse.json({ success: false, error: 'Coupon code required' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    const couponData = {
      code: cleanCode,
      discountPercent: Number(discountPercent) || 10,
      description: description || `${discountPercent}% promotional discount`,
      active: active !== undefined ? Boolean(active) : true,
      updatedAt: new Date().toISOString(),
    };

    const { adminDb, isFirebaseAdminConfigured } = await import('@/lib/firebase/admin');
    if (!isFirebaseAdminConfigured) {
      return NextResponse.json({ success: false, error: 'Firebase Admin SDK not configured' }, { status: 500 });
    }

    await adminDb.collection('coupons').doc(cleanCode).set(couponData, { merge: true });
    return NextResponse.json({ success: true, message: 'Coupon saved successfully', data: couponData });
  } catch (error: any) {
    console.error('API /api/coupons POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    if (!code) {
      return NextResponse.json({ success: false, error: 'Coupon code required' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();
    const { adminDb, isFirebaseAdminConfigured } = await import('@/lib/firebase/admin');
    if (!isFirebaseAdminConfigured) {
      return NextResponse.json({ success: false, error: 'Firebase Admin SDK not configured' }, { status: 500 });
    }

    await adminDb.collection('coupons').doc(cleanCode).delete();
    return NextResponse.json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error: any) {
    console.error('API /api/coupons DELETE error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
