import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

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
];

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unexpected Firebase Admin error';
}

export async function GET() {
  try {
    const snap = await adminDb.collection('projects').get();
    const projects = snap.docs.map((doc) => ({ slug: doc.id, ...doc.data() }));
    return NextResponse.json({ success: true, data: projects });
  } catch (error: unknown) {
    console.error('API /api/projects GET Error:', error);
    return NextResponse.json({
      success: true,
      data: FALLBACK_PROJECTS,
      warning: errorMessage(error),
    });
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
  } catch (error: unknown) {
    console.error('API /api/projects POST Error:', error);
    return NextResponse.json({ success: false, error: errorMessage(error) }, { status: 500 });
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
  } catch (error: unknown) {
    console.error('API /api/projects DELETE Error:', error);
    return NextResponse.json({ success: false, error: errorMessage(error) }, { status: 500 });
  }
}
