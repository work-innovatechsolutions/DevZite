'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  type User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/client';

const authUnavailableError =
  'Firebase Auth is not configured. Set NEXT_PUBLIC_FIREBASE_* environment variables.';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: (e: string, p: string) => Promise<any>;
  registerWithEmail: (e: string, p: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithEmail: async () => {},
  registerWithEmail: async () => {},
  signInWithGoogle: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
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
    return () => unsubscribe();
  }, []);

  const signInWithEmail = (email: string, pass: string) => {
    if (!auth) {
      return Promise.reject(new Error(authUnavailableError));
    }

    return signInWithEmailAndPassword(auth, email, pass);
  };

  const registerWithEmail = (email: string, pass: string) => {
    if (!auth) {
      return Promise.reject(new Error(authUnavailableError));
    }

    return createUserWithEmailAndPassword(auth, email, pass);
  };

  const signInWithGoogle = () => {
    if (!auth) {
      return Promise.reject(new Error(authUnavailableError));
    }

    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const logout = () => {
    if (!auth) {
      return Promise.resolve();
    }

    return firebaseSignOut(auth);
  };

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
