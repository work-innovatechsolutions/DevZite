import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { adminDb, isFirebaseAdminConfigured } = await import('@/lib/firebase/admin');
    if (isFirebaseAdminConfigured) {
      const doc = await adminDb.collection('settings').doc('currency').get();
      if (doc.exists) {
        return NextResponse.json({ success: true, data: doc.data() });
      }
    }
  } catch (error: any) {
    console.warn('API /api/currency GET warning:', error);
  }
  return NextResponse.json({ success: true, data: { currency: 'USD', symbol: '$', rate: 1 } });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { currency, symbol, rate } = body;
    if (!currency) {
      return NextResponse.json({ success: false, error: 'Currency code is required' }, { status: 400 });
    }

    const currencyData = {
      currency: currency.toUpperCase(),
      symbol: symbol || (currency.toUpperCase() === 'INR' ? '₹' : '$'),
      rate: Number(rate) || (currency.toUpperCase() === 'INR' ? 86 : 1),
      updatedAt: new Date().toISOString(),
    };

    const { adminDb, isFirebaseAdminConfigured } = await import('@/lib/firebase/admin');
    if (!isFirebaseAdminConfigured) {
      return NextResponse.json({ success: false, error: 'Firebase Admin not configured' }, { status: 500 });
    }

    await adminDb.collection('settings').doc('currency').set(currencyData, { merge: true });
    return NextResponse.json({ success: true, message: 'Currency setting updated successfully', data: currencyData });
  } catch (error: any) {
    console.error('API /api/currency POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
