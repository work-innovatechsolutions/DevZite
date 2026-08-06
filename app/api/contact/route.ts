import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, service, budget, message, filesCount } = body;

    if (!name || !email || !service || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('📬 Contact Form Submission Received:', {
      name,
      email,
      service,
      budget: budget || 'N/A',
      message,
      filesCount: filesCount || 0,
      timestamp: new Date().toISOString(),
    });

    // Simulated email delivery / Firestore record insertion
    return NextResponse.json({
      success: true,
      message: 'Contact form submission stored and notification dispatched.',
    });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
