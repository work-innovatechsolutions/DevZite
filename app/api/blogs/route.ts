import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FALLBACK_BLOGS = [
  {
    slug: 'nextjs-15-performance-guide',
    title: 'Architecting 99+ Lighthouse Scores in Next.js 15',
    category: 'Engineering',
    author: 'Devzite Technical Team',
    status: 'Published',
    views: 4280,
    excerpt: 'Detailed engineering guide on zero-CLS layouts, passive scroll event optimization, and Turbopack bundler tuning.',
    publishedAt: new Date().toISOString(),
  },
  {
    slug: 'native-android-jetpack-compose',
    title: 'Clean Architecture Patterns for Jetpack Compose',
    category: 'Mobile Dev',
    author: 'Devzite Mobile Lead',
    status: 'Published',
    views: 2910,
    excerpt: 'Structuring enterprise Android applications with unidirectional data flow and modular ViewModel architecture.',
    publishedAt: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    const { adminDb, isFirebaseAdminConfigured } = await import('@/lib/firebase/admin');
    if (isFirebaseAdminConfigured) {
      const snap = await adminDb.collection('blogs').get();
      if (!snap.empty) {
        const blogs = snap.docs.map((doc) => ({ slug: doc.id, ...doc.data() }));
        return NextResponse.json({ success: true, data: blogs });
      }
    }
  } catch (error: any) {
    console.warn('API /api/blogs fallback active:', error);
  }
  return NextResponse.json({ success: true, data: FALLBACK_BLOGS });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slug, ...data } = body;
    if (!slug) {
      return NextResponse.json({ success: false, error: 'Blog slug required' }, { status: 400 });
    }
    const { adminDb, isFirebaseAdminConfigured } = await import('@/lib/firebase/admin');
    if (!isFirebaseAdminConfigured) {
      return NextResponse.json({ success: false, error: 'Firebase Admin environment variables missing' }, { status: 500 });
    }
    await adminDb.collection('blogs').doc(slug).set({ slug, ...data }, { merge: true });
    return NextResponse.json({ success: true, message: 'Blog saved successfully' });
  } catch (error: any) {
    console.error('API /api/blogs POST Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    if (!slug) {
      return NextResponse.json({ success: false, error: 'Blog slug parameter required' }, { status: 400 });
    }
    const { adminDb, isFirebaseAdminConfigured } = await import('@/lib/firebase/admin');
    if (!isFirebaseAdminConfigured) {
      return NextResponse.json({ success: false, error: 'Firebase Admin environment variables missing' }, { status: 500 });
    }
    await adminDb.collection('blogs').doc(slug).delete();
    return NextResponse.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error: any) {
    console.error('API /api/blogs DELETE Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
