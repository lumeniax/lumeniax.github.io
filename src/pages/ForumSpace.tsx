import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { fadeUp } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Heart, MessageSquare, PlusCircle, Users, ArrowRight, UserCircle2, Loader2, RefreshCw } from "lucide-react";
import {
  fetchPosts, fetchSpaces, createPost, togglePostLike, toggleMember,
  getForumUser, setForumUser,
  relTime, initials,
  type ForumPost, type ForumSpace, type ForumUser,
} from "@/hooks/useForum";

const POLL_MS = 20_000;

export default function ForumSpace() {
  const params = useParams<{ spaceId: string }>();
  const spaceId = params.spaceId || "";

  const [space, setSpace] = useState<ForumSpace | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<ForumUser | null>(null);

  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showPostDialog, setShowPostDialog] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [saving, setSaving] = useState(false);
  const [likingId, setLikingId] = useState<string | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function loadData(silent = false) {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const [spaces, postsData] = await Promise.all([
        fetchSpaces(),
        fetchPosts(spaceId),
      ]);
      setSpace(spaces.find((s) => s.id === spaceId) || null);
      setPosts(postsData);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    setUser(getForumUser());
    loadData();
    intervalRef.current = setInterval(() => loadData(true), POLL_MS);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [spaceId]);

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

  async function handleLike(postId: string) {
    requireUser(async () => {
      const u = getForumUser();
      if (!u || likingId) return;
      setLikingId(postId);
      try {
        const { liked } = await togglePostLike(postId, u.id);
        setPosts((prev) =>
          prev.map((p) =>
            p.id !== postId ? p : {
              ...p,
              liked,
              like_count: liked ? p.like_count + 1 : p.like_count - 1,
              likes: liked
                ? [...p.likes, u.id]
                : p.likes.filter((id) => id !== u.id),
            }
          )
        );
      } finally {
        setLikingId(null);
      }
    });
  }

  async function handleJoin() {
    requireUser(async () => {
      const u = getForumUser();
      if (!u) return;
      await toggleMember(spaceId, u.id);
      loadData(true);
    });
  }

  async function submitPost() {
    const u = getForumUser();
    if (!postTitle.trim() || !u) return;
    setSaving(true);
    try {
      await createPost({ spaceId, title: postTitle.trim(), body: postBody.trim() }, u);
      setPostTitle(""); setPostBody("");
      setShowPostDialog(false);
      await loadData(true);
    } finally { setSaving(false); }
  }

  if (loading) {
    return (
      <div className="w-full pt-40 flex justify-center">
        <Loader2 className="animate-spin text-primary" size={36} />
      </div>
    );
  }

  if (!space) {
    return (
      <div className="w-full pt-40 pb-20 text-center">
        <p className="text-muted-foreground">Espace introuvable.</p>
        <Link href="/academy/communaute"><Button variant="outline" className="mt-6">← Retour à la communauté</Button></Link>
      </div>
    );
  }

  const isMember = user ? space.members.includes(user.id) : false;

  return (
    <div className="w-full pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">

        {/* Space header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-10 p-8 rounded-2xl border border-border/50 bg-card">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <span className="text-5xl select-none">{space.emoji}</span>
              <div>
                <h1 className="text-3xl font-serif font-medium">{space.name}</h1>
                <p className="text-muted-foreground mt-1 max-w-lg">{space.description}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users size={14} />{space.member_count} membre{space.member_count !== 1 ? "s" : ""}
              </div>
              <Button size="sm" variant={isMember ? "secondary" : "default"} onClick={handleJoin} className="gap-2">
                {isMember ? "✓ Rejoint" : "Rejoindre"}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          {user ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold">{initials(user.name)}</span>
              Connecté en tant que <span className="font-semibold text-foreground">{user.name}</span>
            </div>
          ) : (
            <button onClick={() => setShowUserDialog(true)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <UserCircle2 size={16} />Définir mon pseudo pour participer
            </button>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={() => loadData(true)}
              disabled={refreshing}
              title="Rafraîchir"
              className="p-2 rounded-lg border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/40 transition-all disabled:opacity-40"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            </button>
            <Button onClick={() => requireUser(() => setShowPostDialog(true))} className="gap-2">
              <PlusCircle size={15} />Nouveau post
            </Button>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {posts.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <MessageSquare size={40} className="mx-auto mb-4 opacity-30" />
              <p>Aucun post encore. Soyez le premier !</p>
            </div>
          )}
          {posts.map((post, i) => {
            const liked = user ? post.likes.includes(user.id) : false;
            return (
              <motion.div key={post.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <span className="flex-none flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary text-sm font-bold mt-0.5">
                    {initials(post.author_name)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <Link href={`/academy/communaute/${spaceId}/${post.id}`}>
                      <h3 className="font-serif text-lg font-semibold hover:text-primary transition-colors cursor-pointer line-clamp-2 mb-1">{post.title}</h3>
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.body}</p>
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="text-xs text-muted-foreground">{post.author_name} · {relTime(post.created_at)}</span>
                      <button
                        onClick={() => handleLike(post.id)}
                        disabled={likingId === post.id}
                        className={`flex items-center gap-1.5 text-xs font-medium transition-colors disabled:opacity-60 ${liked ? "text-red-400" : "text-muted-foreground hover:text-red-400"}`}
                      >
                        <Heart size={13} fill={liked ? "currentColor" : "none"} />
                        {post.like_count}
                      </button>
                      <Link href={`/academy/communaute/${spaceId}/${post.id}`}>
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                          <MessageSquare size={13} />{post.comment_count} commentaire{post.comment_count !== 1 ? "s" : ""}
                        </span>
                      </Link>
                      <Link href={`/academy/communaute/${spaceId}/${post.id}`} className="ml-auto">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">Lire <ArrowRight size={12} /></span>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
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

      {/* Dialog: nouveau post */}
      <Dialog open={showPostDialog} onOpenChange={setShowPostDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="font-serif">Nouveau post</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Titre du post" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} maxLength={120} autoFocus />
            <Textarea placeholder="Développez votre idée, question ou partage…" value={postBody} onChange={(e) => setPostBody(e.target.value)} rows={5} maxLength={2000} />
            <Button onClick={submitPost} disabled={!postTitle.trim() || saving} className="w-full">
              {saving ? <Loader2 className="animate-spin" size={16} /> : "Publier"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
