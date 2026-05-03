import {
  doc,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import type { SharePoster } from "./share-poster";
import type { ShareNetwork, ViralSummary } from "./viral-summary";

export type { ShareNetwork } from "./viral-summary";

export interface SharePayload {
  articleId: string;
  title: string;
  url: string;
  summary: ViralSummary;
  poster?: SharePoster | null;
}

export interface ClipboardState {
  text: boolean;
  image: boolean;
}

export type ShareOutcome =
  | { kind: "native"; imageIncluded: boolean }
  | { kind: "deeplink"; network: ShareNetwork; clipboard: ClipboardState }
  | { kind: "clipboard"; clipboard: ClipboardState }
  | { kind: "download"; filename: string }
  | { kind: "cancelled" }
  | { kind: "error"; message: string };

export function canUseWebShare() {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

export function isMobile() {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

function buildShareText(payload: SharePayload, network: ShareNetwork = "default") {
  return payload.summary.variants[network] || payload.summary.variants.default || payload.summary.text;
}

function buildClipboardBody(payload: SharePayload) {
  return `${buildShareText(payload)}\n\n${payload.url}`;
}

function canSharePosterFile(poster?: SharePoster | null) {
  if (!poster?.file || typeof navigator === "undefined" || typeof navigator.canShare !== "function") {
    return false;
  }

  try {
    return navigator.canShare({ files: [poster.file] });
  } catch {
    return false;
  }
}

async function trackShare(
  articleId: string,
  network: ShareNetwork | "native",
) {
  try {
    const reference = doc(db, "articles", articleId);
    await setDoc(
      reference,
      {
        shares_total: 0,
        shares: {},
        last_shared_at: serverTimestamp(),
      },
      { merge: true },
    );
    await updateDoc(reference, {
      shares_total: increment(1),
      [`shares.${network}`]: increment(1),
      last_shared_at: serverTimestamp(),
    });
  } catch (error) {
    console.warn("[share] tracking failed", error);
  }
}

async function fallbackCopyText(body: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(body);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = body;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

async function copySharePackToClipboard(payload: SharePayload): Promise<ClipboardState> {
  const body = buildClipboardBody(payload);
  let text = false;
  let image = false;

  if (
    payload.poster?.blob &&
    typeof navigator !== "undefined" &&
    navigator.clipboard?.write &&
    typeof ClipboardItem !== "undefined"
  ) {
    try {
      const item = new ClipboardItem({
        [payload.poster.mimeType]: payload.poster.blob,
        "text/plain": new Blob([body], { type: "text/plain" }),
      });
      await navigator.clipboard.write([item]);
      return { text: true, image: true };
    } catch (error) {
      console.warn("[share] rich clipboard failed", error);
    }
  }

  await fallbackCopyText(body);
  text = true;
  return { text, image };
}

export function buildShareLink(network: ShareNetwork, payload: SharePayload) {
  const text = buildShareText(payload, network);
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(payload.url);

  switch (network) {
    case "whatsapp":
      return `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
    case "messenger":
      return `fb-messenger://share/?link=${encodedUrl}`;
    case "telegram":
      return `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
    case "twitter":
      return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
    default:
      return payload.url;
  }
}

export async function shareNative(payload: SharePayload): Promise<ShareOutcome> {
  if (!canUseWebShare()) {
    return shareToClipboard(payload);
  }

  try {
    const shareData: ShareData = {
      title: payload.title,
      text: buildShareText(payload),
      url: payload.url,
    };
    let imageIncluded = false;

    if (canSharePosterFile(payload.poster)) {
      shareData.files = [payload.poster!.file!];
      imageIncluded = true;
    }

    await navigator.share(shareData);
    void trackShare(payload.articleId, "native");
    return { kind: "native", imageIncluded };
  } catch (error) {
    const shareError = error as Error;
    if (shareError.name === "AbortError") return { kind: "cancelled" };
    return shareToClipboard(payload);
  }
}

export async function shareToNetwork(
  network: ShareNetwork,
  payload: SharePayload,
): Promise<ShareOutcome> {
  const link = buildShareLink(network, payload);

  try {
    if (typeof window !== "undefined") {
      window.open(link, "_blank", "noopener,noreferrer");
    }
  } catch (error) {
    return { kind: "error", message: (error as Error).message };
  }

  const clipboard = await copySharePackToClipboard(payload).catch((error) => {
    console.warn("[share] clipboard companion failed", error);
    return { text: false, image: false };
  });

  void trackShare(payload.articleId, network);
  return { kind: "deeplink", network, clipboard };
}

export async function shareToClipboard(payload: SharePayload): Promise<ShareOutcome> {
  try {
    const clipboard = await copySharePackToClipboard(payload);
    void trackShare(payload.articleId, "default");
    return { kind: "clipboard", clipboard };
  } catch (error) {
    return { kind: "error", message: (error as Error).message };
  }
}

export async function downloadSharePoster(poster?: SharePoster | null): Promise<ShareOutcome> {
  if (!poster) {
    return { kind: "error", message: "Aucune image de partage disponible." };
  }

  try {
    const href = URL.createObjectURL(poster.blob);
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = poster.filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setTimeout(() => URL.revokeObjectURL(href), 1000);
    return { kind: "download", filename: poster.filename };
  } catch (error) {
    return { kind: "error", message: (error as Error).message };
  }
}

export async function shareArticle(payload: SharePayload): Promise<ShareOutcome> {
  if (canUseWebShare()) return shareNative(payload);
  return shareToClipboard(payload);
}
