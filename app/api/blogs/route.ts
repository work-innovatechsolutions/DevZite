import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function GET() {
  try {
    const snap = await adminDb.collection('blogs').get();
    const blogs = snap.docs.map((doc) => ({ slug: doc.id, ...doc.data() }));
    return NextResponse.json({ success: true, data: blogs });
  } catch (error: any) {
    console.error('API /api/blogs GET Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slug, ...data } = body;
    if (!slug) {
      return NextResponse.json({ success: false, error: 'Blog slug required' }, { status: 400 });
    }
    await adminDb.collection('blogs').doc(slug).set(data, { merge: true });
    return NextResponse.json({ success: true, message: 'Blog saved successfully' });
  } catch (error: any) {
    console.error('API /api/blogs POST Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
