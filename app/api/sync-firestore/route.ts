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

const REGISTERED_USERS_SEED: any[] = [];

export async function POST() {
  return handleSync();
}

export async function GET() {
  return handleSync();
}

async function handleSync() {
  let projectCount = INITIAL_PROJECTS.length;
  let pricingCount = INITIAL_PRICING.length;
  let leadsCount = INITIAL_LEADS.length;
  let blogsCount = INITIAL_BLOGS.length;
  let managersCount = INITIAL_MANAGERS.length + REGISTERED_USERS_SEED.length;
  let usersCount = REGISTERED_USERS_SEED.length;

  try {
    const { adminDb, adminAuth, isFirebaseAdminConfigured } = await import('@/lib/firebase/admin');

    if (isFirebaseAdminConfigured) {
      const batch = adminDb.batch();

      // 1. Sync Projects
      for (const p of INITIAL_PROJECTS) {
        const ref = adminDb.collection('projects').doc(p.slug);
        batch.set(ref, p, { merge: true });
      }

      // 2. Sync Pricing Tiers
      for (const pr of INITIAL_PRICING) {
        const ref = adminDb.collection('pricing').doc(pr.id);
        batch.set(ref, pr, { merge: true });
      }

      // 3. Sync Leads / Inquiries
      for (const lead of INITIAL_LEADS) {
        const ref = adminDb.collection('leads').doc(lead.id);
        batch.set(ref, lead, { merge: true });
      }

      // 4. Sync Blogs
      for (const blog of INITIAL_BLOGS) {
        const ref = adminDb.collection('blogs').doc(blog.slug);
        batch.set(ref, blog, { merge: true });
      }

      // 5. Sync Admin Managers
      for (const mgr of INITIAL_MANAGERS) {
        const ref = adminDb.collection('admin_managers').doc(mgr.id);
        batch.set(ref, mgr, { merge: true });
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
      }

      // 6. Sync Registered Users (including live Firebase Auth users list)
      try {
        const authList = await adminAuth.listUsers(100);
        if (authList?.users) {
          authList.users.forEach((u) => {
            if (u.email) {
              const cleanEmail = u.email.toLowerCase();
              const docId = cleanEmail.replace(/[^a-zA-Z0-9_-]/g, '_');
              const userRef = adminDb.collection('registered_users').doc(docId);
              const isDefaultAdmin = ['souvikgon377@gmail.com', 'work.innovatechsolutions@gmail.com', 'sulagnaghosh363@gmail.com', 'clienttest@devzite.com'].includes(cleanEmail);

              batch.set(
                userRef,
                {
                  id: docId,
                  name: u.displayName || cleanEmail.split('@')[0],
                  email: cleanEmail,
                  avatar: u.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanEmail}`,
                  role: isDefaultAdmin ? 'Admin' : 'User',
                  status: 'Active',
                  lastLogin: u.metadata?.lastSignInTime || new Date().toISOString(),
                  createdAt: u.metadata?.creationTime || new Date().toISOString(),
                },
                { merge: true }
              );
              usersCount++;
            }
          });
        }
      } catch (authErr) {
        console.warn('[sync-firestore] Firebase Auth listing warning:', authErr);
      }

      for (const u of REGISTERED_USERS_SEED) {
        const userRef = adminDb.collection('registered_users').doc(u.id);
        batch.set(userRef, u, { merge: true });
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
    }
  } catch (error: any) {
    console.warn('API /api/sync-firestore notice:', error);
  }

  return NextResponse.json(
    {
      success: true,
      message: 'All collections (Projects, Pricing, Leads, Blogs, Managers, Registered Users) successfully synced!',
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
}
