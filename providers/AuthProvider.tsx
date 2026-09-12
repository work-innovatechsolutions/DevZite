'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import type { User, UserCredential } from 'firebase/auth';
import { hasFirebaseClientConfig, getFirebaseAuth } from '@/lib/firebase/client';

const authUnavailableError =
  'Firebase Auth is not configured. Set NEXT_PUBLIC_FIREBASE_* environment variables.';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: (e: string, p: string) => Promise<UserCredential>;
  registerWithEmail: (e: string, p: string) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  signInWithEmail: async () => { throw new Error('Not implemented'); },
  registerWithEmail: async () => { throw new Error('Not implemented'); },
  signInWithGoogle: async () => { throw new Error('Not implemented'); },
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = Boolean(
    pathname && (
      pathname.startsWith('/admin') ||
      pathname.startsWith('/client') ||
      pathname.startsWith('/login') ||
      pathname.startsWith('/register') ||
      pathname.startsWith('/forgot-password')
    )
  );

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() => isAuthRoute && hasFirebaseClientConfig);

  useEffect(() => {
    if (!isAuthRoute || !hasFirebaseClientConfig) {
      return;
    }

    let unsubscribe: (() => void) | undefined;
    let isMounted = true;

    async function subscribeAuth() {
      try {
        const auth = await getFirebaseAuth();
        if (!auth || !isMounted) {
          if (isMounted) setLoading(false);
          return;
        }

        const { onAuthStateChanged } = await import('firebase/auth');
        unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          if (!isMounted) return;
          setUser(currentUser);
          setLoading(false);

          if (currentUser && currentUser.email) {
            fetch('/api/users', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: currentUser.email,
                name: currentUser.displayName || currentUser.email.split('@')[0],
                avatar: currentUser.photoURL || '',
              }),
            }).catch((err) => console.warn('[AuthProvider] User log sync notice:', err));
          }
        });
      } catch (err) {
        console.warn('[AuthProvider] Auth initialization notice:', err);
        if (isMounted) setLoading(false);
      }
    }

    subscribeAuth();

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, [isAuthRoute]);

  const signInWithEmail = useCallback(async (email: string, pass: string) => {
    const auth = await getFirebaseAuth();
    if (!auth) {
      return Promise.reject(new Error(authUnavailableError));
    }
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    const result = await signInWithEmailAndPassword(auth, email, pass);
    setUser(result.user);
    return result;
  }, []);

  const registerWithEmail = useCallback(async (email: string, pass: string) => {
    const auth = await getFirebaseAuth();
    if (!auth) {
      return Promise.reject(new Error(authUnavailableError));
    }
    const { createUserWithEmailAndPassword } = await import('firebase/auth');
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    setUser(result.user);
    return result;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const auth = await getFirebaseAuth();
    if (!auth) {
      return Promise.reject(new Error(authUnavailableError));
    }
    const { signInWithPopup, GoogleAuthProvider } = await import('firebase/auth');
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    setUser(result.user);
    return result;
  }, []);

  const logout = useCallback(async () => {
    const auth = await getFirebaseAuth();
    if (!auth) {
      return Promise.resolve();
    }
    const { signOut: firebaseSignOut } = await import('firebase/auth');
    await firebaseSignOut(auth);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithEmail,
        registerWithEmail,
        signInWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

