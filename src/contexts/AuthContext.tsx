import React, { useEffect, useState } from 'react';
import type { IdTokenResult, User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import {
  auth,
  clearCachedDriveAccessToken,
  db,
  getCachedDriveAccessToken,
  signInWithGoogleAndDrive,
  signOutFirebase,
} from '../firebase';
import {
  AuthContext,
  ROOT_ADMIN_EMAIL,
  type WorkspaceRole,
} from './AuthContextInstance';

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
  const [delegatedAdminUid, setDelegatedAdminUid] = useState<string | null>(null);
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
        setDelegatedAdminUid(null);
        setCurrentUser(null);
        setIsDemoMode(false);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const isRootAdmin = Boolean(
    currentUser &&
      !isDemoMode &&
      currentUser.emailVerified &&
      currentUser.email?.trim().toLowerCase() === ROOT_ADMIN_EMAIL
  );

  // Check Firestore /admins/{uid} for delegated admin accounts (verified real users only)
  useEffect(() => {
    if (!currentUser || isDemoMode || !currentUser.emailVerified || isRootAdmin) {
      return;
    }

    let cancelled = false;
    const uid = currentUser.uid;

    const verifyDelegatedAdmin = async () => {
      try {
        const snap = await getDoc(doc(db, 'admins', uid));
        if (!cancelled) {
          setDelegatedAdminUid(snap.exists() && snap.data()?.role === 'Admin' ? uid : null);
        }
      } catch {
        if (!cancelled) {
          setDelegatedAdminUid(null);
        }
      }
    };

    void verifyDelegatedAdmin();
    return () => {
      cancelled = true;
    };
  }, [currentUser, isDemoMode, isRootAdmin]);

  const isDelegatedAdmin = Boolean(
    currentUser &&
      !isDemoMode &&
      currentUser.emailVerified &&
      delegatedAdminUid === currentUser.uid
  );

  const isAdmin = isRootAdmin || isDelegatedAdmin;
  const userRole: WorkspaceRole = isAdmin ? 'Admin' : 'Editor';

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
    setDelegatedAdminUid(null);
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
    setDelegatedAdminUid(null);
    setCurrentUser(demoUser);
    setIsDemoMode(true);
    setLoading(false);
    return Promise.resolve();
  };

  const value = {
    currentUser,
    loading,
    isDemoMode,
    isAdmin,
    isRootAdmin,
    userRole,
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
