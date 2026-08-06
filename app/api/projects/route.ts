import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function GET() {
  try {
    const snap = await adminDb.collection('projects').get();
    const projects = snap.docs.map((doc) => ({ slug: doc.id, ...doc.data() }));
    return NextResponse.json({ success: true, data: projects });
  } catch (error: any) {
    console.error('API /api/projects GET Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slug, ...data } = body;
    if (!slug) {
      return NextResponse.json({ success: false, error: 'Project slug is required' }, { status: 400 });
    }
    await adminDb.collection('projects').doc(slug).set({ slug, ...data }, { merge: true });
    return NextResponse.json({ success: true, message: 'Project saved successfully' });
  } catch (error: any) {
    console.error('API /api/projects POST Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    if (!slug) {
      return NextResponse.json({ success: false, error: 'Project slug parameter required' }, { status: 400 });
    }
    await adminDb.collection('projects').doc(slug).delete();
    return NextResponse.json({ success: true, message: 'Project deleted successfully' });
  } catch (error: any) {
    console.error('API /api/projects DELETE Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
