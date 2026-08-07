import fs from 'fs';
import path from 'path';

export interface PersistentData {
  deletedManagerIds: string[];
  deletedUserEmails: string[];
  userRoleOverrides: Record<string, 'Admin' | 'User'>;
}

const FILE_PATH = path.join(process.cwd(), '.gemini', 'devzite_db_cache.json');

let inMemoryCache: PersistentData = {
  deletedManagerIds: [],
  deletedUserEmails: [],
  userRoleOverrides: {},
};

// Try loading disk cache if available
try {
  if (fs.existsSync(FILE_PATH)) {
    const raw = fs.readFileSync(FILE_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    inMemoryCache = {
      deletedManagerIds: Array.isArray(parsed.deletedManagerIds) ? parsed.deletedManagerIds : [],
      deletedUserEmails: Array.isArray(parsed.deletedUserEmails) ? parsed.deletedUserEmails : [],
      userRoleOverrides: parsed.userRoleOverrides || {},
    };
  }
} catch (e) {
  // Graceful fallback for read-only serverless lambdas
}

function saveCache() {
  try {
    const dir = path.dirname(FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(inMemoryCache, null, 2), 'utf-8');
  } catch (e) {
    // Ignore write errors on read-only serverless environments
  }
}

export function getDeletedManagerIds(): Set<string> {
  return new Set(inMemoryCache.deletedManagerIds.map((id) => id.toLowerCase()));
}

export function markManagerDeleted(id: string, email?: string) {
  if (id && !inMemoryCache.deletedManagerIds.includes(id.toLowerCase())) {
    inMemoryCache.deletedManagerIds.push(id.toLowerCase());
  }
  if (email && !inMemoryCache.deletedUserEmails.includes(email.toLowerCase())) {
    inMemoryCache.deletedUserEmails.push(email.toLowerCase());
  }
  saveCache();
}

export function getDeletedUserEmails(): Set<string> {
  return new Set(inMemoryCache.deletedUserEmails.map((e) => e.toLowerCase()));
}

export function markUserDeleted(email: string, id?: string) {
  if (email && !inMemoryCache.deletedUserEmails.includes(email.toLowerCase())) {
    inMemoryCache.deletedUserEmails.push(email.toLowerCase());
  }
  if (id && !inMemoryCache.deletedManagerIds.includes(id.toLowerCase())) {
    inMemoryCache.deletedManagerIds.push(id.toLowerCase());
  }
  saveCache();
}

export function getUserRoleOverride(email: string): 'Admin' | 'User' | undefined {
  if (!email) return undefined;
  return inMemoryCache.userRoleOverrides[email.toLowerCase()];
}

export function setUserRoleOverride(email: string, role: 'Admin' | 'User') {
  if (!email) return;
  const clean = email.toLowerCase();
  inMemoryCache.userRoleOverrides[clean] = role;
  // If role is restored, remove from deletedUserEmails
  inMemoryCache.deletedUserEmails = inMemoryCache.deletedUserEmails.filter((e) => e !== clean);
  saveCache();
}
