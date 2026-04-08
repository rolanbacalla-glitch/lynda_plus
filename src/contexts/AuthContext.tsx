import React, { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../firebase';
import { AuthContext } from './AuthContextInstance';

const DEMO_USER_KEY = 'lynda_plus_demo_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for persisted demo user first
    const persistedDemoUser = localStorage.getItem(DEMO_USER_KEY);
    if (persistedDemoUser) {
      try {
        setCurrentUser(JSON.parse(persistedDemoUser));
        setLoading(false);
      } catch (err) {
        localStorage.removeItem(DEMO_USER_KEY);
      }
    }

    // Return the unsubscribe from the real Firebase auth changed state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Only set from Firebase if we're not currently in a demo session
      // or if Firebase actually has a user session
      if (user || !localStorage.getItem(DEMO_USER_KEY)) {
        setCurrentUser(user);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, pass: string) => {
    localStorage.removeItem(DEMO_USER_KEY);
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const logout = async () => {
    localStorage.removeItem(DEMO_USER_KEY);
    await signOut(auth);
    setCurrentUser(null);
  };

  const signInWithGoogle = async () => {
    localStorage.removeItem(DEMO_USER_KEY);
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signInWithFacebook = async () => {
    localStorage.removeItem(DEMO_USER_KEY);
    const provider = new FacebookAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signInWithApple = async () => {
    localStorage.removeItem(DEMO_USER_KEY);
    const provider = new OAuthProvider('apple.com');
    await signInWithPopup(auth, provider);
  };

  const simulateDemoLogin = () => {
    const demoUser = { 
      email: 'researcher@lyndaplus.ai', 
      displayName: 'Jason (Demo)',
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
      getIdTokenResult: () => Promise.resolve({} as unknown as any),
      reload: () => Promise.resolve(),
      toJSON: () => ({})
    } as unknown as User;

    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
    setCurrentUser(demoUser);
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
