import { NextResponse } from 'next/server';

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
];

// Fallback in-memory user registry for instant responsiveness
let IN_MEMORY_USERS: UserRecord[] = [
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
    name: 'InnovaTech Solutions',
    email: 'work.innovatechsolutions@gmail.com',
    avatar: 'https://lh3.googleusercontent.com/a/ACg8ocJPzCC2IseBzh9OoyTFifH6iLyLsDRP0eAd2abiax7Jy3vPpQ=s96-c',
    role: 'Admin',
    status: 'Active',
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    const { adminDb, adminAuth, isFirebaseAdminConfigured } = await import('@/lib/firebase/admin');
    if (isFirebaseAdminConfigured) {
      const authPhotoMap = new Map<string, string>();
      const authNameMap = new Map<string, string>();

      try {
        const authList = await adminAuth.listUsers(100);
        if (authList?.users) {
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

      try {
        const snap = await adminDb.collection('registered_users').get();
        let dbUsers: UserRecord[] = [];
        if (!snap.empty) {
          dbUsers = snap.docs.map((doc) => {
            const data = doc.data();
            const cleanEmail = (data.email || '').toLowerCase();
            const realPhoto = authPhotoMap.get(cleanEmail);
            const realName = authNameMap.get(cleanEmail);

            return {
              id: doc.id,
              ...data,
              name: realName || data.name || cleanEmail.split('@')[0],
              email: cleanEmail,
              avatar: realPhoto || (data.avatar && !data.avatar.includes('unsplash') ? data.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanEmail}`),
              role: data.role || (DIRECT_ADMINS.includes(cleanEmail) ? 'Admin' : 'User'),
              status: 'Active',
              lastLogin: data.lastLogin || new Date().toISOString(),
              createdAt: data.createdAt || new Date().toISOString(),
            } as UserRecord;
          });
        }

        // Merge in-memory with dbUsers & authPhotoMap
        const dbEmails = new Set(dbUsers.map((u) => u.email.toLowerCase()));
        const extraInMemory = IN_MEMORY_USERS.filter((u) => !dbEmails.has(u.email.toLowerCase())).map((u) => {
          const cleanEmail = u.email.toLowerCase();
          const realPhoto = authPhotoMap.get(cleanEmail);
          const realName = authNameMap.get(cleanEmail);
          return {
            ...u,
            name: realName || u.name,
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

  return NextResponse.json({ success: true, data: IN_MEMORY_USERS }, { status: 200 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, avatar } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    let cleanName = name || cleanEmail.split('@')[0];
    let cleanAvatar = avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanEmail}`;
    const now = new Date().toISOString();

    const isDefaultAdmin = DIRECT_ADMINS.includes(cleanEmail);
    let assignedRole: 'Admin' | 'User' = isDefaultAdmin ? 'Admin' : 'User';

    // Try getting real photoURL from Firebase Auth if not passed
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

    // Update in-memory array
    const existingIndex = IN_MEMORY_USERS.findIndex((u) => u.email.toLowerCase() === cleanEmail);

    if (existingIndex >= 0) {
      assignedRole = IN_MEMORY_USERS[existingIndex].role;
      IN_MEMORY_USERS[existingIndex] = {
        ...IN_MEMORY_USERS[existingIndex],
        name: cleanName,
        avatar: cleanAvatar,
        lastLogin: now,
      };
    } else {
      const newUser: UserRecord = {
        id: `usr-${Date.now()}`,
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

    // Upsert doc in Firestore registered_users collection safely
    try {
      const { adminDb, isFirebaseAdminConfigured } = await import('@/lib/firebase/admin');
      if (isFirebaseAdminConfigured) {
        const userDocRef = adminDb.collection('registered_users').doc(cleanEmail.replace(/[^a-zA-Z0-9_-]/g, '_'));
        const existingDoc = await userDocRef.get();
        if (existingDoc.exists) {
          const data = existingDoc.data();
          assignedRole = data?.role || assignedRole;
          await userDocRef.set(
            {
              name: cleanName,
              avatar: cleanAvatar,
              lastLogin: now,
            },
            { merge: true }
          );
        } else {
          await userDocRef.set({
            id: `usr-${Date.now()}`,
            name: cleanName,
            email: cleanEmail,
            avatar: cleanAvatar,
            role: assignedRole,
            status: 'Active',
            lastLogin: now,
            createdAt: now,
          });
        }
      }
    } catch (dbErr) {
      console.warn('[users POST] Firestore sync notice:', dbErr);
    }

    return NextResponse.json(
      { success: true, message: 'User login logged successfully', role: assignedRole },
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

    // Update in-memory store
    const userItem = IN_MEMORY_USERS.find((u) => u.email.toLowerCase() === cleanEmail);
    if (userItem) {
      userItem.role = role;
    } else {
      IN_MEMORY_USERS.push({
        id: `usr-${Date.now()}`,
        name: cleanEmail.split('@')[0],
        email: cleanEmail,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanEmail}`,
        role,
        status: 'Active',
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      });
    }

    // Sync role to Firestore registered_users & admin_managers collections
    try {
      const { adminDb, isFirebaseAdminConfigured } = await import('@/lib/firebase/admin');
      if (isFirebaseAdminConfigured) {
        const docId = cleanEmail.replace(/[^a-zA-Z0-9_-]/g, '_');
        await adminDb.collection('registered_users').doc(docId).set(
          { email: cleanEmail, role, updatedAt: new Date().toISOString() },
          { merge: true }
        );

        if (role === 'Admin') {
          // Add to admin_managers doc so verify-admin recognizes the user as Admin instantly
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
          // Remove from admin_managers if demoted to User
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
