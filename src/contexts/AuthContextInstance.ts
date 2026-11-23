import { createContext } from 'react';
import type { User } from 'firebase/auth';

export interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  isDemoMode: boolean;
  driveAccessToken: string | null;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<{ user: User; accessToken: string | null }>;
  connectGoogleDrive: () => Promise<string | null>;
  clearDriveToken: () => void;
  loginAsDemo: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
