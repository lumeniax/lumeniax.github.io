import { useEffect, useState } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import {
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { getUserId } from "@/lib/user-id";

interface ArticleInteractionsProps {
  articleId: string;
  articleTitle: string;
  articleUrl: string;
  onCommentClick?: () => void;
}

export function ArticleInteractions({
  articleId,
  articleTitle,
  articleUrl,
  onCommentClick,
}: ArticleInteractionsProps) {
  const [likes, setLikes] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();
  const userId = getUserId();
  const liked = likes.includes(userId);

  // Temps réel : écoute du document article
  useEffect(() => {
    if (!articleId) return;
    const ref = doc(db, "articles", articleId);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        const data = snap.data();
        setLikes(Array.isArray(data?.likes) ? (data!.likes as string[]) : []);
      },
      (err) => console.error("[likes] snapshot error", err)
    );
    return () => unsub();
  }, [articleId]);

  const handleLike = async () => {
    if (!articleId || busy) return;
    setBusy(true);
    const ref = doc(db, "articles", articleId);
    try {
      // Crée le doc s'il n'existe pas, puis applique l'opération atomique.
      await setDoc(
        ref,
        {
          title: articleTitle,
          createdAt: serverTimestamp(),
          likes: [],
        },
        { merge: true }
      );
      await updateDoc(ref, {
        likes: liked ? arrayRemove(userId) : arrayUnion(userId),
      });
    } catch (err) {
      console.error("[likes] toggle error", err);
      toast({
        title: "Action impossible",
        description: "Impossible d'enregistrer votre J'aime pour l'instant.",
      });
    } finally {
      setBusy(false);
    }
  };

  const handleShare = async () => {
    const fullUrl = `${window.location.origin}${articleUrl}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: articleTitle,
          text: `Découvrez cet article: ${articleTitle}`,
          url: fullUrl,
        });
        return;
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(fullUrl);
      toast({
        title: "Lien copié",
        description: "Le lien de l'article a été copié dans le presse-papiers.",
      });
    } catch (err) {
      console.error("[share] clipboard error", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex items-center gap-6 py-6 px-6 rounded-xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10 mt-8"
    >
      <div className="flex items-center gap-4 flex-1 flex-wrap">
        {/* Bouton Aimer */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLike}
          disabled={busy}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 disabled:opacity-60 ${
            liked
              ? "bg-red-500/20 text-red-500 border border-red-500/30"
              : "bg-background/50 text-foreground/70 border border-primary/20 hover:bg-primary/10 hover:text-primary"
          }`}
          title="Aimer cet article"
          aria-pressed={liked}
        >
          <Heart size={18} className={liked ? "fill-current" : ""} />
          <span className="text-sm font-medium tabular-nums">
            {likes.length > 0 ? likes.length : "Aimer"}
          </span>
        </motion.button>

        {/* Bouton Commenter */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCommentClick}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/50 text-foreground/70 border border-primary/20 hover:bg-primary/10 hover:text-primary transition-all duration-300"
          title="Commenter cet article"
        >
          <MessageCircle size={18} />
          <span className="text-sm font-medium">Commenter</span>
        </motion.button>

        {/* Bouton Partager */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/50 text-foreground/70 border border-primary/20 hover:bg-primary/10 hover:text-primary transition-all duration-300"
          title="Partager cet article"
        >
          <Share2 size={18} />
          <span className="text-sm font-medium">Partager</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
