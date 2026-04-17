import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { fadeUp } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Heart, MessageSquare, ArrowLeft, UserCircle2, Loader2 } from "lucide-react";
import {
  fetchPost, fetchSpaces, fetchComments, createComment,
  togglePostLike, toggleCommentLike,
  getForumUser, setForumUser,
  relTime, initials,
  type ForumPost, type ForumComment, type ForumUser,
} from "@/hooks/useForum";

export default function ForumPost() {
  const params = useParams<{ spaceId: string; postId: string }>();
  const spaceId = params.spaceId || "";
  const postId = params.postId || "";

  const [post, setPost] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [spaceName, setSpaceName] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<ForumUser | null>(null);

  const [commentBody, setCommentBody] = useState("");
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setUser(getForumUser());
    Promise.all([
      fetchPost(postId).then(setPost),
      fetchComments(postId).then(setComments),
      fetchSpaces().then((spaces) => {
        const s = spaces.find((x) => x.id === spaceId);
        if (s) setSpaceName(s.name);
      }),
    ]).finally(() => setLoading(false));
  }, [postId, spaceId]);

  function requireUser(action: () => void) {
    const u = getForumUser();
    if (u) { action(); }
    else { setPendingAction(() => action); setShowUserDialog(true); }
  }

  function handleSetUser() {
    if (!nameInput.trim()) return;
    const u = setForumUser(nameInput);
    setUser(u);
    setShowUserDialog(false);
    setNameInput("");
    if (pendingAction) { pendingAction(); setPendingAction(null); }
  }

  async function handlePostLike() {
    requireUser(async () => {
      const u = getForumUser();
      if (!u) return;
      await togglePostLike(postId, u.id);
      setPost(await fetchPost(postId));
    });
  }

  async function handleCommentLike(commentId: string) {
    requireUser(async () => {
      const u = getForumUser();
      if (!u) return;
      await toggleCommentLike(commentId, u.id);
      setComments(await fetchComments(postId));
    });
  }

  async function submitComment() {
    const u = getForumUser();
    if (!commentBody.trim() || !u) return;
    setSaving(true);
    try {
      await createComment({ postId, body: commentBody.trim() }, u);
      setComments(await fetchComments(postId));
      setCommentBody("");
    } finally { setSaving(false); }
  }

  if (loading) {
    return (
      <div className="w-full pt-40 flex justify-center">
        <Loader2 className="animate-spin text-primary" size={36} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="w-full pt-40 pb-20 text-center">
        <p className="text-muted-foreground">Post introuvable.</p>
        <Link href={`/academy/communaute/${spaceId}`}><Button variant="outline" className="mt-6">← Retour à l'espace</Button></Link>
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
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="p-8 rounded-2xl border border-border/50 bg-card mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary text-sm font-bold">{initials(post.author_name)}</span>
            <div>
              <p className="text-sm font-semibold">{post.author_name}</p>
              <p className="text-xs text-muted-foreground">{relTime(post.created_at)}</p>
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-medium mb-4 leading-snug">{post.title}</h1>
          <p className="text-base text-foreground/80 leading-relaxed whitespace-pre-wrap mb-6">{post.body}</p>
          <div className="flex items-center gap-6 pt-4 border-t border-border/40">
            <button onClick={handlePostLike} className={`flex items-center gap-2 text-sm font-medium transition-all ${postLiked ? "text-red-400" : "text-muted-foreground hover:text-red-400"}`}>
              <Heart size={16} fill={postLiked ? "currentColor" : "none"} />
              {post.like_count} j'aime
            </button>
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <MessageSquare size={16} />{comments.length} commentaire{comments.length !== 1 ? "s" : ""}
            </span>
          </div>
        </motion.div>

        {/* Comment form */}
        <h2 className="text-lg font-serif font-semibold mb-5">
          {comments.length > 0 ? `${comments.length} commentaire${comments.length !== 1 ? "s" : ""}` : "Aucun commentaire encore"}
        </h2>
        <div className="mb-8 p-5 rounded-2xl border border-border/50 bg-card/60">
          {user ? (
            <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold">{initials(user.name)}</span>
              Commenter en tant que <span className="font-semibold text-foreground">{user.name}</span>
            </div>
          ) : (
            <button onClick={() => setShowUserDialog(true)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-3">
              <UserCircle2 size={16} />Définir mon pseudo pour commenter
            </button>
          )}
          <Textarea
            placeholder="Votre commentaire…"
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
            rows={3}
            maxLength={1000}
            className="mb-3"
            onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) requireUser(submitComment); }}
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Ctrl+Entrée pour envoyer</p>
            <Button size="sm" onClick={() => requireUser(submitComment)} disabled={!commentBody.trim() || saving}>
              {saving ? <Loader2 className="animate-spin" size={14} /> : "Commenter"}
            </Button>
          </div>
        </div>

        {/* Comments list */}
        <div className="space-y-4">
          {comments.map((cmt, i) => {
            const cLiked = user ? cmt.likes.includes(user.id) : false;
            return (
              <motion.div key={cmt.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="p-5 rounded-2xl border border-border/50 bg-card">
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary/15 text-secondary text-xs font-bold">{initials(cmt.author_name)}</span>
                  <div>
                    <p className="text-sm font-semibold">{cmt.author_name}</p>
                    <p className="text-xs text-muted-foreground">{relTime(cmt.created_at)}</p>
                  </div>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap mb-3">{cmt.body}</p>
                <button onClick={() => handleCommentLike(cmt.id)} className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${cLiked ? "text-red-400" : "text-muted-foreground hover:text-red-400"}`}>
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
          <DialogHeader><DialogTitle className="font-serif">Qui êtes-vous ?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Choisissez un pseudo visible par la communauté.</p>
          <Input placeholder="Votre pseudo (ex : Amara K.)" value={nameInput} onChange={(e) => setNameInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSetUser()} autoFocus />
          <Button onClick={handleSetUser} disabled={!nameInput.trim()} className="w-full">Confirmer</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
