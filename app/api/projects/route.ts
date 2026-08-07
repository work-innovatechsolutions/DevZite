import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FALLBACK_PROJECTS = [
  {
    slug: 'abjee-travel',
    title: 'ABjee Travel',
    name: 'ABjee Travel',
    category: 'Next.js 15 Web App',
    description: 'Explore tourist places, connect with fellow travellers, read trip stories, and make travel itineraries.',
    summary: 'Explore tourist places, connect with fellow travellers, read trip stories, and make travel itineraries.',
    lighthouseScore: 99,
    status: 'Live Production',
    techStack: ['Next.js 15', 'Tailwind', 'TypeScript'],
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80',
  },
  {
    slug: 'aura-studio-platform',
    title: 'Aura Studio Platform',
    name: 'Aura Studio Platform',
    category: 'Next.js 15 Platform',
    description: 'Living web operating system built with modular component architecture, 60fps animations, and edge delivery.',
    summary: 'Living web operating system built with modular component architecture, 60fps animations, and edge delivery.',
    lighthouseScore: 99,
    status: 'Live Production',
    techStack: ['Next.js 15', 'Tailwind', 'GSAP', 'Lenis'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
  },
  {
    slug: 'cyberpulse-saas-dashboard',
    title: 'CyberPulse SaaS Dashboard',
    name: 'CyberPulse SaaS Dashboard',
    category: 'Full-Stack Web App',
    description: 'Enterprise real-time analytics portal with WebSocket telemetry and serverless API backend.',
    summary: 'Enterprise real-time analytics portal with WebSocket telemetry and serverless API backend.',
    lighthouseScore: 98,
    status: 'Active QA',
    techStack: ['React 19', 'TypeScript', 'Serverless'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
  },
  {
    slug: 'omnitrade-mobile-app',
    title: 'OmniTrade Mobile Software',
    name: 'OmniTrade Mobile Software',
    category: 'Native Android App',
    description: 'Native Android trading suite with low-latency order execution and biometric authentication.',
    summary: 'Native Android trading suite with low-latency order execution and biometric authentication.',
    lighthouseScore: 97,
    status: 'In Development',
    techStack: ['Kotlin', 'Jetpack Compose', 'Clean Arch'],
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
  },
];

export async function GET() {
  try {
    const { adminDb, isFirebaseAdminConfigured } = await import('@/lib/firebase/admin');
    if (isFirebaseAdminConfigured) {
      const snap = await adminDb.collection('projects').get();
      if (!snap.empty) {
        const projects = snap.docs.map((doc) => ({ slug: doc.id, ...doc.data() }));
        return NextResponse.json({ success: true, data: projects });
      }
    }
  } catch (err) {
    console.warn('API /api/projects fallback active:', err);
  }
  return NextResponse.json({ success: true, data: FALLBACK_PROJECTS });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slug, ...data } = body;
    if (!slug) {
      return NextResponse.json({ success: false, error: 'Project slug is required' }, { status: 400 });
    }
    const { adminDb, isFirebaseAdminConfigured } = await import('@/lib/firebase/admin');
    if (!isFirebaseAdminConfigured) {
      return NextResponse.json({ success: false, error: 'Firebase Admin environment variables missing' }, { status: 500 });
    }
    await adminDb.collection('projects').doc(slug).set({ slug, ...data }, { merge: true });
    return NextResponse.json({ success: true, message: 'Project saved successfully' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error saving project';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    if (!slug) {
      return NextResponse.json({ success: false, error: 'Project slug parameter required' }, { status: 400 });
    }
    const { adminDb, isFirebaseAdminConfigured } = await import('@/lib/firebase/admin');
    if (!isFirebaseAdminConfigured) {
      return NextResponse.json({ success: false, error: 'Firebase Admin environment variables missing' }, { status: 500 });
    }
    await adminDb.collection('projects').doc(slug).delete();
    return NextResponse.json({ success: true, message: 'Project deleted successfully' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error deleting project';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
