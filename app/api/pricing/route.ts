import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FALLBACK_PRICING = [
  {
    id: 'starter',
    name: 'Starter',
    badge: 'Essential Build',
    price: '$2,499',
    billing: 'per project',
    description: 'Perfect for startups needing a high-performance, conversion-focused digital presence.',
    isPopular: false,
    features: [
      'Next.js 15 Web Application',
      'Tailwind CSS v4 Responsive Design',
      '99+ Lighthouse Performance Score',
      'SEO & Meta Tags Optimization',
      'Firebase Infrastructure Setup',
      '1 Month Technical Warranty & Support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro Studio',
    badge: 'Most Popular',
    price: '$5,999',
    billing: 'per project',
    description: 'Complete full-stack web and mobile application suite for scaling tech brands.',
    isPopular: true,
    features: [
      'Full-Stack Web + Native Mobile App',
      'Custom UI/UX & Motion Design System',
      '60fps GSAP & Framer Motion Animations',
      'Firebase Admin CMS & Auth Control',
      'Real-time WebSocket & API Architecture',
      '3 Months Priority Support & Maintenance',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    badge: 'Custom Architecture',
    price: '$12,999',
    billing: 'per project',
    description: 'Dedicated studio engineering, custom 3D web experiences, and SLA guarantees.',
    isPopular: false,
    features: [
      'Dedicated Studio Engineering Squad',
      'Generative AI & LLM Workflow Integration',
      'Custom 3D / R3F WebGL Visualizations',
      'Enterprise Security & Compliance Audit',
      '99.99% Uptime SLA Guarantee',
      '24/7 Dedicated Retainer Support',
    ],
  },
];

export async function GET() {
  try {
    const { adminDb, isFirebaseAdminConfigured } = await import('@/lib/firebase/admin');
    if (isFirebaseAdminConfigured) {
      const snap = await adminDb.collection('pricing').get();
      if (!snap.empty) {
        const plans = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        return NextResponse.json({ success: true, data: plans });
      }
    }
  } catch (error: any) {
    console.warn('API /api/pricing fallback active:', error);
  }
  return NextResponse.json({ success: true, data: FALLBACK_PRICING });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Pricing plan id is required' }, { status: 400 });
    }
    const { adminDb, isFirebaseAdminConfigured } = await import('@/lib/firebase/admin');
    if (!isFirebaseAdminConfigured) {
      return NextResponse.json({ success: false, error: 'Firebase Admin environment variables missing' }, { status: 500 });
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
    const { adminDb, isFirebaseAdminConfigured } = await import('@/lib/firebase/admin');
    if (!isFirebaseAdminConfigured) {
      return NextResponse.json({ success: false, error: 'Firebase Admin environment variables missing' }, { status: 500 });
    }
    await adminDb.collection('pricing').doc(id).delete();
    return NextResponse.json({ success: true, message: 'Pricing plan deleted successfully' });
  } catch (error: any) {
    console.error('API /api/pricing DELETE Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
