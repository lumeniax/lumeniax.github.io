import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { fadeUp } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, MessageSquare, ArrowLeft, UserCircle2, Loader2, RefreshCw, AlertCircle, Crown } from "lucide-react";
import {
  fetchPost, fetchSpaces, fetchComments, createComment,
  togglePostLike, toggleCommentLike,
  getForumUser, setForumUser,
  relTime, initials,
  type ForumPost, type ForumComment, type ForumUser,
} from "@/hooks/useForum";

const POLL_MS = 15_000;

export default function ForumPost() {
  const params = useParams<{ spaceId: string; postId: string }>();
  const spaceId = params.spaceId || "";
  const postId = params.postId || "";

  const [post, setPost] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [spaceName, setSpaceName] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<ForumUser | null>(getForumUser());

  const [commentBody, setCommentBody] = useState("");
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [saving, setSaving] = useState(false);
  const [likingPost, setLikingPost] = useState(false);
  const [likingCmtId, setLikingCmtId] = useState<string | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError(null);
    try {
      const [postData, cmts, spaces] = await Promise.all([
        fetchPost(postId),
        fetchComments(postId),
        fetchSpaces(),
      ]);
      setPost(postData);
      setComments(cmts);
      const s = spaces.find(x => x.id === spaceId);
      if (s) setSpaceName(s.name);
    } catch (e) {
      if (!silent) setError("Impossible de charger le post. Veuillez réessayer.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [postId, spaceId]);

  useEffect(() => {
    loadData();
    intervalRef.current = setInterval(() => loadData(true), POLL_MS);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [loadData]);

  function requireUser(action: () => void) {
    const u = getForumUser();
    if (u) { action(); }
    else { setPendingAction(() => action); setShowUserDialog(true); }
  }

  function handleSetUser() {
    if (!nameInput.trim()) return;
    const u = setForumUser(nameInput, true);
    setUser(u);
    setShowUserDialog(false);
    setNameInput("");
    if (pendingAction) { pendingAction(); setPendingAction(null); }
  }

  async function handlePostLike() {
    requireUser(async () => {
      const u = getForumUser();
      if (!u || likingPost || !post) return;
      setLikingPost(true);

      const alreadyLiked = post.likes.includes(u.id);
      const nowLiked = !alreadyLiked;
      setPost(prev => prev ? {
        ...prev,
        like_count: nowLiked ? prev.like_count + 1 : prev.like_count - 1,
        likes: nowLiked ? [...prev.likes, u.id] : prev.likes.filter(id => id !== u.id),
      } : prev);

      try {
        await togglePostLike(postId, u.id);
      } catch {
        loadData(true);
      } finally {
        setLikingPost(false);
      }
    });
  }

  async function handleCommentLike(commentId: string) {
    requireUser(async () => {
      const u = getForumUser();
      if (!u || likingCmtId === commentId) return;
      setLikingCmtId(commentId);

      const cmt = comments.find(c => c.id === commentId);
      const alreadyLiked = cmt?.likes.includes(u.id) ?? false;
      const nowLiked = !alreadyLiked;
      setComments(prev => prev.map(c => {
        if (c.id !== commentId) return c;
        return {
          ...c,
          like_count: nowLiked ? c.like_count + 1 : c.like_count - 1,
          likes: nowLiked ? [...c.likes, u.id] : c.likes.filter(id => id !== u.id),
        };
      }));

      try {
        await toggleCommentLike(commentId, u.id);
      } catch {
        loadData(true);
      } finally {
        setLikingCmtId(null);
      }
    });
  }

  async function submitComment() {
    const u = getForumUser();
    if (!commentBody.trim() || !u) return;
    setSaving(true);
    try {
      const newCmt = await createComment({ postId, body: commentBody.trim() }, u);
      setComments(prev => [...prev, newCmt]);
      setPost(prev => prev ? { ...prev, comment_count: prev.comment_count + 1 } : prev);
      setCommentBody("");
    } catch (e) {
      setError("Erreur lors de l'envoi du commentaire. Veuillez réessayer.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="w-full pt-32 pb-24">
        <div className="container mx-auto px-6 md:px-12 max-w-3xl">
          <Skeleton className="h-6 w-48 mb-8" />
          <Skeleton className="h-64 w-full rounded-2xl mb-10" />
          <Skeleton className="h-32 w-full rounded-2xl mb-8" />
          <div className="space-y-4">
            {[1, 2].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="w-full pt-40 pb-20 text-center px-6">
        <div className="max-w-md mx-auto">
          <AlertCircle className="mx-auto mb-4 text-primary opacity-50" size={48} />
          <h2 className="text-2xl font-serif mb-2">Oups !</h2>
          <p className="text-muted-foreground mb-8">{error || "Post introuvable."}</p>
          <Link href={`/academy/communaute/${spaceId}`}>
            <Button variant="outline" className="gap-2">
              <ArrowLeft size={16} />
              Retour à l'espace
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const postLiked = user ? post.likes.includes(user.id) : false;

  return (
    <div className="w-full pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12 max-w-3xl">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-8 flex-wrap">
          <Link href="/academy/communaute"><span className="hover:text-primary transition-colors cursor-pointer">Communauté</span></Link>
          <span>/</span>
          <Link href={`/academy/communaute/${spaceId}`}><span className="hover:text-primary transition-colors cursor-pointer">{spaceName}</span></Link>
          <span>/</span>
          <span className="text-foreground/70 truncate max-w-[200px]">{post.title}</span>
        </div>

        {/* Post */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="p-8 rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 text-primary text-sm font-bold">{initials(post.author_name)}</span>
            <div>
              <p className="text-sm font-semibold">{post.author_name}</p>
              <p className="text-xs text-muted-foreground">{relTime(post.created_at)}</p>
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-medium mb-4 leading-snug">{post.title}</h1>
          <p className="text-base text-foreground/80 leading-relaxed whitespace-pre-wrap mb-6">{post.body}</p>
          <div className="flex items-center gap-6 pt-4 border-t border-border/40">
            <button
              onClick={handlePostLike}
              disabled={likingPost}
              className={`flex items-center gap-2 text-sm font-medium transition-all disabled:opacity-60 ${postLiked ? "text-red-400" : "text-muted-foreground hover:text-red-400"}`}
            >
              <Heart size={16} fill={postLiked ? "currentColor" : "none"} />
              {post.like_count} j'aime
            </button>
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <MessageSquare size={16} />{comments.length} commentaire{comments.length !== 1 ? "s" : ""}
            </span>
            <button
              onClick={() => loadData(true)}
              disabled={refreshing}
              title="Rafraîchir"
              className="ml-auto p-1.5 rounded-lg border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/40 transition-all disabled:opacity-40"
            >
              <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
            </button>
          </div>
        </motion.div>

        {/* Comment form */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-serif font-semibold">
            {comments.length > 0 ? `${comments.length} commentaire${comments.length !== 1 ? "s" : ""}` : "Aucun commentaire encore"}
          </h2>
        </div>

        <div className="mb-8 p-5 rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80">
          {user ? (
            <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground text-xs font-bold">{initials(user.name)}</span>
              Répondre en tant que <span className="font-semibold text-foreground">{user.name}</span>
              {user.isPremium && <Crown size={14} className="text-amber-500 ml-1" />}
            </div>
          ) : (
            <button onClick={() => setShowUserDialog(true)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-3">
              <UserCircle2 size={16} />Rejoindre pour répondre
            </button>
          )}
          <Textarea
            placeholder="Votre réponse…"
            value={commentBody}
            onChange={e => setCommentBody(e.target.value)}
            rows={3}
            maxLength={1000}
            className="mb-3"
            onKeyDown={e => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) requireUser(submitComment); }}
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Ctrl+Entrée pour envoyer</p>
            <Button size="sm" onClick={() => requireUser(submitComment)} disabled={!commentBody.trim() || saving} className="bg-gradient-to-r from-primary to-secondary">
              {saving ? <Loader2 className="animate-spin" size={14} /> : "Répondre"}
            </Button>
          </div>
        </div>

        {/* Error message if any */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-primary bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 mb-6">
            <AlertCircle size={15} />{error}
          </div>
        )}

        {/* Comments */}
        <div className="space-y-4">
          {comments.map((cmt, i) => {
            const cLiked = user ? cmt.likes.includes(user.id) : false;
            return (
              <motion.div
                key={cmt.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="p-5 rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-secondary/15 to-primary/15 text-secondary text-xs font-bold">{initials(cmt.author_name)}</span>
                  <div>
                    <p className="text-sm font-semibold">{cmt.author_name}</p>
                    <p className="text-xs text-muted-foreground">{relTime(cmt.created_at)}</p>
                  </div>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap mb-3">{cmt.body}</p>
                <button
                  onClick={() => handleCommentLike(cmt.id)}
                  disabled={likingCmtId === cmt.id}
                  className={`flex items-center gap-1.5 text-xs font-medium transition-colors disabled:opacity-60 ${cLiked ? "text-red-400" : "text-muted-foreground hover:text-red-400"}`}
                >
                  <Heart size={12} fill={cLiked ? "currentColor" : "none"} />
                  {cmt.like_count}
                </button>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12">
          <Link href={`/academy/communaute/${spaceId}`}>
            <Button variant="outline" size="sm" className="gap-2"><ArrowLeft size={14} />Retour à {spaceName || "l'espace"}</Button>
          </Link>
        </div>
      </div>

      {/* Dialog: pseudo */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle className="font-serif flex items-center gap-2">
            <Crown size={20} className="text-amber-500" />
            Rejoindre la Communauté Premium
          </DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Choisissez un pseudo visible par toute la communauté.</p>
          <Input
            placeholder="Votre pseudo (ex : Amara K.)"
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSetUser()}
            autoFocus
          />
          <Button onClick={handleSetUser} disabled={!nameInput.trim()} className="w-full bg-gradient-to-r from-primary to-secondary">Confirmer</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
