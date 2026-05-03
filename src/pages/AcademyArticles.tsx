import { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { Link } from "wouter";
import { normalizeDate, compareDatesDesc } from "@/lib/date-utils";
import {
  Search,
  X,
  ArrowUpDown,
  ChevronDown,
  ArrowRight,
  Check,
  LayoutGrid,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  fetchArticleManifest,
  getArticleHref,
  type ArticleMeta,
} from "@/lib/article-manifest";

type Article = ArticleMeta;

type SortOption = "recent" | "oldest" | "title";

const STORAGE_KEY_SORT = "lumeniax_academy_sort";
const STORAGE_KEY_CATEGORY = "lumeniax_academy_category";

const SORT_LABELS: Record<SortOption, string> = {
  recent: "Plus récents d'abord",
  oldest: "Plus anciens d'abord",
  title: "Ordre alphabétique (A–Z)",
};

function readSession<T extends string>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = window.sessionStorage.getItem(key);
    return (v as T) || fallback;
  } catch {
    return fallback;
  }
}

export default function AcademyArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Persistance pour la session (réinitialisé à la fermeture de l'onglet/site)
  const [selectedCategory, setSelectedCategory] = useState<string>(() =>
    readSession(STORAGE_KEY_CATEGORY, "all")
  );
  const [sortBy, setSortBy] = useState<SortOption>(() =>
    readSession<SortOption>(STORAGE_KEY_SORT, "recent")
  );
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const [allCatsOpen, setAllCatsOpen] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetchArticleManifest(controller.signal)
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.error("Erreur chargement articles:", err);
        setError(err.message);
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  // Persistance session
  useEffect(() => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY_SORT, sortBy);
    } catch {}
  }, [sortBy]);
  useEffect(() => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY_CATEGORY, selectedCategory);
    } catch {}
  }, [selectedCategory]);

  // Fermeture du menu de tri au clic extérieur / Escape
  useEffect(() => {
    if (!sortOpen) return;
    const onClick = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSortOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [sortOpen]);

  // Lock scroll quand la sheet "toutes les catégories" est ouverte
  useEffect(() => {
    if (!allCatsOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAllCatsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      document.removeEventListener("keydown", onKey);
    };
  }, [allCatsOpen]);

  const categories = useMemo(() => {
    const cats = new Set(articles.map((a) => a.category));
    return Array.from(cats).sort((a, b) => a.localeCompare(b, "fr"));
  }, [articles]);

  // Comptage par catégorie (utilisé partout)
  const countsByCat = useMemo(() => {
    const map = new Map<string, number>();
    for (const a of articles) map.set(a.category, (map.get(a.category) ?? 0) + 1);
    return map;
  }, [articles]);

  // Si la catégorie persistée n'existe plus, retour à "all"
  useEffect(() => {
    if (
      selectedCategory !== "all" &&
      categories.length > 0 &&
      !categories.includes(selectedCategory)
    ) {
      setSelectedCategory("all");
    }
  }, [categories, selectedCategory]);

  // Sur le strip horizontal, on fait défiler vers le chip actif au mount
  useEffect(() => {
    if (!stripRef.current) return;
    const active = stripRef.current.querySelector<HTMLElement>(
      "[data-active='true']"
    );
    if (active) {
      active.scrollIntoView({
        behavior: "auto",
        inline: "center",
        block: "nearest",
      });
    }
  }, [selectedCategory, categories.length]);

  const filteredArticles = useMemo(() => {
    let result = articles;

    if (selectedCategory !== "all") {
      result = result.filter((a) => a.category === selectedCategory);
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.description.toLowerCase().includes(query) ||
          a.category.toLowerCase().includes(query)
      );
    }

    const sorted = [...result];
    switch (sortBy) {
      case "recent":
        sorted.sort((a, b) => {
          const dateA = normalizeDate(a.date);
          const dateB = normalizeDate(b.date);
          return compareDatesDesc(dateA, dateB);
        });
        break;
      case "oldest":
        sorted.sort((a, b) => {
          const dateA = normalizeDate(a.date);
          const dateB = normalizeDate(b.date);
          return -compareDatesDesc(dateA, dateB);
        });
        break;
      case "title":
        sorted.sort((a, b) => a.title.localeCompare(b.title, "fr"));
        break;
    }

    return sorted;
  }, [articles, selectedCategory, search, sortBy]);

  return (
    <div className="w-full pt-32 pb-20 bg-background">
      <div className="container mx-auto px-6 md:px-12">
        {/* ─── En-tête éditorial ──────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-12 md:mb-16"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-2 mb-4">
            <div className="h-[1px] w-8 bg-primary/60" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold">
              Bibliothèque de savoirs
            </span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-6xl font-serif font-medium mb-6 tracking-tight"
          >
            Articles de <span className="italic text-primary">fond</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-lg text-muted-foreground max-w-2xl font-light leading-relaxed"
          >
            Explorations intellectuelles et analyses stratégiques pour décrypter
            les enjeux du monde contemporain.
          </motion.p>
        </motion.div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground animate-pulse">
              Chargement de la bibliothèque...
            </p>
          </div>
        )}

        {error && (
          <div className="text-center text-destructive py-20 bg-destructive/5 rounded-2xl border border-destructive/10">
            <p className="font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-sm underline"
            >
              Réessayer
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* ─── Carte de contrôle Premium ──────────────────────────── */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="
                relative mb-12
                rounded-3xl
                border border-border/50
                bg-gradient-to-br from-card/60 via-card/40 to-card/20
                backdrop-blur-xl
                shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_24px_48px_-24px_rgba(0,0,0,0.35)]
                overflow-hidden
              "
            >
              {/* halo décoratif */}
              <div
                aria-hidden
                className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/10 blur-3xl"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-primary/5 blur-3xl"
              />

              <div className="relative p-5 md:p-8 space-y-6 md:space-y-7">
                {/* Ligne 1 : recherche + tri */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4">
                  {/* Recherche */}
                  <div className="lg:col-span-8 relative group">
                    <Search
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none"
                    />
                    <Input
                      placeholder="Rechercher une thématique, un titre…"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="h-14 pl-12 pr-12 bg-background/60 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/15 rounded-2xl transition-all text-base"
                    />
                    <AnimatePresence>
                      {search && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          onClick={() => setSearch("")}
                          aria-label="Effacer la recherche"
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
                        >
                          <X size={12} />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Tri custom */}
                  <div className="lg:col-span-4 relative" ref={sortRef}>
                    <button
                      type="button"
                      onClick={() => setSortOpen((v) => !v)}
                      aria-haspopup="listbox"
                      aria-expanded={sortOpen}
                      className="
                        w-full h-14 pl-12 pr-10
                        bg-background/60 hover:bg-background/80
                        border border-border/50 hover:border-primary/40
                        rounded-2xl
                        flex items-center justify-between text-left
                        transition-all
                        focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15
                      "
                    >
                      <ArrowUpDown
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                      <span className="text-sm font-medium text-foreground truncate">
                        {SORT_LABELS[sortBy]}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-transform duration-300 ${
                          sortOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {sortOpen && (
                        <motion.ul
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.15 }}
                          role="listbox"
                          className="absolute z-30 mt-2 w-full bg-popover/95 backdrop-blur-xl border border-border/60 rounded-2xl shadow-xl shadow-black/10 overflow-hidden p-1.5"
                        >
                          {(Object.keys(SORT_LABELS) as SortOption[]).map(
                            (opt) => {
                              const active = sortBy === opt;
                              return (
                                <li key={opt}>
                                  <button
                                    type="button"
                                    role="option"
                                    aria-selected={active}
                                    onClick={() => {
                                      setSortBy(opt);
                                      setSortOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${
                                      active
                                        ? "bg-primary/10 text-foreground font-medium"
                                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                                    }`}
                                  >
                                    <span>{SORT_LABELS[opt]}</span>
                                    {active && (
                                      <Check size={14} className="text-primary" />
                                    )}
                                  </button>
                                </li>
                              );
                            }
                          )}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Filet de séparation typographique */}
                <div className="flex items-center gap-4">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/80 whitespace-nowrap">
                    <span className="text-primary">✦</span>{" "}
                    <span className="font-serif italic font-medium normal-case tracking-normal text-foreground">
                      Univers
                    </span>{" "}
                    éditoriaux
                  </span>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                </div>

                {/* Strip de catégories */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-muted-foreground font-light">
                      <span className="font-serif italic text-foreground">
                        {categories.length}
                      </span>{" "}
                      univers · {articles.length} articles
                    </p>
                    <button
                      type="button"
                      onClick={() => setAllCatsOpen(true)}
                      className="
                        inline-flex items-center gap-1.5
                        text-[11px] font-semibold uppercase tracking-[0.15em]
                        text-primary/90 hover:text-primary transition-colors
                      "
                    >
                      <LayoutGrid size={12} />
                      Voir tout
                    </button>
                  </div>

                  <div className="relative -mx-5 md:-mx-8">
                    {/* voiles de fondu */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-8 md:w-12 bg-gradient-to-r from-card/80 to-transparent z-10" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-8 md:w-12 bg-gradient-to-l from-card/80 to-transparent z-10" />

                    <div
                      ref={stripRef}
                      className="
                        flex gap-2.5 overflow-x-auto
                        px-5 md:px-8 py-2
                        snap-x
                        scrollbar-none
                        [scrollbar-width:none]
                        [-ms-overflow-style:none]
                      "
                      style={{ WebkitOverflowScrolling: "touch" }}
                    >
                      <CategoryChip
                        label="Tous les univers"
                        count={articles.length}
                        active={selectedCategory === "all"}
                        featured
                        onClick={() => setSelectedCategory("all")}
                      />
                      {categories.map((cat) => (
                        <CategoryChip
                          key={cat}
                          label={cat}
                          count={countsByCat.get(cat) ?? 0}
                          active={selectedCategory === cat}
                          onClick={() => setSelectedCategory(cat)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* ─── Ligne de résultats ─────────────────────────────────── */}
            <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
              <p className="text-sm text-muted-foreground font-light">
                <span className="font-serif italic text-2xl text-foreground mr-1">
                  {filteredArticles.length}
                </span>
                article{filteredArticles.length > 1 ? "s" : ""}
                {selectedCategory !== "all" && (
                  <>
                    {" "}dans{" "}
                    <span className="text-foreground font-medium">
                      {selectedCategory}
                    </span>
                  </>
                )}
                {search.trim() && (
                  <>
                    {" "}pour «{" "}
                    <span className="text-foreground font-medium">{search}</span>{" "}
                    »
                  </>
                )}
              </p>
              {(selectedCategory !== "all" || search.trim()) && (
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearch("");
                  }}
                  className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <X size={12} /> Réinitialiser les filtres
                </button>
              )}
            </div>

            {filteredArticles.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-32 bg-card/20 rounded-3xl border border-dashed border-border/60"
              >
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={24} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  Aucun résultat trouvé
                </h3>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                  Nous n'avons trouvé aucun article correspondant à votre
                  recherche ou catégorie.
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("all");
                  }}
                  className="mt-6 text-primary text-sm font-semibold hover:underline"
                >
                  Réinitialiser les filtres
                </button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((article, i) => (
                  <Link key={article.slug} href={getArticleHref(article.slug)}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: (i % 6) * 0.05 }}
                      className="group relative p-8 border border-border/40 rounded-3xl bg-card/30 hover:bg-card/60 hover:border-primary/30 transition-all duration-500 cursor-pointer h-full flex flex-col"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
                          <span className="text-sm">{article.icon}</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                            {article.category}
                          </span>
                        </div>
                        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                          {article.readTime} min
                        </span>
                      </div>

                      <h3 className="font-serif text-xl md:text-2xl mb-4 group-hover:text-primary transition-colors leading-snug">
                        {article.title}
                      </h3>

                      <p className="text-sm text-muted-foreground line-clamp-3 flex-1 font-light leading-relaxed mb-6">
                        {article.description}
                      </p>

                      <div className="flex items-center justify-between pt-6 border-t border-border/40 mt-auto">
                        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
                          {article.date}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                          <ArrowRight
                            size={14}
                            className="group-hover:translate-x-0.5 transition-transform"
                          />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ─── Sheet : toutes les catégories ──────────────────────────── */}
      <AnimatePresence>
        {allCatsOpen && (
          <AllCategoriesSheet
            categories={categories}
            counts={countsByCat}
            total={articles.length}
            selected={selectedCategory}
            onSelect={(c) => {
              setSelectedCategory(c);
              setAllCatsOpen(false);
            }}
            onClose={() => setAllCatsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Chip de catégorie (style éditorial) ───────────────────────────── */
function CategoryChip({
  label,
  count,
  active,
  featured,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  featured?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-active={active}
      aria-pressed={active}
      className={`
        snap-start shrink-0 group/chip
        relative inline-flex items-center gap-2
        h-11 pl-4 pr-3.5
        rounded-full
        border whitespace-nowrap
        transition-all duration-300
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40
        ${
          active
            ? "bg-primary text-primary-foreground border-primary shadow-[0_8px_24px_-8px] shadow-primary/40"
            : featured
            ? "bg-foreground/[0.04] text-foreground border-foreground/10 hover:border-primary/40 hover:bg-primary/5"
            : "bg-background/40 text-muted-foreground border-border/50 hover:border-primary/40 hover:text-foreground hover:bg-background/70"
        }
      `}
    >
      {/* Indicateur actif (point) */}
      <span
        className={`
          inline-block w-1.5 h-1.5 rounded-full transition-all
          ${
            active
              ? "bg-primary-foreground"
              : "bg-primary/40 group-hover/chip:bg-primary"
          }
        `}
      />
      <span
        className={`text-[13px] tracking-tight ${
          active ? "font-semibold" : "font-medium"
        }`}
      >
        {label}
      </span>
      <span
        className={`
          font-serif italic text-[12px] leading-none tabular-nums
          translate-y-[-3px]
          ${
            active
              ? "text-primary-foreground/70"
              : "text-muted-foreground/70 group-hover/chip:text-primary/80"
          }
        `}
      >
        {count}
      </span>
    </button>
  );
}

/* ─── Sheet modale "Tous les univers" ──────────────────────────────── */
function AllCategoriesSheet({
  categories,
  counts,
  total,
  selected,
  onSelect,
  onClose,
}: {
  categories: string[];
  counts: Map<string, number>;
  total: number;
  selected: string;
  onSelect: (c: string) => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      {/* panneau */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="
          relative w-full md:max-w-2xl
          max-h-[85vh] md:max-h-[80vh]
          bg-background/95 backdrop-blur-xl
          border border-border/60
          rounded-t-3xl md:rounded-3xl
          shadow-2xl shadow-black/40
          flex flex-col overflow-hidden
        "
        role="dialog"
        aria-modal="true"
        aria-label="Toutes les catégories"
      >
        {/* poignée mobile */}
        <div className="md:hidden flex justify-center pt-3">
          <span className="block h-1 w-10 rounded-full bg-border" />
        </div>

        {/* header */}
        <div className="flex items-start justify-between gap-4 px-6 md:px-8 pt-5 md:pt-7 pb-4">
          <div>
            <div className="flex items-center gap-2 text-primary mb-1">
              <Sparkles size={14} />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
                Bibliothèque
              </span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl tracking-tight">
              Tous les <span className="italic text-primary">univers</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-1 font-light">
              <span className="font-serif italic text-foreground">
                {categories.length}
              </span>{" "}
              catégories · {total} articles
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="w-9 h-9 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mx-6 md:mx-8" />

        {/* contenu : grille */}
        <div className="overflow-y-auto px-4 md:px-6 py-5 md:py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <SheetRow
              label="Tous les univers"
              count={total}
              active={selected === "all"}
              onClick={() => onSelect("all")}
              featured
            />
            {categories.map((cat) => (
              <SheetRow
                key={cat}
                label={cat}
                count={counts.get(cat) ?? 0}
                active={selected === cat}
                onClick={() => onSelect(cat)}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SheetRow({
  label,
  count,
  active,
  featured,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  featured?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`
        group/row
        flex items-center justify-between gap-3
        px-4 py-3 rounded-2xl
        border text-left transition-all
        ${
          active
            ? "bg-primary/10 border-primary/40 text-foreground"
            : featured
            ? "bg-foreground/[0.03] border-border/50 hover:border-primary/40 hover:bg-primary/5"
            : "bg-transparent border-border/40 hover:border-primary/30 hover:bg-card/50"
        }
      `}
    >
      <span className="flex items-center gap-3 min-w-0">
        <span
          className={`inline-block w-1.5 h-1.5 rounded-full ${
            active ? "bg-primary" : "bg-primary/30 group-hover/row:bg-primary/70"
          }`}
        />
        <span
          className={`truncate text-sm ${
            active ? "font-semibold" : "font-medium text-foreground/90"
          }`}
        >
          {label}
        </span>
      </span>
      <span className="flex items-center gap-2">
        <span className="font-serif italic text-sm tabular-nums text-muted-foreground">
          {count}
        </span>
        {active && <Check size={14} className="text-primary" />}
      </span>
    </button>
  );
}
