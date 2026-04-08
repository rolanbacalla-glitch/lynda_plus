import { initializeApp } from "firebase/app";
import { getAI, getGenerativeModel } from "firebase/ai";
import { getAuth } from "firebase/auth";

// Firebase configuration using Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase only if API key exists, otherwise log a warning
// This prevents the whole app from crashing in demo environments
const app = firebaseConfig.apiKey 
  ? initializeApp(firebaseConfig)
  : initializeApp({ apiKey: "demo-key", projectId: "demo-project" });

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firebase AI (Gemini)
// Provide a safe check for AI initialization
let aiInstance;
try {
  aiInstance = getAI(app);
} catch (e) {
  console.warn("Firebase AI initialization failed. Continuing with mock analysis.", e);
}

export const ai = aiInstance;

/**
 * Gets a reference to a Gemini generative model via Firebase.
 */
export const getGeminiModel = (modelName = "gemini-1.5-flash") => {
  if (!ai) return null;
  return getGenerativeModel(ai, { model: modelName });
};

export default app;
