import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const keys = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_PRIVATE_KEY',
    'ADMIN_EMAILS',
  ];
  
  const status = keys.reduce((acc, key) => {
    const val = process.env[key];
    acc[key] = {
      exists: !!val,
      length: val ? val.length : 0,
      preview: val ? `${val.slice(0, 8)}...` : 'undefined',
    };
    return acc;
  }, {} as Record<string, any>);

  return NextResponse.json({
    success: true,
    status,
    timestamp: new Date().toISOString(),
  });
}
