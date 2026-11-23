import React, { useEffect, useState } from 'react';
import type { IdTokenResult, User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import {
  auth,
  clearCachedDriveAccessToken,
  getCachedDriveAccessToken,
  signInWithGoogleAndDrive,
  signOutFirebase,
} from '../firebase';
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
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => Boolean(readPersistedDemoUser()));
  const [loading, setLoading] = useState<boolean>(() => !readPersistedDemoUser());
  // Strictly in-memory OAuth access token (never persisted in localStorage/sessionStorage)
  const [driveAccessToken, setDriveAccessToken] = useState<string | null>(() =>
    getCachedDriveAccessToken()
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        window.localStorage.removeItem(DEMO_USER_KEY);
        setCurrentUser(user);
        setIsDemoMode(false);
        setDriveAccessToken(getCachedDriveAccessToken());
        setLoading(false);
      } else if (!window.localStorage.getItem(DEMO_USER_KEY)) {
        clearCachedDriveAccessToken();
        setDriveAccessToken(null);
        setCurrentUser(null);
        setIsDemoMode(false);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    window.localStorage.removeItem(DEMO_USER_KEY);
    const result = await signInWithGoogleAndDrive();
    setCurrentUser(result.user);
    setIsDemoMode(false);
    setDriveAccessToken(result.accessToken);
    setLoading(false);
    return result;
  };

  const connectGoogleDrive = async (): Promise<string | null> => {
    const result = await signInWithGoogle();
    return result.accessToken;
  };

  const clearDriveToken = () => {
    clearCachedDriveAccessToken();
    setDriveAccessToken(null);
  };

  const logout = async () => {
    window.localStorage.removeItem(DEMO_USER_KEY);
    clearCachedDriveAccessToken();
    setDriveAccessToken(null);
    try {
      await signOutFirebase();
    } catch {
      // Ignore Firebase signOut error in demo mode
    }
    setCurrentUser(null);
    setIsDemoMode(false);
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
      providerId: 'demo',
      delete: () => Promise.resolve(),
      getIdToken: () => Promise.resolve(''),
      getIdTokenResult: () => Promise.resolve({} as IdTokenResult),
      reload: () => Promise.resolve(),
      toJSON: () => ({}),
    } as unknown as User;

    window.localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
    clearCachedDriveAccessToken();
    setDriveAccessToken(null);
    setCurrentUser(demoUser);
    setIsDemoMode(true);
    setLoading(false);
    return Promise.resolve();
  };

  const value = {
    currentUser,
    loading,
    isDemoMode,
    driveAccessToken,
    logout,
    signInWithGoogle,
    connectGoogleDrive,
    clearDriveToken,
    loginAsDemo: simulateDemoLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
