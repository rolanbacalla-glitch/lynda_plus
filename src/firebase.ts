import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import { doc, getDocFromServer, getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

export const GOOGLE_DRIVE_SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.activity',
  'https://www.googleapis.com/auth/drive.activity.readonly',
  'https://www.googleapis.com/auth/drive.appdata',
  'https://www.googleapis.com/auth/drive.apps.readonly',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.install',
  'https://www.googleapis.com/auth/drive.meet.readonly',
  'https://www.googleapis.com/auth/drive.metadata',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.photos.readonly',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.scripts',
] as const;

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const firebaseProjectId = firebaseConfig.projectId;
export const firestoreDatabaseId = firebaseConfig.firestoreDatabaseId;

// Validate connection to Firestore on startup
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
void testConnection();

// Structured Firestore Error Handling
export const OperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  GET: 'get',
  WRITE: 'write',
} as const;

export type OperationType = (typeof OperationType)[keyof typeof OperationType];

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Configure GoogleAuthProvider with requested Google Drive Workspace scopes
const googleProvider = new GoogleAuthProvider();
for (const scope of GOOGLE_DRIVE_SCOPES) {
  googleProvider.addScope(scope);
}
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// In-memory cache ONLY for Google Workspace OAuth access token (never stored in localStorage/sessionStorage)
let cachedDriveAccessToken: string | null = null;
let isSigningIn = false;

onAuthStateChanged(auth, (user) => {
  if (!user && !isSigningIn) {
    cachedDriveAccessToken = null;
  }
});

export async function signInWithGoogleAndDrive(): Promise<{
  user: User;
  accessToken: string | null;
}> {
  isSigningIn = true;
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken ?? null;
    cachedDriveAccessToken = accessToken;
    return { user: result.user, accessToken };
  } finally {
    isSigningIn = false;
  }
}

export function getCachedDriveAccessToken(): string | null {
  return cachedDriveAccessToken;
}

export function clearCachedDriveAccessToken(): void {
  cachedDriveAccessToken = null;
}

export async function signOutFirebase(): Promise<void> {
  cachedDriveAccessToken = null;
  await signOut(auth);
}

// Legacy safe export for any auxiliary service references
export const getGeminiModel = (
  _modelName?: string
): { generateContent: (prompt: string) => Promise<{ response: { text: () => string } }> } | null => {
  void _modelName;
  return null;
};

export default app;
