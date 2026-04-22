// ─────────────────────────────────────────────────────────────────────────────
// Firebase initialization (Firestore only).
//
// Pour configurer Firebase :
//   1. Créez un projet sur https://console.firebase.google.com/
//   2. Activez Firestore Database (mode test pour démarrer)
//   3. Récupérez la config web (Project Settings → "Vos applis" → SDK config)
//   4. Soit collez les valeurs ci-dessous à la place des "REPLACE_ME",
//      soit créez un fichier .env à la racine avec les variables suivantes :
//
//        VITE_FIREBASE_API_KEY=...
//        VITE_FIREBASE_AUTH_DOMAIN=...
//        VITE_FIREBASE_PROJECT_ID=...
//        VITE_FIREBASE_STORAGE_BUCKET=...
//        VITE_FIREBASE_MESSAGING_SENDER_ID=...
//        VITE_FIREBASE_APP_ID=...
// ─────────────────────────────────────────────────────────────────────────────

import { initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

const env = import.meta.env;

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY ?? "REPLACE_ME",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN ?? "REPLACE_ME",
  projectId: env.VITE_FIREBASE_PROJECT_ID ?? "REPLACE_ME",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET ?? "REPLACE_ME",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "REPLACE_ME",
  appId: env.VITE_FIREBASE_APP_ID ?? "REPLACE_ME",
};

export const isFirebaseConfigured = !Object.values(firebaseConfig).some(
  (v) => !v || v === "REPLACE_ME"
);

if (!isFirebaseConfigured) {
  console.warn(
    "[firebase] Configuration manquante — remplacez les placeholders dans src/firebase.ts ou définissez les variables VITE_FIREBASE_* dans .env"
  );
}

export const app: FirebaseApp = initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app);
