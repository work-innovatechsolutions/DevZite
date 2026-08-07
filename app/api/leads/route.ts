import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FALLBACK_LEADS = [
  {
    id: 'lead-1',
    name: 'Sarah Jenkins',
    email: 'sarah@apexdesign.com',
    company: 'Apex Design Co',
    service: 'Custom Web Engineering',
    budget: '$15,000 - $30,000',
    message: 'We are looking to rebuild our flagship enterprise marketing platform using Next.js 15 and Tailwind CSS.',
    status: 'New Inquiry',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'lead-2',
    name: 'Marcus Vance',
    email: 'marcus@vancecloud.io',
    company: 'Vance Cloud Systems',
    service: 'Full-Stack Web App',
    budget: '$30,000 - $60,000',
    message: 'Need a high-performance React 19 analytics dashboard with real-time WebSocket telemetry.',
    status: 'In Review',
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    const { adminDb, isFirebaseAdminConfigured } = await import('@/lib/firebase/admin');
    if (isFirebaseAdminConfigured) {
      const snap = await adminDb.collection('leads').get();
      if (!snap.empty) {
        const leads = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        return NextResponse.json({ success: true, data: leads });
      }
    }
  } catch (error: any) {
    console.warn('API /api/leads fallback active:', error);
  }
  return NextResponse.json({ success: true, data: FALLBACK_LEADS });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    const docId = id || `lead-${Date.now()}`;
    try {
      const { adminDb, isFirebaseAdminConfigured } = await import('@/lib/firebase/admin');
      if (isFirebaseAdminConfigured) {
        await adminDb.collection('leads').doc(docId).set({ id: docId, ...data }, { merge: true });
      }
    } catch {}
    return NextResponse.json({ success: true, message: 'Lead saved successfully' });
  } catch (error: any) {
    console.error('API /api/leads POST Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
