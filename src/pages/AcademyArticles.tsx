import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { Link } from "wouter";
import { normalizeDate, compareDatesDesc } from "@/lib/date-utils";
import { Search, X, ArrowUpDown, ChevronDown } from "lucide-react";
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

export default function AcademyArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("recent");

  useEffect(() => {
    fetch("/articles/articles.json")
      .then((res) => {
        if (!res.ok) throw new Error("Impossible de charger les articles.");
        return res.json();
      })
      .then((data: Article[]) => {
        setArticles(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Extraire les catégories uniques
  const categories = useMemo(() => {
    const cats = new Set(articles.map((a) => a.category));
    return Array.from(cats).sort();
  }, [articles]);

  // Filtrer et trier les articles
  const filteredArticles = useMemo(() => {
    let result = articles;

    // Filtre par catégorie
    if (selectedCategory !== "all") {
      result = result.filter((a) => a.category === selectedCategory);
    }

    // Filtre par recherche (titre, description, catégorie)
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.description.toLowerCase().includes(query) ||
          a.category.toLowerCase().includes(query)
      );
    }

    // Tri
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
    <div className="w-full pt-32 pb-20">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-20"
        >
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-serif font-medium mb-6">
            Articles de <span className="italic text-primary">fond</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-muted-foreground max-w-2xl">
            Explorations intellectuelles pour comprendre le monde et soi-même.
          </motion.p>
        </motion.div>

        {loading && (
          <div className="text-center text-muted-foreground py-20">Chargement des articles…</div>
        )}

        {error && (
          <div className="text-center text-destructive py-20">{error}</div>
        )}

        {!loading && !error && articles.length === 0 && (
          <div className="text-center text-muted-foreground py-20">
            Aucun article trouvé. Ajoutez des fichiers HTML dans le dossier <code>public/articles/</code>.
          </div>
        )}

        {!loading && !error && articles.length > 0 && (
          <>
            {/* Barre de recherche et filtres */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8 space-y-4"
            >
              {/* Recherche */}
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <Input
                  placeholder="Rechercher un article…"
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

              {/* Filtres par catégorie et tri */}
              <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 lg:items-end">
                {/* Catégories — pills horizontalement défilables */}
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-muted-foreground mb-2 uppercase tracking-[0.12em]">
                    Catégorie
                  </p>
                  <div className="relative">
                    <div
                      className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 scroll-smooth snap-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                      role="tablist"
                      aria-label="Filtrer par catégorie"
                    >
                      <button
                        type="button"
                        role="tab"
                        aria-selected={selectedCategory === "all"}
                        onClick={() => setSelectedCategory("all")}
                        className={`shrink-0 snap-start whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                          selectedCategory === "all"
                            ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
                            : "bg-background/60 text-muted-foreground border-border/50 hover:text-foreground hover:border-primary/40"
                        }`}
                      >
                        Tous
                        <span
                          className={`ml-1.5 text-[10px] tabular-nums ${
                            selectedCategory === "all"
                              ? "opacity-80"
                              : "opacity-60"
                          }`}
                        >
                          {articles.length}
                        </span>
                      </button>
                      {categories.map((cat) => {
                        const count = articles.filter(
                          (a) => a.category === cat
                        ).length;
                        const active = selectedCategory === cat;
                        return (
                          <button
                            key={cat}
                            type="button"
                            role="tab"
                            aria-selected={active}
                            onClick={() => setSelectedCategory(cat)}
                            className={`shrink-0 snap-start whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                              active
                                ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
                                : "bg-background/60 text-muted-foreground border-border/50 hover:text-foreground hover:border-primary/40"
                            }`}
                          >
                            {cat}
                            <span
                              className={`ml-1.5 text-[10px] tabular-nums ${
                                active ? "opacity-80" : "opacity-60"
                              }`}
                            >
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {/* Edge fade masks pour indiquer le défilement */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-background to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-background to-transparent" />
                  </div>
                </div>

                {/* Tri — dropdown natif stylé */}
                <div className="lg:w-56 shrink-0">
                  <p className="text-[11px] font-semibold text-muted-foreground mb-2 uppercase tracking-[0.12em]">
                    Trier par
                  </p>
                  <div className="relative">
                    <ArrowUpDown
                      size={13}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                    />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="w-full h-9 pl-9 pr-9 text-xs rounded-md bg-background/60 border border-border/50 hover:border-primary/40 focus:border-primary/50 focus:outline-none transition-colors appearance-none cursor-pointer text-foreground"
                      aria-label="Trier par"
                    >
                      <option value="recent">Plus récents</option>
                      <option value="oldest">Plus anciens</option>
                      <option value="title">Titre (A-Z)</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              {/* Compteur de résultats */}
              {search && (
                <p className="text-sm text-muted-foreground">
                  {filteredArticles.length === 0
                    ? `Aucun résultat pour « ${search} »`
                    : `${filteredArticles.length} article${filteredArticles.length !== 1 ? "s" : ""} trouvé${filteredArticles.length !== 1 ? "s" : ""}`}
                </p>
              )}
            </motion.div>

            {/* Grille d'articles */}
            {filteredArticles.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 text-muted-foreground"
              >
                <p>Aucun article ne correspond à vos critères.</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article, i) => (
                  <Link key={article.slug} href={`/academy/articles/${article.slug}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: (i % 6) * 0.1 }}
                      className="p-6 border border-border/50 rounded-xl bg-card hover:border-primary/50 hover:bg-card/80 transition-all cursor-pointer group h-full hover:shadow-lg hover:shadow-primary/10 flex flex-col gap-3"
                    >
                      <div className="flex items-center gap-2 text-xs text-primary font-medium">
                        <span>{article.icon}</span>
                        <span>{article.category}</span>
                      </div>
                      <h3 className="font-serif text-lg group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      {article.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                          {article.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-2">
                        <span>
                          {article.date || ""}
                          {article.date ? " · " : ""}
                          Lecture • {article.readTime} min
                        </span>
                        <span className="text-primary group-hover:translate-x-1 transition-transform">
                          →
                        </span>
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
