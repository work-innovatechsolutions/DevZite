import { NextResponse } from 'next/server';
import { seedFirestoreCollections } from '@/lib/firebase/seed';

export async function GET() {
  try {
    const result = await seedFirestoreCollections();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Firestore Seed Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to initialize Firestore collections.' },
      { status: 500 }
    );
  }
}
