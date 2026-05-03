import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Copy,
  Download,
  Facebook,
  Loader2,
  MessageCircle,
  Send,
  Share2,
  Sparkles,
  X as XIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { prepareArticleShare, warmArticleShare, type PreparedSharePayload } from "@/lib/article-share-kit";
import type { ArticleInput } from "@/lib/viral-summary";
import {
  canUseWebShare,
  downloadSharePoster,
  isMobile,
  shareNative,
  shareToClipboard,
  shareToNetwork,
  type ClipboardState,
  type ShareNetwork,
} from "@/lib/share";

interface ShareButtonProps {
  article: ArticleInput;
  url: string;
  className?: string;
}

const NETWORKS: Array<{
  id: ShareNetwork;
  label: string;
  Icon: typeof Facebook;
  color: string;
}> = [
  { id: "whatsapp", label: "WhatsApp", Icon: MessageCircle, color: "text-emerald-500" },
  { id: "facebook", label: "Facebook", Icon: Facebook, color: "text-blue-500" },
  { id: "messenger", label: "Messenger", Icon: Send, color: "text-sky-500" },
  { id: "telegram", label: "Telegram", Icon: Send, color: "text-cyan-500" },
  { id: "twitter", label: "X", Icon: XIcon, color: "text-foreground" },
];

function clipboardDescription(clipboard: ClipboardState) {
  if (clipboard.image) {
    return "Texte et image sont prêts dans le presse-papiers.";
  }
  if (clipboard.text) {
    return "Résumé et lien sont prêts dans le presse-papiers.";
  }
  return "Le partage est prêt.";
}

export function ShareButton({ article, url, className }: ShareButtonProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState<PreparedSharePayload | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "copied" | "downloaded">("idle");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const feedbackTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  useEffect(() => {
    let cancelled = false;
    setPayload(null);
    warmArticleShare(article, url);

    prepareArticleShare(article, url)
      .then((prepared) => {
        if (!cancelled) setPayload(prepared);
      })
      .catch(() => {
        if (!cancelled) setPayload(null);
      });

    return () => {
      cancelled = true;
    };
  }, [
    article.id,
    article.title,
    article.content,
    article.description,
    article.category,
    article.icon,
    url,
  ]);

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) {
        window.clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);

  function setTransientFeedback(next: "copied" | "downloaded") {
    setFeedback(next);
    if (feedbackTimerRef.current) {
      window.clearTimeout(feedbackTimerRef.current);
    }
    feedbackTimerRef.current = window.setTimeout(() => {
      setFeedback("idle");
      feedbackTimerRef.current = null;
    }, 1800);
  }

  async function ensurePrepared() {
    if (payload) return payload;

    setLoading(true);
    try {
      const prepared = await prepareArticleShare(article, url);
      setPayload(prepared);
      return prepared;
    } catch (error) {
      toast({
        title: "Partage indisponible",
        description: (error as Error).message,
      });
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function handlePrimary() {
    const prepared = await ensurePrepared();
    if (!prepared) return;

    if (canUseWebShare() && isMobile()) {
      const outcome = await shareNative(prepared);
      if (outcome.kind === "native" || outcome.kind === "cancelled") {
        return;
      }
      if (outcome.kind === "clipboard") {
        setTransientFeedback("copied");
        toast({
          title: "Pack copié",
          description: clipboardDescription(outcome.clipboard),
        });
        return;
      }
      if (outcome.kind === "error") {
        toast({
          title: "Partage indisponible",
          description: outcome.message,
        });
      }
    }

    setOpen(true);
  }

  async function handleNetwork(network: ShareNetwork) {
    const prepared = await ensurePrepared();
    if (!prepared) return;

    const outcome = await shareToNetwork(network, prepared);
    if (outcome.kind === "deeplink") {
      toast({
        title: `${NETWORKS.find((entry) => entry.id === network)?.label || network} ouvert`,
        description: clipboardDescription(outcome.clipboard),
      });
      setOpen(false);
      return;
    }

    if (outcome.kind === "error") {
      toast({
        title: "Partage indisponible",
        description: outcome.message,
      });
    }
  }

  async function handleCopy() {
    const prepared = await ensurePrepared();
    if (!prepared) return;

    const outcome = await shareToClipboard(prepared);
    if (outcome.kind === "clipboard") {
      setTransientFeedback("copied");
      toast({
        title: "Pack copié",
        description: clipboardDescription(outcome.clipboard),
      });
      return;
    }

    if (outcome.kind === "error") {
      toast({
        title: "Copie impossible",
        description: outcome.message,
      });
    }
  }

  async function handleDownload() {
    const prepared = await ensurePrepared();
    if (!prepared) return;

    const outcome = await downloadSharePoster(prepared.poster);
    if (outcome.kind === "download") {
      setTransientFeedback("downloaded");
      toast({
        title: "Image téléchargée",
        description: "Le visuel de partage est prêt pour vos réseaux.",
      });
      return;
    }

    if (outcome.kind === "error") {
      toast({
        title: "Téléchargement impossible",
        description: outcome.message,
      });
    }
  }

  const summary = payload?.summary;
  const poster = payload?.poster;

  return (
    <div
      ref={wrapperRef}
      className={`relative inline-block ${className || ""}`}
      onMouseEnter={() => warmArticleShare(article, url)}
      onTouchStart={() => warmArticleShare(article, url)}
    >
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={handlePrimary}
        disabled={loading}
        className="group flex items-center gap-2 rounded-full border border-primary/20 bg-background/60 px-4 py-2 text-foreground/75 shadow-[0_14px_34px_-22px_rgba(79,127,255,0.55)] backdrop-blur-sm transition-all duration-300 hover:border-primary/35 hover:bg-primary/10 hover:text-primary disabled:opacity-60"
        title="Partager cet article"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/0 via-primary/10 to-accent/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {loading ? (
          <Loader2 size={18} className="relative z-10 animate-spin" />
        ) : feedback === "copied" ? (
          <Check size={18} className="relative z-10 text-emerald-500" />
        ) : feedback === "downloaded" ? (
          <Download size={18} className="relative z-10 text-primary" />
        ) : (
          <Share2 size={18} className="relative z-10" />
        )}
        <span className="relative z-10 text-sm font-medium">
          {loading
            ? "Préparation…"
            : feedback === "copied"
            ? "Copié"
            : feedback === "downloaded"
            ? "Image prête"
            : "Partager"}
        </span>
      </motion.button>

      <AnimatePresence>
        {open && summary && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 z-30 mt-3 w-[24rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[1.7rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(79,127,255,0.14),transparent_38%),linear-gradient(180deg,rgba(18,22,33,0.98),rgba(10,12,20,0.98))] p-3 text-popover-foreground shadow-[0_30px_80px_-34px_rgba(0,0,0,0.95),0_18px_48px_-32px_rgba(79,127,255,0.4)] backdrop-blur-2xl"
          >
            <div className="mb-3 flex items-center gap-2 px-1 text-xs text-muted-foreground">
              <Sparkles size={14} className="text-primary" />
              <span>Pack social prêt</span>
              <span className="ml-auto inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-medium text-foreground/80">
                Score {summary.score}/10
              </span>
            </div>

            {poster && (
              <div className="mb-3 overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/5">
                <img
                  src={poster.dataUrl}
                  alt={poster.alt}
                  className="block h-auto w-full"
                  loading="lazy"
                />
              </div>
            )}

            <div className="mb-3 rounded-[1.25rem] border border-white/10 bg-white/5 p-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/90">
                Hook instantané
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground/88">
                {summary.hook}
              </p>
              {summary.keywords.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {summary.keywords.slice(0, 3).map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full border border-white/10 bg-background/55 px-2.5 py-1 text-[11px] text-muted-foreground"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid gap-1">
              {NETWORKS.map(({ id, label, Icon, color }) => (
                <button
                  key={id}
                  role="menuitem"
                  onClick={() => handleNetwork(id)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/6"
                >
                  <Icon size={18} className={color} />
                  <span className="text-sm text-foreground/88">{label}</span>
                </button>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-foreground/88 transition-colors hover:bg-white/8"
              >
                {feedback === "copied" ? (
                  <Check size={16} className="text-emerald-500" />
                ) : (
                  <Copy size={16} className="text-muted-foreground" />
                )}
                <span>Copier le pack</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-foreground/88 transition-colors hover:bg-white/8"
              >
                <Download size={16} className="text-muted-foreground" />
                <span>Télécharger</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
