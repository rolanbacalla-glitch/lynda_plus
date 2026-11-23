import { createContext } from 'react';
import type { User } from 'firebase/auth';

export const ROOT_ADMIN_EMAIL = 'rolan.bacalla@gmail.com';

export type WorkspaceRole = 'Admin' | 'Editor' | 'Viewer';

export interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  isDemoMode: boolean;
  isAdmin: boolean;
  isRootAdmin: boolean;
  userRole: WorkspaceRole;
  driveAccessToken: string | null;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<{ user: User; accessToken: string | null }>;
  connectGoogleDrive: () => Promise<string | null>;
  clearDriveToken: () => void;
  loginAsDemo: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
