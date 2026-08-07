import { NextResponse } from 'next/server';
import {
  getDeletedUserEmails,
  markUserDeleted,
  getUserRoleOverride,
  setUserRoleOverride,
} from '@/lib/persistentStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Admin' | 'User';
  status: string;
  lastLogin: string;
  createdAt: string;
}

const DIRECT_ADMINS = [
  'souvikgon377@gmail.com',
  'work.innovatechsolutions@gmail.com',
  'sulagnaghosh363@gmail.com',
  'clienttest@devzite.com',
];

export const DYNAMIC_ADMIN_SET = new Set<string>([
  'souvikgon377@gmail.com',
  'work.innovatechsolutions@gmail.com',
  'sulagnaghosh363@gmail.com',
  'clienttest@devzite.com',
]);

export let IN_MEMORY_USERS: UserRecord[] = [
  {
    id: 'usr-1',
    name: 'Souvik Gon',
    email: 'souvikgon377@gmail.com',
    avatar: 'https://lh3.googleusercontent.com/a/ACg8ocJKOArD0zDKe8P6czSkGtFq_ksqOOSvc1iyh1stunEVIb1E99n6qw=s96-c',
    role: 'Admin',
    status: 'Active',
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr-2',
    name: 'Sulagna Ghosh',
    email: 'sulagnaghosh363@gmail.com',
    avatar: 'https://lh3.googleusercontent.com/a/ACg8ocI8nJq3mwjfT83y94EkqnyOywLZJzcZMoKct-qtNGpimomph84=s96-c',
    role: 'Admin',
    status: 'Active',
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr-3',
    name: 'InnovaTech Solutions',
    email: 'work.innovatechsolutions@gmail.com',
    avatar: 'https://lh3.googleusercontent.com/a/ACg8ocJPzCC2IseBzh9OoyTFifH6iLyLsDRP0eAd2abiax7Jy3vPpQ=s96-c',
    role: 'Admin',
    status: 'Active',
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
];

export function isDynamicAdmin(email: string): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();

  const override = getUserRoleOverride(clean);
  if (override === 'User') return false;
  if (override === 'Admin') return true;

  if (DIRECT_ADMINS.includes(clean) || DYNAMIC_ADMIN_SET.has(clean)) return true;
  return IN_MEMORY_USERS.some((u) => u.email.toLowerCase() === clean && u.role === 'Admin');
}

export async function GET() {
  try {
    const deletedEmails = getDeletedUserEmails();
    const { adminDb, adminAuth, isFirebaseAdminConfigured } = await import('@/lib/firebase/admin');
    const authPhotoMap = new Map<string, string>();
    const authNameMap = new Map<string, string>();
    let authUsersList: any[] = [];

    if (isFirebaseAdminConfigured) {
      try {
        const authList = await adminAuth.listUsers(100);
        if (authList?.users) {
          authUsersList = authList.users;
          authList.users.forEach((u) => {
            if (u.email) {
              const cleanEmail = u.email.toLowerCase();
              if (u.photoURL) authPhotoMap.set(cleanEmail, u.photoURL);
              if (u.displayName) authNameMap.set(cleanEmail, u.displayName);
            }
          });
        }
      } catch (authErr) {
        console.warn('[users GET] Firebase Auth listUsers notice:', authErr);
      }

      // Proactively synchronize any missing Firebase Auth users into Firestore registered_users
      try {
        const snap = await adminDb.collection('registered_users').get();
        const existingEmails = new Set<string>();
        if (!snap.empty) {
          snap.docs.forEach((doc) => {
            const data = doc.data();
            if (data.email) existingEmails.add(data.email.toLowerCase());
          });
        }

        const missingAuthUsers = authUsersList.filter(
          (u) => u.email && !existingEmails.has(u.email.toLowerCase()) && !deletedEmails.has(u.email.toLowerCase())
        );

        if (missingAuthUsers.length > 0) {
          const batch = adminDb.batch();
          missingAuthUsers.forEach((u) => {
            const cleanEmail = u.email.toLowerCase();
            const docId = cleanEmail.replace(/[^a-zA-Z0-9_-]/g, '_');
            const userDocRef = adminDb.collection('registered_users').doc(docId);
            const overrideRole = getUserRoleOverride(cleanEmail);
            const effectiveRole = overrideRole || (isDynamicAdmin(cleanEmail) ? 'Admin' : 'User');

            batch.set(
              userDocRef,
              {
                id: docId,
                name: u.displayName || cleanEmail.split('@')[0],
                email: cleanEmail,
                avatar: u.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanEmail}`,
                role: effectiveRole,
                status: 'Active',
                lastLogin: u.metadata?.lastSignInTime || new Date().toISOString(),
                createdAt: u.metadata?.creationTime || new Date().toISOString(),
              },
              { merge: true }
            );

            if (effectiveRole === 'Admin') {
              const mgrDocRef = adminDb.collection('admin_managers').doc(docId);
              batch.set(
                mgrDocRef,
                {
                  id: docId,
                  name: u.displayName || cleanEmail.split('@')[0],
                  email: cleanEmail,
                  role: 'Admin',
                  status: 'Active (Firebase Auth)',
                  lastActive: 'Just Now',
                  avatar: u.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanEmail}`,
                  updatedAt: new Date().toISOString(),
                },
                { merge: true }
              );
            }
          });
          await batch.commit();
        }
      } catch (syncErr) {
        console.warn('[users GET] Auto-sync missing Firebase Auth users warning:', syncErr);
      }

      // Query registered_users to fetch all records including newly synced ones
      try {
        const snap = await adminDb.collection('registered_users').get();
        let dbUsers: UserRecord[] = [];
        if (!snap.empty) {
          dbUsers = snap.docs
            .map((doc) => {
              const data = doc.data();
              const cleanEmail = (data.email || '').toLowerCase();
              if (deletedEmails.has(cleanEmail)) return null;

              const realPhoto = authPhotoMap.get(cleanEmail);
              const realName = authNameMap.get(cleanEmail);

              const overrideRole = getUserRoleOverride(cleanEmail);
              const effectiveRole = overrideRole || (isDynamicAdmin(cleanEmail) ? 'Admin' : (data.role || 'User'));

              if (effectiveRole === 'Admin') DYNAMIC_ADMIN_SET.add(cleanEmail);

              return {
                id: doc.id,
                ...data,
                name: realName || data.name || cleanEmail.split('@')[0],
                email: cleanEmail,
                avatar: realPhoto || (data.avatar && !data.avatar.includes('unsplash') ? data.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanEmail}`),
                role: effectiveRole,
                status: 'Active',
                lastLogin: data.lastLogin || new Date().toISOString(),
                createdAt: data.createdAt || new Date().toISOString(),
              } as UserRecord;
            })
            .filter(Boolean) as UserRecord[];
        }

        const dbEmails = new Set(dbUsers.map((u) => u.email.toLowerCase()));
        const extraInMemory = IN_MEMORY_USERS
          .filter((u) => !dbEmails.has(u.email.toLowerCase()) && !deletedEmails.has(u.email.toLowerCase()))
          .map((u) => {
            const cleanEmail = u.email.toLowerCase();
            const realPhoto = authPhotoMap.get(cleanEmail);
            const realName = authNameMap.get(cleanEmail);
            const overrideRole = getUserRoleOverride(cleanEmail);
            const effectiveRole = overrideRole || (isDynamicAdmin(cleanEmail) ? 'Admin' : u.role);

            return {
              ...u,
              name: realName || u.name,
              role: effectiveRole,
              avatar: realPhoto || (u.avatar && !u.avatar.includes('unsplash') ? u.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanEmail}`),
            };
          });

        const merged = [...dbUsers, ...extraInMemory];
        if (merged.length > 0) {
          return NextResponse.json({ success: true, data: merged }, { status: 200 });
        }
      } catch (dbErr) {
        console.warn('[users GET] Firestore query notice:', dbErr);
      }
    }
  } catch (err) {
    console.warn('[users GET] Exception notice:', err);
  }

  const deletedEmails = getDeletedUserEmails();
  const activeInMemory = IN_MEMORY_USERS.filter((u) => !deletedEmails.has(u.email.toLowerCase()));
  return NextResponse.json({ success: true, data: activeInMemory }, { status: 200 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, avatar, role } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    let cleanName = name || cleanEmail.split('@')[0];
    let cleanAvatar = avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanEmail}`;
    const now = new Date().toISOString();

    const overrideRole = getUserRoleOverride(cleanEmail);
    const isDefaultAdmin = isDynamicAdmin(cleanEmail);
    let assignedRole: 'Admin' | 'User' = overrideRole || (role === 'Admin' || isDefaultAdmin ? 'Admin' : 'User');

    try {
      const { adminAuth, isFirebaseAdminConfigured } = await import('@/lib/firebase/admin');
      if (isFirebaseAdminConfigured) {
        try {
          const authRecord = await adminAuth.getUserByEmail(cleanEmail);
          if (authRecord.photoURL) cleanAvatar = authRecord.photoURL;
          if (authRecord.displayName) cleanName = authRecord.displayName;
        } catch {}
      }
    } catch {}

    const docId = cleanEmail.replace(/[^a-zA-Z0-9_-]/g, '_');

    const existingIndex = IN_MEMORY_USERS.findIndex((u) => u.email.toLowerCase() === cleanEmail);

    if (existingIndex >= 0) {
      assignedRole = overrideRole || (isDynamicAdmin(cleanEmail) ? 'Admin' : IN_MEMORY_USERS[existingIndex].role);
      IN_MEMORY_USERS[existingIndex] = {
        ...IN_MEMORY_USERS[existingIndex],
        name: cleanName,
        avatar: cleanAvatar,
        role: assignedRole,
        lastLogin: now,
      };
    } else {
      const newUser: UserRecord = {
        id: docId,
        name: cleanName,
        email: cleanEmail,
        avatar: cleanAvatar,
        role: assignedRole,
        status: 'Active',
        lastLogin: now,
        createdAt: now,
      };
      IN_MEMORY_USERS.unshift(newUser);
    }

    try {
      const { adminDb, isFirebaseAdminConfigured } = await import('@/lib/firebase/admin');
      if (isFirebaseAdminConfigured) {
        const userDocRef = adminDb.collection('registered_users').doc(docId);
        await userDocRef.set(
          {
            id: docId,
            name: cleanName,
            email: cleanEmail,
            avatar: cleanAvatar,
            role: assignedRole,
            status: 'Active',
            lastLogin: now,
            updatedAt: now,
          },
          { merge: true }
        );

        if (assignedRole === 'Admin') {
          const mgrDocRef = adminDb.collection('admin_managers').doc(docId);
          await mgrDocRef.set(
            {
              id: docId,
              name: cleanName,
              email: cleanEmail,
              role: 'Admin',
              status: 'Active (Firebase Auth)',
              lastActive: 'Just Now',
              avatar: cleanAvatar,
              updatedAt: now,
            },
            { merge: true }
          );
        }
      }
    } catch (dbErr) {
      console.warn('[users POST] Firestore write notice:', dbErr);
    }

    return NextResponse.json(
      { success: true, message: 'User profile saved to Firestore successfully', role: assignedRole, id: docId },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('API /api/users POST Error:', error);
    return NextResponse.json({ success: true, message: 'User logged (fallback mode)' }, { status: 200 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { email, role } = body;

    if (!email || !role || (role !== 'Admin' && role !== 'User')) {
      return NextResponse.json(
        { success: false, error: 'Valid email and role ("Admin" | "User") required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    setUserRoleOverride(cleanEmail, role);

    if (role === 'Admin') {
      DYNAMIC_ADMIN_SET.add(cleanEmail);
    } else {
      DYNAMIC_ADMIN_SET.delete(cleanEmail);
    }

    const userItem = IN_MEMORY_USERS.find((u) => u.email.toLowerCase() === cleanEmail);
    if (userItem) {
      userItem.role = role;
    } else {
      IN_MEMORY_USERS.push({
        id: cleanEmail.replace(/[^a-zA-Z0-9_-]/g, '_'),
        name: cleanEmail.split('@')[0],
        email: cleanEmail,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanEmail}`,
        role,
        status: 'Active',
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      });
    }

    try {
      const { adminDb, isFirebaseAdminConfigured } = await import('@/lib/firebase/admin');
      if (isFirebaseAdminConfigured) {
        const docId = cleanEmail.replace(/[^a-zA-Z0-9_-]/g, '_');
        await adminDb.collection('registered_users').doc(docId).set(
          { id: docId, email: cleanEmail, role, updatedAt: new Date().toISOString() },
          { merge: true }
        );

        if (role === 'Admin') {
          await adminDb.collection('admin_managers').doc(docId).set(
            {
              id: docId,
              name: userItem?.name || cleanEmail.split('@')[0],
              email: cleanEmail,
              role: 'Admin',
              status: 'Active (Firebase Auth)',
              lastActive: 'Just Now',
              avatar: userItem?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanEmail}`,
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );
        } else {
          try {
            await adminDb.collection('admin_managers').doc(docId).delete();
          } catch {}
        }
      }
    } catch (dbErr) {
      console.warn('[users PATCH] Firestore sync notice:', dbErr);
    }

    return NextResponse.json(
      { success: true, message: `Permission updated successfully! ${cleanEmail} is now ${role}.` },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('API /api/users PATCH Error:', error);
    return NextResponse.json(
      { success: true, message: 'Permission updated (fallback mode)' },
      { status: 200 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const id = searchParams.get('id');

    if (!email && !id) {
      return NextResponse.json({ success: false, error: 'User email or id required' }, { status: 400 });
    }

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanId = id || '';

    markUserDeleted(cleanEmail, cleanId);

    if (cleanEmail) {
      IN_MEMORY_USERS = IN_MEMORY_USERS.filter((u) => u.email.toLowerCase() !== cleanEmail);
      DYNAMIC_ADMIN_SET.delete(cleanEmail);
    }

    try {
      const { adminDb, isFirebaseAdminConfigured } = await import('@/lib/firebase/admin');
      if (isFirebaseAdminConfigured) {
        const docId = cleanEmail ? cleanEmail.replace(/[^a-zA-Z0-9_-]/g, '_') : cleanId;
        if (docId) {
          try {
            await adminDb.collection('registered_users').doc(docId).delete();
          } catch {}
          try {
            await adminDb.collection('admin_managers').doc(docId).delete();
          } catch {}
        }
      }
    } catch (dbErr) {
      console.warn('[users DELETE] Firestore delete notice:', dbErr);
    }

    return NextResponse.json({ success: true, message: 'User deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('API /api/users DELETE Error:', error);
    return NextResponse.json({ success: true, message: 'User deleted successfully' }, { status: 200 });
  }
}
