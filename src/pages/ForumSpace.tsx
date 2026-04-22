import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { fadeUp } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Heart,
  MessageSquare,
  PlusCircle,
  Users,
  ArrowRight,
  UserCircle2,
  Loader2,
  RefreshCw,
  AlertCircle,
  Share2,
  Pencil,
  Trash2,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import {
  subscribePosts,
  subscribeSpaces,
  createPost,
  updatePost,
  deletePost,
  togglePostLike,
  toggleMember,
  getForumUser,
  setForumUser,
  relTime,
  initials,
  type ForumPost,
  type ForumSpace,
  type ForumUser,
} from "@/hooks/useForum";

type Sort = "recent" | "popular";

export default function ForumSpace() {
  const params = useParams<{ spaceId: string }>();
  const spaceId = params.spaceId || "";

  const [space, setSpace] = useState<ForumSpace | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<ForumUser | null>(getForumUser());
  const [sort, setSort] = useState<Sort>("recent");
  const [shareToast, setShareToast] = useState<string | null>(null);

  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showPostDialog, setShowPostDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [saving, setSaving] = useState(false);
  const [likingId, setLikingId] = useState<string | null>(null);
  const [joiningSpace, setJoiningSpace] = useState(false);

  const loadData = useCallback((_silent = false) => {
    // onSnapshot fournit déjà le temps réel ; petit feedback visuel sur clic.
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 400);
  }, []);

  useEffect(() => {
    if (!spaceId) return;
    setLoading(true);
    setError(null);
    let postsReady = false;
    let spaceReady = false;
    const tryStop = () => {
      if (postsReady && spaceReady) setLoading(false);
    };
    const unsubSpaces = subscribeSpaces(
      (list) => {
        const found = list.find((s) => s.id === spaceId) || null;
        setSpace(found);
        if (!found) setError("Espace introuvable");
        spaceReady = true;
        tryStop();
      },
      (err) => {
        console.error("[ForumSpace] subscribeSpaces ÉCHEC:", err);
        setError(err.message);
        setLoading(false);
      }
    );
    const unsubPosts = subscribePosts(
      spaceId,
      (list) => {
        setPosts(list);
        postsReady = true;
        tryStop();
      },
      (err) => {
        console.error("[ForumSpace] subscribePosts ÉCHEC:", err);
        setError(err.message);
        setLoading(false);
      }
    );
    return () => {
      unsubSpaces();
      unsubPosts();
    };
  }, [spaceId]);

  function requireUser(action: () => void) {
    const u = getForumUser();
    if (u) {
      action();
    } else {
      setPendingAction(() => action);
      setShowUserDialog(true);
    }
  }

  function handleSetUser() {
    if (!nameInput.trim()) return;
    const u = setForumUser(nameInput);
    setUser(u);
    setShowUserDialog(false);
    setNameInput("");
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }

  async function handleLike(postId: string) {
    requireUser(async () => {
      const u = getForumUser();
      if (!u || likingId === postId) return;
      setLikingId(postId);

      const post = posts.find((p) => p.id === postId);
      const alreadyLiked = post?.likes.includes(u.id) ?? false;
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id !== postId) return p;
          const nowLiked = !alreadyLiked;
          return {
            ...p,
            like_count: nowLiked ? p.like_count + 1 : p.like_count - 1,
            likes: nowLiked
              ? [...p.likes, u.id]
              : p.likes.filter((id) => id !== u.id),
          };
        })
      );

      try {
        await togglePostLike(postId, u.id);
      } catch {
        loadData(true);
      } finally {
        setLikingId(null);
      }
    });
  }

  async function handleJoin() {
    requireUser(async () => {
      const u = getForumUser();
      if (!u || joiningSpace) return;
      setJoiningSpace(true);
      try {
        await toggleMember(spaceId, u.id);
        await loadData(true);
      } catch {
        await loadData(true);
      } finally {
        setJoiningSpace(false);
      }
    });
  }

  async function submitPost() {
    const u = getForumUser();
    if (!postTitle.trim() || !u) return;
    setSaving(true);
    try {
      if (editingId) {
        await updatePost(
          editingId,
          { title: postTitle.trim(), body: postBody.trim() },
          u
        );
        setPosts((prev) =>
          prev.map((p) =>
            p.id === editingId
              ? { ...p, title: postTitle.trim(), body: postBody.trim() }
              : p
          )
        );
      } else {
        const newPost = await createPost(
          { spaceId, title: postTitle.trim(), body: postBody.trim() },
          u
        );
        setPosts((prev) => [newPost, ...prev]);
        setSpace((prev) =>
          prev ? { ...prev, post_count: prev.post_count + 1 } : prev
        );
      }
      setPostTitle("");
      setPostBody("");
      setEditingId(null);
      setShowPostDialog(false);
    } catch {
      setError("Erreur lors de la publication. Veuillez réessayer.");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(p: ForumPost) {
    setEditingId(p.id);
    setPostTitle(p.title);
    setPostBody(p.body);
    setShowPostDialog(true);
  }

  async function handleDelete(p: ForumPost) {
    if (!confirm("Supprimer ce post ?")) return;
    if (!user) return;
    try {
      await deletePost(p.id, user);
      setPosts((prev) => prev.filter((x) => x.id !== p.id));
      setSpace((prev) =>
        prev ? { ...prev, post_count: Math.max(prev.post_count - 1, 0) } : prev
      );
    } catch {
      setError("Erreur lors de la suppression.");
    }
  }

  function handleShare(p: ForumPost) {
    const url = `${window.location.origin}/academy/communaute/${spaceId}/${p.id}`;
    if (navigator.share) {
      navigator.share({ title: p.title, url }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url);
    }
    setShareToast("Lien copié !");
    setTimeout(() => setShareToast(null), 2000);
  }

  const sortedPosts = useMemo(() => {
    const arr = [...posts];
    if (sort === "popular") {
      arr.sort(
        (a, b) =>
          (b.like_count + b.comment_count) - (a.like_count + a.comment_count)
      );
    } else {
      arr.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
    return arr;
  }, [posts, sort]);

  if (loading) {
    return (
      <div className="w-full pt-32 pb-24">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <Skeleton className="h-48 w-full rounded-2xl mb-10" />
          <div className="flex justify-between mb-8">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !space) {
    return (
      <div className="w-full pt-40 pb-20 text-center px-6">
        <div className="max-w-md mx-auto">
          <AlertCircle
            className="mx-auto mb-4 text-primary opacity-50"
            size={48}
          />
          <h2 className="text-2xl font-serif mb-2">Oups !</h2>
          <p className="text-muted-foreground mb-8">
            {error || "Espace introuvable."}
          </p>
          <Link href="/academy/communaute">
            <Button variant="outline" className="gap-2">
              <ArrowRight size={16} className="rotate-180" />
              Retour à la communauté
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isMember = user ? space.members.includes(user.id) : false;

  return (
    <div className="w-full pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        {/* Space header (premium gradient) */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-10 p-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/8 via-card to-card"
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <span className="text-5xl select-none">{space.emoji}</span>
              <div>
                <h1 className="text-3xl font-serif font-medium">
                  {space.name}
                </h1>
                <p className="text-muted-foreground mt-1 max-w-lg">
                  {space.description}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users size={14} />
                {space.member_count} membre
                {space.member_count !== 1 ? "s" : ""}
              </div>
              <Button
                size="sm"
                variant={isMember ? "secondary" : "default"}
                disabled={joiningSpace}
                onClick={handleJoin}
                className="gap-2"
              >
                {joiningSpace ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : isMember ? (
                  "✓ Rejoint"
                ) : (
                  "Rejoindre"
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          {user ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                {initials(user.name)}
              </span>
              Connecté en tant que{" "}
              <span className="font-semibold text-foreground">{user.name}</span>
            </div>
          ) : (
            <button
              onClick={() => setShowUserDialog(true)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <UserCircle2 size={16} />
              Définir mon pseudo pour participer
            </button>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={() => loadData(true)}
              disabled={refreshing}
              title="Rafraîchir"
              className="p-2 rounded-lg border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/40 transition-all disabled:opacity-40"
            >
              <RefreshCw
                size={14}
                className={refreshing ? "animate-spin" : ""}
              />
            </button>
            <Button
              onClick={() => {
                setEditingId(null);
                setPostTitle("");
                setPostBody("");
                requireUser(() => setShowPostDialog(true));
              }}
              className="gap-2"
            >
              <PlusCircle size={15} />
              Nouveau post
            </Button>
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 mb-6 text-xs">
          {(
            [
              { id: "recent", label: "Récents", icon: <Sparkles size={12} /> },
              {
                id: "popular",
                label: "Populaires",
                icon: <TrendingUp size={12} />,
              },
            ] as const
          ).map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSort(opt.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
                sort === opt.id
                  ? "border-primary/40 bg-primary/10 text-primary font-semibold"
                  : "border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>

        {/* Error display intentionally hidden */}
        {false && error && <div className="hidden" />}

        {/* Posts */}
        <div className="space-y-4">
          {sortedPosts.length === 0 && !error && (
            <div className="text-center py-20 text-muted-foreground">
              <MessageSquare size={40} className="mx-auto mb-4 opacity-30" />
              <p>Aucun post encore. Soyez le premier !</p>
            </div>
          )}
          {sortedPosts.map((post, i) => {
            const liked = user ? post.likes.includes(user.id) : false;
            const isOwn = user?.id === post.author_id;
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <span className="flex-none flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary text-sm font-bold mt-0.5">
                    {initials(post.author_name)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/academy/communaute/${spaceId}/${post.id}`}
                    >
                      <h3 className="font-serif text-lg font-semibold hover:text-primary transition-colors cursor-pointer line-clamp-2 mb-1">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {post.body}
                    </p>
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="text-xs text-muted-foreground">
                        {post.author_name} · {relTime(post.created_at)}
                      </span>
                      <button
                        onClick={() => handleLike(post.id)}
                        disabled={likingId === post.id}
                        className={`flex items-center gap-1.5 text-xs font-medium transition-colors disabled:opacity-60 ${
                          liked
                            ? "text-red-400"
                            : "text-muted-foreground hover:text-red-400"
                        }`}
                      >
                        <Heart
                          size={13}
                          fill={liked ? "currentColor" : "none"}
                        />
                        {post.like_count}
                      </button>
                      <Link
                        href={`/academy/communaute/${spaceId}/${post.id}`}
                      >
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                          <MessageSquare size={13} />
                          {post.comment_count} commentaire
                          {post.comment_count !== 1 ? "s" : ""}
                        </span>
                      </Link>
                      <button
                        onClick={() => handleShare(post)}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                        title="Partager"
                      >
                        <Share2 size={13} />
                      </button>
                      {isOwn && (
                        <>
                          <button
                            onClick={() => startEdit(post)}
                            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                            title="Modifier"
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            onClick={() => handleDelete(post)}
                            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-400 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </>
                      )}
                      <Link
                        href={`/academy/communaute/${spaceId}/${post.id}`}
                        className="ml-auto"
                      >
                        <span className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                          Lire <ArrowRight size={12} />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {shareToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm shadow-lg z-50">
          {shareToast}
        </div>
      )}

      {/* Dialog: pseudo */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-serif">Qui êtes-vous ?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Choisissez un pseudo visible par toute la communauté.
          </p>
          <Input
            placeholder="Votre pseudo (ex : Amara K.)"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSetUser()}
            autoFocus
          />
          <Button
            onClick={handleSetUser}
            disabled={!nameInput.trim()}
            className="w-full"
          >
            Confirmer
          </Button>
        </DialogContent>
      </Dialog>

      {/* Dialog: nouveau / éditer post */}
      <Dialog open={showPostDialog} onOpenChange={setShowPostDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {editingId ? "Modifier le post" : "Nouveau post"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Titre du post"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              maxLength={120}
              autoFocus
            />
            <Textarea
              placeholder="Développez votre idée, question ou partage…"
              value={postBody}
              onChange={(e) => setPostBody(e.target.value)}
              rows={5}
              maxLength={2000}
            />
            <Button
              onClick={submitPost}
              disabled={!postTitle.trim() || saving}
              className="w-full"
            >
              {saving ? (
                <Loader2 className="animate-spin" size={16} />
              ) : editingId ? (
                "Enregistrer"
              ) : (
                "Publier"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
