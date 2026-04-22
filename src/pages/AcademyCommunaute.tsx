import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  MessageSquare,
  Network,
  PlusCircle,
  LogIn,
  Hash,
  UserCircle2,
  Loader2,
  Search,
  RefreshCw,
  X,
  AlertCircle,
  Star,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  fetchSpaces,
  createSpace,
  toggleMember,
  getForumUser,
  setForumUser,
  getFavoriteSpaces,
  toggleFavoriteSpace,
  initials,
  avatarColor,
  type ForumSpace,
  type ForumUser,
} from "@/hooks/useForum";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  echange: <MessageSquare size={13} />,
  club: <Hash size={13} />,
  reseau: <Network size={13} />,
};
const CATEGORY_LABELS: Record<string, string> = {
  echange: "Échange",
  club: "Club",
  reseau: "Réseau",
};
const EMOJIS = ["💬", "📚", "🤝", "🧠", "⚡", "🎯", "🌍", "🚀", "💡", "🎓"];

const POLL_MS = 15_000;

type FilterCat = "all" | "echange" | "club" | "reseau";
type Sort = "recent" | "popular" | "mine";

export default function AcademyCommunaute() {
  const [spaces, setSpaces] = useState<ForumSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<ForumUser | null>(getForumUser());
  const [filter, setFilter] = useState<FilterCat>("all");
  const [sort, setSort] = useState<Sort>("recent");
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<string[]>(getFavoriteSpaces());

  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showSpaceDialog, setShowSpaceDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newEmoji, setNewEmoji] = useState("💬");
  const [newCategory, setNewCategory] = useState<"echange" | "club" | "reseau">(
    "echange"
  );
  const [nameInput, setNameInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [joiningId, setJoiningId] = useState<string | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadSpaces = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError(null);
    try {
      const data = await fetchSpaces();
      setSpaces(data);
    } catch (e) {
      console.error("loadSpaces failed:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadSpaces();
    intervalRef.current = setInterval(() => loadSpaces(true), POLL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [loadSpaces]);

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

  async function handleJoin(spaceId: string) {
    requireUser(async () => {
      const u = getForumUser();
      if (!u || joiningId === spaceId) return;
      setJoiningId(spaceId);

      const isCurrentlyMember =
        spaces.find((s) => s.id === spaceId)?.members.includes(u.id) ?? false;
      setSpaces((prev) =>
        prev.map((s) => {
          if (s.id !== spaceId) return s;
          const joining = !isCurrentlyMember;
          return {
            ...s,
            members: joining
              ? [...s.members, u.id]
              : s.members.filter((id) => id !== u.id),
            member_count: s.member_count + (joining ? 1 : -1),
          };
        })
      );

      try {
        await toggleMember(spaceId, u.id);
        loadSpaces(true);
      } catch {
        loadSpaces(true);
      } finally {
        setJoiningId(null);
      }
    });
  }

  function handleFav(spaceId: string) {
    toggleFavoriteSpace(spaceId);
    setFavorites(getFavoriteSpaces());
  }

  async function submitSpace() {
    const u = getForumUser();
    if (!newName.trim()) {
      setError("Veuillez saisir un nom d'espace.");
      return;
    }
    if (!u) {
      setError("Veuillez d'abord définir votre pseudo.");
      setShowUserDialog(true);
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const created = await createSpace(
        {
          name: newName.trim(),
          description: newDesc.trim(),
          emoji: newEmoji,
          category: newCategory,
        },
        u
      );
      setSpaces((prev) => [created, ...prev.filter((s) => s.id !== created.id)]);
      setNewName("");
      setNewDesc("");
      setNewEmoji("💬");
      setNewCategory("echange");
      setShowSpaceDialog(false);
      loadSpaces(true);
    } catch (e: any) {
      console.error("createSpace failed:", e);
      const detail =
        e?.message && !/^HTTP\s/i.test(e.message)
          ? ` (${e.message})`
          : e?.message
            ? ` (${e.message})`
            : "";
      setError(
        `Impossible de créer l'espace${detail}. Vérifiez que le serveur API est bien démarré.`
      );
    } finally {
      setSaving(false);
    }
  }

  const stats = useMemo(() => {
    const totalMembers = new Set<string>();
    let totalPosts = 0;
    spaces.forEach((s) => {
      s.members.forEach((m) => totalMembers.add(m));
      totalPosts += s.post_count || 0;
    });
    return {
      spaces: spaces.length,
      members: totalMembers.size,
      posts: totalPosts,
    };
  }, [spaces]);

  const query = search.trim().toLowerCase();
  const filtered = spaces
    .filter((s) => filter === "all" || s.category === filter)
    .filter(
      (s) =>
        !query ||
        s.name.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query)
    )
    .filter((s) => {
      if (sort !== "mine") return true;
      if (!user) return false;
      return s.members.includes(user.id) || s.author_id === user.id;
    })
    .sort((a, b) => {
      if (sort === "popular") {
        const aScore = (a.member_count || 0) * 2 + (a.post_count || 0);
        const bScore = (b.member_count || 0) * 2 + (b.post_count || 0);
        return bScore - aScore;
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  return (
    <div className="w-full pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-3xl mx-auto text-center mb-10"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[11px] font-semibold text-primary uppercase tracking-wider mb-4"
          >
            <Sparkles size={12} /> Premium
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-6xl font-serif font-medium mb-4"
          >
            La <span className="italic text-primary">Communauté</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-lg text-muted-foreground mb-8"
          >
            Rejoignez des espaces d'échanges, clubs et réseaux. Créez, publiez,
            commentez, répondez, aimez.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex items-center justify-center gap-3 flex-wrap"
          >
            {user ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-sm font-medium text-primary">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  {initials(user.name)}
                </span>
                {user.name}
              </div>
            ) : (
              <button
                onClick={() => setShowUserDialog(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/60 border border-border/60 hover:border-primary/40 text-sm text-muted-foreground hover:text-primary transition-all duration-200"
              >
                <UserCircle2 size={16} />
                Définir mon pseudo
              </button>
            )}
            <Button
              size="sm"
              onClick={() => requireUser(() => setShowSpaceDialog(true))}
              className="gap-2"
            >
              <PlusCircle size={15} />
              Créer un espace
            </Button>
          </motion.div>
        </motion.div>

        {/* Premium stats banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-3 md:gap-6 mb-10 p-4 md:p-6 rounded-2xl bg-gradient-to-br from-primary/5 via-background to-background border border-primary/10"
        >
          {[
            { label: "Espaces", value: stats.spaces, icon: <Hash size={16} /> },
            {
              label: "Membres",
              value: stats.members,
              icon: <Users size={16} />,
            },
            {
              label: "Publications",
              value: stats.posts,
              icon: <MessageSquare size={16} />,
            },
          ].map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center text-center"
            >
              <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground mb-1">
                {s.icon}
                {s.label}
              </span>
              <span className="text-2xl md:text-3xl font-serif font-semibold text-primary">
                {s.value}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-3">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <Input
              placeholder="Rechercher un espace…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-8 bg-background/60 border-border/50 focus:border-primary/50"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Tabs
              value={filter}
              onValueChange={(v) => setFilter(v as FilterCat)}
            >
              <TabsList className="bg-background/60 border border-border/50">
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="echange">Échanges</TabsTrigger>
                <TabsTrigger value="club">Clubs</TabsTrigger>
                <TabsTrigger value="reseau">Réseaux</TabsTrigger>
              </TabsList>
            </Tabs>
            <button
              onClick={() => loadSpaces(true)}
              disabled={refreshing}
              title="Rafraîchir maintenant"
              className="p-2 rounded-lg border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/40 transition-all disabled:opacity-40"
            >
              <RefreshCw
                size={14}
                className={refreshing ? "animate-spin" : ""}
              />
            </button>
          </div>
        </div>

        {/* Sort tabs */}
        <div className="flex items-center gap-2 mb-6 text-xs">
          {(
            [
              { id: "recent", label: "Récents", icon: <Sparkles size={12} /> },
              {
                id: "popular",
                label: "Populaires",
                icon: <TrendingUp size={12} />,
              },
              { id: "mine", label: "Mes espaces", icon: <Star size={12} /> },
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

        {/* Search result count */}
        {query && !loading && (
          <p className="text-sm text-muted-foreground mb-6 ml-1">
            {filtered.length === 0
              ? `Aucun résultat pour « ${search} »`
              : `${filtered.length} espace${filtered.length !== 1 ? "s" : ""} trouvé${filtered.length !== 1 ? "s" : ""} pour « ${search} »`}
          </p>
        )}

        {/* Error state intentionally hidden — failures are silent */}
        {false && error && (
          <div className="hidden"></div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-card border border-border/50 space-y-4"
              >
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-16 w-full" />
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-9 flex-1" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((space, i) => {
              const isMember = user ? space.members.includes(user.id) : false;
              const isJoining = joiningId === space.id;
              const isFav = favorites.includes(space.id);
              const memberSample = space.members.slice(0, 4);
              return (
                <motion.div
                  key={space.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative flex flex-col p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
                >
                  <div className="absolute top-4 right-4 flex items-center gap-1.5">
                    <button
                      onClick={() => handleFav(space.id)}
                      title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
                      className={`transition-colors ${
                        isFav
                          ? "text-amber-400"
                          : "text-muted-foreground/60 hover:text-amber-400"
                      }`}
                    >
                      <Star size={14} fill={isFav ? "currentColor" : "none"} />
                    </button>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground border border-border/50 rounded-full px-2 py-0.5 bg-background/60">
                      {CATEGORY_ICONS[space.category]}
                      {CATEGORY_LABELS[space.category]}
                    </span>
                  </div>
                  <div className="text-4xl mb-3 select-none">{space.emoji}</div>
                  <h3 className="font-serif text-lg font-semibold mb-2 pr-24 leading-snug">
                    {space.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-1 leading-relaxed">
                    {space.description}
                  </p>

                  {memberSample.length > 0 && (
                    <div className="flex items-center -space-x-2 mb-3">
                      {memberSample.map((m, idx) => (
                        <span
                          key={m}
                          className={`flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold ring-2 ring-card ${avatarColor(
                            m + idx
                          )}`}
                          title="Membre"
                        >
                          {(m[0] || "?").toUpperCase()}
                        </span>
                      ))}
                      {space.member_count > memberSample.length && (
                        <span className="flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground ring-2 ring-card">
                          +{space.member_count - memberSample.length}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Users size={12} /> {space.member_count} membre
                      {space.member_count !== 1 ? "s" : ""}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare size={12} /> {space.post_count} post
                      {space.post_count !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/academy/communaute/${space.id}`}
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                      >
                        Voir les posts
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant={isMember ? "secondary" : "default"}
                      disabled={isJoining}
                      className="flex-none text-xs gap-1"
                      onClick={() => handleJoin(space.id)}
                    >
                      {isJoining ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <LogIn size={12} />
                      )}
                      {isMember ? "Rejoint" : "Rejoindre"}
                    </Button>
                  </div>
                </motion.div>
              );
            })}
            {filtered.length === 0 && !query && !error && (
              <p className="col-span-3 text-center text-muted-foreground mt-16">
                {sort === "mine"
                  ? "Vous n'avez encore rejoint ou créé aucun espace."
                  : "Aucun espace dans cette catégorie."}
              </p>
            )}
          </div>
        )}
      </div>

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

      {/* Dialog: créer espace */}
      <Dialog open={showSpaceDialog} onOpenChange={setShowSpaceDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">Créer un espace</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-2">Icône</p>
              <div className="flex flex-wrap gap-2">
                {EMOJIS.map((e) => (
                  <button
                    key={e}
                    onClick={() => setNewEmoji(e)}
                    className={`text-xl p-1.5 rounded-lg border transition-all ${
                      newEmoji === e
                        ? "border-primary bg-primary/10"
                        : "border-border/40 hover:border-border"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Type</p>
              <div className="flex gap-2">
                {(["echange", "club", "reseau"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setNewCategory(cat)}
                    className={`flex-1 text-xs font-semibold py-2 rounded-lg border transition-all ${
                      newCategory === cat
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/40 text-muted-foreground hover:border-border"
                    }`}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </div>
            </div>
            <Input
              placeholder="Nom de l'espace"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              maxLength={50}
              autoFocus
            />
            <Textarea
              placeholder="Description (optionnel)"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              rows={2}
              maxLength={150}
            />
            <Button
              onClick={submitSpace}
              disabled={!newName.trim() || saving}
              className="w-full"
            >
              {saving ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                "Créer l'espace"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
