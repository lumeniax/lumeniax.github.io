// ─────────────────────────────────────────────────────────────────────────────
// Firebase initialization (Firestore).
//
// La config web Firebase est PUBLIQUE par design : elle est bundlée côté client
// et identifie simplement votre projet. La sécurité réelle se fait via les
// règles Firestore (Console Firebase → Firestore → Règles).
//
// Les variables VITE_FIREBASE_* peuvent surcharger ces valeurs si nécessaire.
// ─────────────────────────────────────────────────────────────────────────────

import { initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

const env = import.meta.env;

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY ?? "AIzaSyDJmSMa3Zya5cfhPj769J4nzDlORtWiZSc",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN ?? "lumeniax.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID ?? "lumeniax",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET ?? "lumeniax.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "236882294787",
  appId: env.VITE_FIREBASE_APP_ID ?? "1:236882294787:web:97329a656a812b34337636",
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID ?? "G-X7YNGZ21JZ",
};

export const isFirebaseConfigured = !Object.values(firebaseConfig).some(
  (v) => !v || v === "REPLACE_ME"
);

if (!isFirebaseConfigured) {
  console.warn(
    "[firebase] Configuration manquante — vérifiez src/firebase.ts"
  );
}

export const app: FirebaseApp = initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app);
