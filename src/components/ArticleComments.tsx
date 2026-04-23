import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, User } from "lucide-react";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { getUserId, getUserName, setUserName } from "@/lib/user-id";

interface CommentDoc {
  id: string;
  author_id: string;
  author_name: string;
  content: string;
  created_at: Timestamp | null;
}

interface Props {
  articleId: string;
  articleTitle: string;
}

function formatRelative(ts: Timestamp | null): string {
  if (!ts) return "à l'instant";
  const d = ts.toDate();
  const diffSec = Math.round((Date.now() - d.getTime()) / 1000);
  if (diffSec < 60) return "à l'instant";
  if (diffSec < 3600) return `il y a ${Math.floor(diffSec / 60)} min`;
  if (diffSec < 86400) return `il y a ${Math.floor(diffSec / 3600)} h`;
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ArticleComments({ articleId, articleTitle }: Props) {
  const userId = getUserId();
  const [name, setName] = useState<string>(() => getUserName());
  const [content, setContent] = useState("");
  const [comments, setComments] = useState<CommentDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();
  const sectionRef = useRef<HTMLDivElement>(null);

  // Temps réel : sous-collection comments
  useEffect(() => {
    if (!articleId) return;
    const q = query(
      collection(db, "articles", articleId, "comments"),
      orderBy("created_at", "asc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list: CommentDoc[] = snap.docs.map((d) => {
          const data = d.data() as Partial<CommentDoc>;
          return {
            id: d.id,
            author_id: data.author_id || "",
            author_name: data.author_name || "Anonyme",
            content: data.content || "",
            created_at: (data.created_at as Timestamp) || null,
          };
        });
        setComments(list);
        setLoading(false);
      },
      (err) => {
        console.error("[comments] snapshot error", err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [articleId]);

  const canSend = useMemo(
    () => content.trim().length > 0 && !sending,
    [content, sending]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;

    setSending(true);
    const finalName = (name.trim() || "Anonyme").slice(0, 40);
    setUserName(finalName);

    try {
      // S'assure que le doc parent existe (pour la cohérence)
      await setDoc(
        doc(db, "articles", articleId),
        {
          title: articleTitle,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      await addDoc(collection(db, "articles", articleId, "comments"), {
        author_id: userId,
        author_name: finalName,
        content: trimmed.slice(0, 2000),
        created_at: serverTimestamp(),
      });
      setContent("");
    } catch (err) {
      console.error("[comments] add error", err);
      toast({
        title: "Envoi impossible",
        description: "Votre commentaire n'a pas pu être publié.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="comments"
      className="mt-12 pt-10 border-t border-border"
      aria-label="Commentaires"
    >
      <div className="flex items-center gap-3 mb-6">
        <MessageCircle className="text-primary" size={20} />
        <h2 className="text-2xl font-serif">
          Commentaires
          <span className="ml-2 text-base text-muted-foreground tabular-nums">
            ({comments.length})
          </span>
        </h2>
      </div>

      {/* Formulaire */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-border/60 bg-card/50 p-4 md:p-5 mb-8 space-y-3"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative sm:w-56">
            <User
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre prénom"
              maxLength={40}
              className="w-full h-10 pl-9 pr-3 text-sm rounded-md bg-background/60 border border-border/50 focus:border-primary/50 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Partagez votre réflexion…"
          rows={3}
          maxLength={2000}
          className="w-full p-3 text-sm rounded-md bg-background/60 border border-border/50 focus:border-primary/50 focus:outline-none transition-colors resize-y min-h-[88px]"
        />

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground tabular-nums">
            {content.length}/2000
          </span>
          <motion.button
            type="submit"
            whileHover={{ scale: canSend ? 1.03 : 1 }}
            whileTap={{ scale: canSend ? 0.97 : 1 }}
            disabled={!canSend}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-md hover:shadow-primary/20"
          >
            <Send size={14} />
            {sending ? "Envoi…" : "Publier"}
          </motion.button>
        </div>
      </form>

      {/* Liste */}
      {loading ? (
        <p className="text-sm text-muted-foreground py-6 text-center">
          Chargement des commentaires…
        </p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted-foreground py-6 text-center">
          Soyez le premier à commenter cet article.
        </p>
      ) : (
        <ul className="space-y-3">
          <AnimatePresence initial={false}>
            {comments.map((c) => {
              const mine = c.author_id === userId;
              const initial = (c.author_name || "?").charAt(0).toUpperCase();
              return (
                <motion.li
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-3 p-4 rounded-xl border transition-colors ${
                    mine
                      ? "bg-primary/5 border-primary/20"
                      : "bg-card/40 border-border/50"
                  }`}
                >
                  <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                    {initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap mb-1">
                      <span className="text-sm font-medium">
                        {c.author_name || "Anonyme"}
                      </span>
                      {mine && (
                        <span className="text-[10px] uppercase tracking-wider text-primary/80 font-semibold">
                          Vous
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatRelative(c.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/90 whitespace-pre-wrap break-words">
                      {c.content}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
    </section>
  );
}
