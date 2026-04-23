// ─────────────────────────────────────────────────────────────────────────────
// Logique de partage multi-réseaux.
//
// - Web Share API (mobile Android / iOS) si disponible
// - Fallback vers les liens de partage natifs de chaque réseau (intent URLs)
// - Fallback ultime : copie dans le presse-papiers
// - Tracking optionnel des partages dans Firebase Firestore
// ─────────────────────────────────────────────────────────────────────────────

import {
  doc,
  setDoc,
  updateDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase";
import type { ShareNetwork, ViralSummary } from "./viral-summary";
export type { ShareNetwork } from "./viral-summary";

export interface SharePayload {
  articleId: string;
  title: string;
  url: string;
  summary: ViralSummary;
}

export type ShareOutcome =
  | { kind: "native" }
  | { kind: "deeplink"; network: ShareNetwork }
  | { kind: "clipboard" }
  | { kind: "cancelled" }
  | { kind: "error"; message: string };

// ── Détection environnement ──────────────────────────────────────────────────

export function canUseWebShare(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

export function isMobile(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

// ── Construction des liens de partage ────────────────────────────────────────

export function buildShareLink(
  network: ShareNetwork,
  payload: SharePayload
): string {
  const text = payload.summary.variants[network] || payload.summary.text;
  const url = payload.url;
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(payload.title);

  switch (network) {
    case "whatsapp":
      // wa.me fonctionne sur mobile ET desktop (web.whatsapp.com).
      return `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
    case "messenger":
      // Messenger desktop nécessite un app id ; la version mobile fonctionne.
      // On utilise le partage générique fb.com qui redirige correctement.
      return `fb-messenger://share/?link=${encodedUrl}`;
    case "telegram":
      return `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
    case "twitter":
      return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
    default:
      return url;
  }
}

// ── Tracking ─────────────────────────────────────────────────────────────────

async function trackShare(articleId: string, network: ShareNetwork | "native") {
  try {
    const ref = doc(db, "articles", articleId);
    await setDoc(
      ref,
      {
        shares_total: 0,
        shares: {},
        last_shared_at: serverTimestamp(),
      },
      { merge: true }
    );
    await updateDoc(ref, {
      shares_total: increment(1),
      [`shares.${network}`]: increment(1),
      last_shared_at: serverTimestamp(),
    });
  } catch (err) {
    // Le tracking est optionnel : on ne bloque jamais le partage.
    console.warn("[share] tracking failed", err);
  }
}

// ── Actions de partage ───────────────────────────────────────────────────────

export async function shareNative(payload: SharePayload): Promise<ShareOutcome> {
  if (!canUseWebShare()) {
    return shareToClipboard(payload);
  }
  try {
    await navigator.share({
      title: payload.title,
      text: payload.summary.text,
      url: payload.url,
    });
    void trackShare(payload.articleId, "native");
    return { kind: "native" };
  } catch (err) {
    const e = err as Error;
    if (e.name === "AbortError") return { kind: "cancelled" };
    // Si l'API native échoue, on bascule sur le presse-papiers.
    return shareToClipboard(payload);
  }
}

export async function shareToNetwork(
  network: ShareNetwork,
  payload: SharePayload
): Promise<ShareOutcome> {
  const link = buildShareLink(network, payload);
  try {
    if (typeof window !== "undefined") {
      window.open(link, "_blank", "noopener,noreferrer");
    }
    void trackShare(payload.articleId, network);
    return { kind: "deeplink", network };
  } catch (err) {
    return { kind: "error", message: (err as Error).message };
  }
}

export async function shareToClipboard(payload: SharePayload): Promise<ShareOutcome> {
  const body = `${payload.summary.text}\n\n${payload.url}`;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(body);
    } else {
      // Fallback historique pour très vieux navigateurs.
      const ta = document.createElement("textarea");
      ta.value = body;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    void trackShare(payload.articleId, "default");
    return { kind: "clipboard" };
  } catch (err) {
    return { kind: "error", message: (err as Error).message };
  }
}

// Orchestrateur : Web Share API si dispo, sinon clipboard.
export async function shareArticle(payload: SharePayload): Promise<ShareOutcome> {
  if (canUseWebShare()) return shareNative(payload);
  return shareToClipboard(payload);
}
