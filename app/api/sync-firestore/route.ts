import { NextResponse } from 'next/server';
import {
  INITIAL_PROJECTS,
  INITIAL_PRICING,
  INITIAL_LEADS,
  INITIAL_BLOGS,
  INITIAL_MANAGERS,
} from '@/lib/firebase/seed';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const REGISTERED_USERS_SEED = [
  {
    id: 'souvikgon377_gmail_com',
    name: 'Souvik Gon',
    email: 'souvikgon377@gmail.com',
    avatar: 'https://lh3.googleusercontent.com/a/ACg8ocJKOArD0zDKe8P6czSkGtFq_ksqOOSvc1iyh1stunEVIb1E99n6qw=s96-c',
    role: 'Admin',
    status: 'Active',
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'work_innovatechsolutions_gmail_com',
    name: 'InnovaTech Solutions',
    email: 'work.innovatechsolutions@gmail.com',
    avatar: 'https://lh3.googleusercontent.com/a/ACg8ocJPzCC2IseBzh9OoyTFifH6iLyLsDRP0eAd2abiax7Jy3vPpQ=s96-c',
    role: 'Admin',
    status: 'Active',
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sulagnaghosh363_gmail_com',
    name: 'Sulagna Ghosh',
    email: 'sulagnaghosh363@gmail.com',
    avatar: 'https://lh3.googleusercontent.com/a/ACg8ocI8nJq3mwjfT83y94EkqnyOywLZJzcZMoKct-qtNGpimomph84=s96-c',
    role: 'Admin',
    status: 'Active',
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
];

export async function POST() {
  return handleSync();
}

export async function GET() {
  return handleSync();
}

async function handleSync() {
  try {
    const { adminDb, isFirebaseAdminConfigured } = await import('@/lib/firebase/admin');

    if (!isFirebaseAdminConfigured) {
      return NextResponse.json(
        {
          success: false,
          error: 'Firebase Admin SDK is not configured. Set NEXT_PUBLIC_FIREBASE_* & FIREBASE_* environment variables.',
        },
        { status: 503 }
      );
    }

    const batch = adminDb.batch();
    let projectCount = 0;
    let pricingCount = 0;
    let leadsCount = 0;
    let blogsCount = 0;
    let managersCount = 0;
    let usersCount = 0;

    // 1. Sync Projects
    for (const p of INITIAL_PROJECTS) {
      const ref = adminDb.collection('projects').doc(p.slug);
      batch.set(ref, p, { merge: true });
      projectCount++;
    }

    // 2. Sync Pricing Tiers
    for (const pr of INITIAL_PRICING) {
      const ref = adminDb.collection('pricing').doc(pr.id);
      batch.set(ref, pr, { merge: true });
      pricingCount++;
    }

    // 3. Sync Leads / Inquiries
    for (const lead of INITIAL_LEADS) {
      const ref = adminDb.collection('leads').doc(lead.id);
      batch.set(ref, lead, { merge: true });
      leadsCount++;
    }

    // 4. Sync Blogs
    for (const blog of INITIAL_BLOGS) {
      const ref = adminDb.collection('blogs').doc(blog.slug);
      batch.set(ref, blog, { merge: true });
      blogsCount++;
    }

    // 5. Sync Admin Managers
    for (const mgr of INITIAL_MANAGERS) {
      const ref = adminDb.collection('admin_managers').doc(mgr.id);
      batch.set(ref, mgr, { merge: true });
      managersCount++;
    }

    for (const u of REGISTERED_USERS_SEED) {
      const mgrRef = adminDb.collection('admin_managers').doc(u.id);
      batch.set(
        mgrRef,
        {
          id: u.id,
          name: u.name,
          email: u.email,
          role: 'Admin',
          status: 'Active (Firebase Auth)',
          lastActive: 'Just Now',
          avatar: u.avatar,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      managersCount++;
    }

    // 6. Sync Registered Users
    for (const u of REGISTERED_USERS_SEED) {
      const userRef = adminDb.collection('registered_users').doc(u.id);
      batch.set(userRef, u, { merge: true });
      usersCount++;
    }

    // 7. Sync System Config
    const configRef = adminDb.collection('system').doc('config');
    batch.set(
      configRef,
      {
        aiAssistantEnabled: true,
        customCursorEnabled: true,
        version: '3.0.0',
        lastSynced: new Date().toISOString(),
      },
      { merge: true }
    );

    await batch.commit();

    return NextResponse.json(
      {
        success: true,
        message: 'All collections (Projects, Pricing, Leads, Blogs, Managers, Registered Users) successfully synced to Firestore!',
        stats: {
          projects: projectCount,
          pricing: pricingCount,
          leads: leadsCount,
          blogs: blogsCount,
          managers: managersCount,
          registeredUsers: usersCount,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('API /api/sync-firestore Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Error syncing data to Firestore',
      },
      { status: 500 }
    );
  }
}
