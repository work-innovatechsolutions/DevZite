import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function GET() {
  try {
    const snap = await adminDb.collection('leads').get();
    const leads = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ success: true, data: leads });
  } catch (error: any) {
    console.error('API /api/leads GET Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    const docId = id || `lead-${Date.now()}`;
    await adminDb.collection('leads').doc(docId).set({ id: docId, ...data }, { merge: true });
    return NextResponse.json({ success: true, message: 'Lead saved successfully' });
  } catch (error: any) {
    console.error('API /api/leads POST Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
