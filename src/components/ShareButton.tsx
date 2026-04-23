// ─────────────────────────────────────────────────────────────────────────────
// Bouton de partage moderne avec :
//  - génération automatique d'un résumé viral IA (avec loader)
//  - menu animé pour WhatsApp / Facebook / Messenger / Telegram / X / Copier
//  - Web Share API en priorité sur mobile
//  - score de viralité affiché dans le menu
//  - feedback visuel (toast) à chaque étape
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Copy,
  Facebook,
  Loader2,
  MessageCircle,
  Send,
  Share2,
  Sparkles,
  X as XIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  generateShareSummary,
  type ArticleInput,
  type ViralSummary,
} from "@/lib/viral-summary";
import {
  canUseWebShare,
  isMobile,
  shareNative,
  shareToClipboard,
  shareToNetwork,
  type SharePayload,
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
  { id: "whatsapp",  label: "WhatsApp",  Icon: MessageCircle, color: "text-emerald-500" },
  { id: "facebook",  label: "Facebook",  Icon: Facebook,      color: "text-blue-600" },
  { id: "messenger", label: "Messenger", Icon: Send,          color: "text-sky-500" },
  { id: "telegram",  label: "Telegram",  Icon: Send,          color: "text-cyan-500" },
  { id: "twitter",   label: "X",         Icon: XIcon,         color: "text-foreground" },
];

export function ShareButton({ article, url, className }: ShareButtonProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<ViralSummary | null>(null);
  const [justCopied, setJustCopied] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Ferme le menu sur clic extérieur ou Escape.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function ensureSummary(): Promise<ViralSummary | null> {
    if (summary) return summary;
    setLoading(true);
    toast({
      title: "Résumé généré…",
      description: "Création d'une accroche virale pour le partage.",
    });
    try {
      const s = await generateShareSummary(article);
      setSummary(s);
      return s;
    } catch (err) {
      toast({
        title: "Génération impossible",
        description: (err as Error).message,
      });
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function handlePrimary() {
    // Sur mobile, on tente direct la Web Share API native après génération.
    const s = await ensureSummary();
    if (!s) return;

    if (canUseWebShare() && isMobile()) {
      const payload: SharePayload = { articleId: article.id, title: article.title, url, summary: s };
      const out = await shareNative(payload);
      if (out.kind === "native") return;
      if (out.kind === "clipboard") {
        flashCopied();
        return;
      }
      if (out.kind === "cancelled") return;
    }
    // Sur desktop ou si la Web Share API échoue, on ouvre le menu.
    setOpen(true);
  }

  function flashCopied() {
    setJustCopied(true);
    toast({ title: "Lien copié", description: "Résumé viral + lien collés dans le presse-papiers." });
    setTimeout(() => setJustCopied(false), 1800);
  }

  async function handleNetwork(network: ShareNetwork) {
    const s = await ensureSummary();
    if (!s) return;
    const payload: SharePayload = { articleId: article.id, title: article.title, url, summary: s };
    const out = await shareToNetwork(network, payload);
    if (out.kind === "deeplink") {
      toast({ title: "Partage ouvert", description: `Application ${network} lancée.` });
      setOpen(false);
    } else if (out.kind === "error") {
      toast({ title: "Partage impossible", description: out.message });
    }
  }

  async function handleCopy() {
    const s = await ensureSummary();
    if (!s) return;
    const payload: SharePayload = { articleId: article.id, title: article.title, url, summary: s };
    const out = await shareToClipboard(payload);
    if (out.kind === "clipboard") flashCopied();
    else if (out.kind === "error") toast({ title: "Copie impossible", description: out.message });
  }

  return (
    <div ref={wrapperRef} className={`relative inline-block ${className || ""}`}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handlePrimary}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/50 text-foreground/70 border border-primary/20 hover:bg-primary/10 hover:text-primary transition-all duration-300 disabled:opacity-60"
        title="Partager cet article"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : justCopied ? (
          <Check size={18} className="text-emerald-500" />
        ) : (
          <Share2 size={18} />
        )}
        <span className="text-sm font-medium">
          {loading ? "Résumé…" : justCopied ? "Copié" : "Partager"}
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute z-30 mt-2 left-0 w-[22rem] max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-popover text-popover-foreground shadow-xl p-3"
          >
            {summary && (
              <div className="px-2 pb-3 mb-2 border-b border-border/60">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Sparkles size={14} className="text-primary" />
                  <span>Résumé viral généré</span>
                  <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2 py-0.5 font-medium">
                    Score {summary.score}/10
                  </span>
                </div>
                <div className="mt-2 max-h-72 overflow-y-auto pr-1">
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {summary.text}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-1">
              {NETWORKS.map(({ id, label, Icon, color }) => (
                <button
                  key={id}
                  role="menuitem"
                  onClick={() => handleNetwork(id)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors text-left"
                >
                  <Icon size={18} className={color} />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
              <button
                role="menuitem"
                onClick={handleCopy}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors text-left"
              >
                {justCopied ? (
                  <Check size={18} className="text-emerald-500" />
                ) : (
                  <Copy size={18} className="text-muted-foreground" />
                )}
                <span className="text-sm">
                  {justCopied ? "Copié dans le presse-papiers" : "Copier le résumé + lien"}
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
