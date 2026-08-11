import { NextResponse } from 'next/server';
import { COMPREHENSIVE_BLOGS } from '@/lib/data/blogs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const category = searchParams.get('category');
    const q = searchParams.get('q')?.toLowerCase();

    let allBlogs = COMPREHENSIVE_BLOGS;

    try {
      const { adminDb, isFirebaseAdminConfigured } = await import('@/lib/firebase/admin');
      if (isFirebaseAdminConfigured) {
        const snap = await adminDb.collection('blogs').get();
        if (!snap.empty) {
          allBlogs = snap.docs.map((doc) => ({ slug: doc.id, ...doc.data() })) as any;
        }
      }
    } catch (e) {
      console.warn('API /api/blogs Firestore fallback active:', e);
    }

    if (slug) {
      const singleBlog = allBlogs.find((b) => b.slug === slug);
      if (singleBlog) {
        return NextResponse.json({ success: true, data: singleBlog });
      }
      return NextResponse.json({ success: false, error: 'Blog post not found' }, { status: 404 });
    }

    let filtered = allBlogs;
    if (category && category !== 'All') {
      filtered = filtered.filter((b) => b.category.toLowerCase() === category.toLowerCase());
    }

    if (q) {
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.excerpt.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          (b.tags && b.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    return NextResponse.json({ success: true, data: filtered });
  } catch (error: any) {
    console.error('API /api/blogs GET Error:', error);
    return NextResponse.json({ success: true, data: COMPREHENSIVE_BLOGS });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slug, ...data } = body;
    if (!slug) {
      return NextResponse.json({ success: false, error: 'Blog slug required' }, { status: 400 });
    }

    const blogDoc = {
      slug,
      ...data,
      publishedAt: data.publishedAt || new Date().toISOString(),
      date: data.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    try {
      const { adminDb, isFirebaseAdminConfigured } = await import('@/lib/firebase/admin');
      if (isFirebaseAdminConfigured) {
        await adminDb.collection('blogs').doc(slug).set(blogDoc, { merge: true });
      }
    } catch (e) {
      console.warn('Firebase blogs POST write fallback:', e);
    }

    return NextResponse.json({ success: true, message: 'Blog saved successfully', data: blogDoc });
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

    try {
      const { adminDb, isFirebaseAdminConfigured } = await import('@/lib/firebase/admin');
      if (isFirebaseAdminConfigured) {
        await adminDb.collection('blogs').doc(slug).delete();
      }
    } catch (e) {
      console.warn('Firebase blogs DELETE fallback:', e);
    }

    return NextResponse.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error: any) {
    console.error('API /api/blogs DELETE Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
