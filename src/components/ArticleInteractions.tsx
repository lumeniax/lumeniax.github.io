import { useState } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface ArticleInteractionsProps {
  articleTitle: string;
  articleUrl: string;
}

export function ArticleInteractions({ articleTitle, articleUrl }: ArticleInteractionsProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const { toast } = useToast();

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    toast({
      title: liked ? "J'aime retiré" : "J'aime ajouté",
      description: `Vous avez ${liked ? "retiré" : "ajouté"} cet article à vos favoris.`,
    });
  };

  const handleComment = () => {
    toast({
      title: "Commentaires",
      description: "La section des commentaires sera bientôt disponible.",
    });
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
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          copyToClipboard(fullUrl);
        }
      }
    } else {
      copyToClipboard(fullUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Lien copié",
        description: "Le lien de l'article a été copié dans le presse-papiers.",
      });
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex items-center gap-6 py-6 px-6 rounded-xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10 mt-8"
    >
      <div className="flex items-center gap-4 flex-1">
        {/* Bouton Aimer */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
            liked
              ? "bg-red-500/20 text-red-500 border border-red-500/30"
              : "bg-background/50 text-foreground/70 border border-primary/20 hover:bg-primary/10 hover:text-primary"
          }`}
          title="Aimer cet article"
        >
          <Heart
            size={18}
            className={liked ? "fill-current" : ""}
          />
          <span className="text-sm font-medium">{likeCount > 0 ? likeCount : "Aimer"}</span>
        </motion.button>

        {/* Bouton Commenter */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleComment}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/50 text-foreground/70 border border-primary/20 hover:bg-primary/10 hover:text-primary transition-all duration-300"
          title="Commenter cet article"
        >
          <MessageCircle size={18} />
          <span className="text-sm font-medium">Commenter</span>
        </motion.button>

        {/* Bouton Partager */}
        <motion.button
          whileHover={{ scale: 1.1 }}
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
