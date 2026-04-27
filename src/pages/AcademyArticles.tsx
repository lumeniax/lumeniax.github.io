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
  Filter,
  ArrowRight,
  Check,
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface Article {
  title: string;
  slug: string;
  category: string;
  date: string;
  icon: string;
  description: string;
  readTime: number;
  file: string;
}

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

  useEffect(() => {
    const timestamp = new Date().getTime();
    fetch(`/articles/articles.json?t=${timestamp}`)
      .then((res) => {
        if (!res.ok) throw new Error("Impossible de charger les articles.");
        return res.json();
      })
      .then((data: Article[]) => {
        setArticles(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur chargement articles:", err);
        setError(err.message);
        setLoading(false);
      });
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

  const categories = useMemo(() => {
    const cats = new Set(articles.map((a) => a.category));
    return Array.from(cats).sort();
  }, [articles]);

  // Si la catégorie persistée n'existe plus dans le dataset, on revient à "all"
  useEffect(() => {
    if (
      selectedCategory !== "all" &&
      categories.length > 0 &&
      !categories.includes(selectedCategory)
    ) {
      setSelectedCategory("all");
    }
  }, [categories, selectedCategory]);

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

  const activeCategoryCount =
    selectedCategory === "all"
      ? articles.length
      : articles.filter((a) => a.category === selectedCategory).length;

  return (
    <div className="w-full pt-32 pb-20 bg-background">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-16"
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
            {/* ─── Barre de contrôle Premium ─────────────────────────────── */}
            <div className="mb-12 space-y-6">
              {/* Recherche + tri */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4">
                {/* Recherche */}
                <div className="lg:col-span-8 relative group">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none"
                  />
                  <Input
                    placeholder="Rechercher une thématique, un titre..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-14 pl-12 pr-12 bg-card/40 border-border/40 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 rounded-2xl transition-all text-base"
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

                {/* Sélecteur de tri custom (look premium, identique mobile/desktop) */}
                <div className="lg:col-span-4 relative" ref={sortRef}>
                  <button
                    type="button"
                    onClick={() => setSortOpen((v) => !v)}
                    aria-haspopup="listbox"
                    aria-expanded={sortOpen}
                    className="w-full h-14 pl-12 pr-10 bg-card/40 hover:bg-card/60 border border-border/40 hover:border-primary/30 rounded-2xl flex items-center justify-between text-left transition-all focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
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
                        className="absolute z-30 mt-2 w-full bg-popover/95 backdrop-blur-xl border border-border/60 rounded-2xl shadow-xl shadow-black/5 overflow-hidden p-1"
                      >
                        {(Object.keys(SORT_LABELS) as SortOption[]).map((opt) => {
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
                        })}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* ─── Filtres par catégorie (mobile = scroll horizontal, desktop = wrap) ── */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Filter size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      Filtrer par univers
                    </span>
                  </div>
                  {selectedCategory !== "all" && (
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className="text-[10px] font-bold uppercase tracking-widest text-primary/80 hover:text-primary transition-colors flex items-center gap-1"
                    >
                      <X size={11} /> Réinitialiser
                    </button>
                  )}
                </div>

                <div className="relative -mx-6 md:mx-0">
                  {/* Voiles de fondu sur mobile */}
                  <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-background to-transparent z-10 md:hidden" />
                  <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-background to-transparent z-10 md:hidden" />

                  <div
                    className="
                      flex gap-2 md:gap-2.5 overflow-x-auto md:flex-wrap
                      px-6 md:px-0 py-1
                      snap-x snap-mandatory md:snap-none
                      scrollbar-none
                      [scrollbar-width:none]
                      [-ms-overflow-style:none]
                    "
                    style={{ WebkitOverflowScrolling: "touch" }}
                  >
                    {/* "Tous" */}
                    <CategoryPill
                      label="Tous les articles"
                      count={articles.length}
                      active={selectedCategory === "all"}
                      onClick={() => setSelectedCategory("all")}
                    />
                    {categories.map((cat) => {
                      const count = articles.filter(
                        (a) => a.category === cat
                      ).length;
                      return (
                        <CategoryPill
                          key={cat}
                          label={cat}
                          count={count}
                          active={selectedCategory === cat}
                          onClick={() => setSelectedCategory(cat)}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Résultats */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-muted-foreground font-light">
                Affichage de{" "}
                <span className="text-foreground font-medium">
                  {filteredArticles.length}
                </span>{" "}
                article{filteredArticles.length > 1 ? "s" : ""}
                {selectedCategory !== "all" && (
                  <>
                    {" "}
                    dans{" "}
                    <span className="text-foreground font-medium">
                      {selectedCategory}
                    </span>{" "}
                    <span className="text-muted-foreground/70">
                      ({activeCategoryCount} au total)
                    </span>
                  </>
                )}
              </p>
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
                  <Link key={article.slug} href={`/academy/articles/${article.slug}`}>
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
    </div>
  );
}

/* ─── Pill de catégorie ───────────────────────────────────────────────── */
function CategoryPill({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`
        snap-start shrink-0
        inline-flex items-center gap-2
        h-10 px-4 md:px-5
        rounded-full
        text-xs font-semibold whitespace-nowrap
        border transition-all duration-300
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40
        ${
          active
            ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
            : "bg-card/40 text-muted-foreground border-border/40 hover:border-primary/30 hover:text-foreground hover:bg-card/60"
        }
      `}
    >
      <span>{label}</span>
      <span
        className={`
          inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5
          rounded-full text-[10px] font-bold tabular-nums
          ${
            active
              ? "bg-primary-foreground/20 text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }
        `}
      >
        {count}
      </span>
    </button>
  );
}
