import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function GET() {
  try {
    const snap = await adminDb.collection('pricing').get();
    const plans = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ success: true, data: plans });
  } catch (error: any) {
    console.error('API /api/pricing GET Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Pricing plan id is required' }, { status: 400 });
    }
    await adminDb.collection('pricing').doc(id).set({ id, ...data }, { merge: true });
    return NextResponse.json({ success: true, message: 'Pricing plan saved successfully' });
  } catch (error: any) {
    console.error('API /api/pricing POST Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Plan id parameter required' }, { status: 400 });
    }
    await adminDb.collection('pricing').doc(id).delete();
    return NextResponse.json({ success: true, message: 'Pricing plan deleted successfully' });
  } catch (error: any) {
    console.error('API /api/pricing DELETE Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
