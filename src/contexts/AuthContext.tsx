import React, { useEffect, useState } from 'react';
import type { IdTokenResult, User } from 'firebase/auth';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../firebase';
import { AuthContext } from './AuthContextInstance';

const DEMO_USER_KEY = 'lynda_plus_demo_user';

function readPersistedDemoUser(): User | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(DEMO_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    window.localStorage.removeItem(DEMO_USER_KEY);
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => readPersistedDemoUser());
  const [loading, setLoading] = useState<boolean>(() => !readPersistedDemoUser());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user || !window.localStorage.getItem(DEMO_USER_KEY)) {
        setCurrentUser(user);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, pass: string) => {
    window.localStorage.removeItem(DEMO_USER_KEY);
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const logout = async () => {
    window.localStorage.removeItem(DEMO_USER_KEY);
    try {
      await signOut(auth);
    } catch {
      // Ignore Firebase signOut error when running in demo mode
    }
    setCurrentUser(null);
  };

  const signInWithGoogle = async () => {
    window.localStorage.removeItem(DEMO_USER_KEY);
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signInWithFacebook = async () => {
    window.localStorage.removeItem(DEMO_USER_KEY);
    const provider = new FacebookAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signInWithApple = async () => {
    window.localStorage.removeItem(DEMO_USER_KEY);
    const provider = new OAuthProvider('apple.com');
    await signInWithPopup(auth, provider);
  };

  const simulateDemoLogin = () => {
    const demoUser = {
      email: 'elena@lyndaplus.co',
      displayName: 'Elena Rodriguez',
      uid: 'demo-user-123',
      emailVerified: true,
      isAnonymous: false,
      metadata: {},
      providerData: [],
      refreshToken: '',
      tenantId: null,
      phoneNumber: null,
      photoURL: null,
      providerId: 'firebase',
      delete: () => Promise.resolve(),
      getIdToken: () => Promise.resolve(''),
      getIdTokenResult: () => Promise.resolve({} as IdTokenResult),
      reload: () => Promise.resolve(),
      toJSON: () => ({}),
    } as unknown as User;

    window.localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
    setCurrentUser(demoUser);
    setLoading(false);
    return Promise.resolve();
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    signInWithGoogle,
    signInWithFacebook,
    signInWithApple,
    loginAsDemo: simulateDemoLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
