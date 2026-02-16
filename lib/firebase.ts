import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile as fbUpdateProfile, signOut as fbSignOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration pulled from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize app only once
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

// Export auth and firestore DB for use by other modules
export const auth = getAuth();
export const db = getFirestore();

export default null;

// --- Auth helper wrappers (keep Auth helpers here) ---
export const firebaseSignIn = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const firebaseSignUp = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

export const firebaseUpdateProfile = (profile: { displayName?: string }) =>
  fbUpdateProfile(auth.currentUser as any, profile);

export const firebaseSignOut = () => fbSignOut(auth);
