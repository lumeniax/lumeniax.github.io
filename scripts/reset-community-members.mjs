// ─────────────────────────────────────────────────────────────────────────────
// Reset Communauté — vide la liste des membres de TOUS les espaces et remet
// le compteur `member_count` à 0. Ne touche à rien d'autre :
//   • les espaces sont conservés
//   • les posts, commentaires et réponses sont conservés
//   • les compteurs `post_count` / `comment_count` / `like_count` ne sont pas
//     modifiés
//
// Usage (à la racine du projet) :
//   node scripts/reset-community-members.mjs
//
// Le script se connecte à Firestore avec la même config publique que l'app
// (src/firebase.ts). Les règles Firestore actuelles autorisent les écritures
// côté client, donc aucun service-account n'est nécessaire.
// ─────────────────────────────────────────────────────────────────────────────

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  writeBatch,
  doc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey:
    process.env.VITE_FIREBASE_API_KEY ??
    "AIzaSyDJmSMa3Zya5cfhPj769J4nzDlORtWiZSc",
  authDomain:
    process.env.VITE_FIREBASE_AUTH_DOMAIN ?? "lumeniax.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID ?? "lumeniax",
  storageBucket:
    process.env.VITE_FIREBASE_STORAGE_BUCKET ?? "lumeniax.firebasestorage.app",
  messagingSenderId:
    process.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "236882294787",
  appId:
    process.env.VITE_FIREBASE_APP_ID ??
    "1:236882294787:web:97329a656a812b34337636",
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID ?? "G-X7YNGZ21JZ",
};

const SPACES = "spaces";
const BATCH_LIMIT = 400; // marge sous la limite Firestore (500)

async function main() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  console.log(`→ Connexion à Firestore (projet: ${firebaseConfig.projectId})`);
  const snap = await getDocs(collection(db, SPACES));
  console.log(`→ ${snap.size} espace(s) trouvé(s)`);

  if (snap.empty) {
    console.log("✓ Rien à faire.");
    return;
  }

  let processed = 0;
  let touched = 0;
  let batch = writeBatch(db);
  let inBatch = 0;

  for (const d of snap.docs) {
    const data = d.data() ?? {};
    const members = Array.isArray(data.members) ? data.members : [];
    const memberCount =
      typeof data.member_count === "number" ? data.member_count : members.length;

    if (members.length === 0 && memberCount === 0) {
      processed++;
      continue;
    }

    batch.update(doc(db, SPACES, d.id), {
      members: [],
      member_count: 0,
    });
    inBatch++;
    touched++;

    if (inBatch >= BATCH_LIMIT) {
      await batch.commit();
      console.log(`  • lot commit (${inBatch} espaces)`);
      batch = writeBatch(db);
      inBatch = 0;
    }
    processed++;
  }

  if (inBatch > 0) {
    await batch.commit();
    console.log(`  • lot commit (${inBatch} espaces)`);
  }

  console.log(`✓ Terminé — ${touched}/${processed} espace(s) remis à zéro.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("✗ Échec :", err);
    process.exit(1);
  });
