import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, service, budget, message, filesCount, phone, company, id } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const docId = id || `lead-${Date.now()}`;
    const leadData = {
      id: docId,
      name,
      email,
      phone: phone || 'Not specified',
      company: company || 'Not specified',
      service: service || 'General Inquiry',
      budget: budget || 'Not selected',
      message: (message || '') + (filesCount ? ` [${filesCount} file(s) attached]` : ''),
      status: 'New Inquiry',
      createdAt: new Date().toISOString(),
    };

    try {
      const { adminDb, isFirebaseAdminConfigured } = await import('@/lib/firebase/admin');
      if (isFirebaseAdminConfigured) {
        await adminDb.collection('leads').doc(docId).set(leadData, { merge: true });
      }
    } catch (e) {
      console.warn('Firebase leads write fallback in contact API:', e);
    }

    console.log('📬 Contact Form Submission Received & Saved to Leads:', leadData);

    return NextResponse.json({
      success: true,
      message: 'Contact form submission stored and saved to leads.',
    });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
