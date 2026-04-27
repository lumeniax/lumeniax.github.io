import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { Link } from "wouter";
import { normalizeDate, compareDatesDesc } from "@/lib/date-utils";
import { Search, X, ArrowUpDown, ChevronDown, Filter } from "lucide-react";
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

export default function AcademyArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Initialisation du tri depuis le localStorage ou valeur par défaut
  const [sortBy, setSortBy] = useState<SortOption>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SORT);
    return (saved as SortOption) || "recent";
  });

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

  // Sauvegarder le choix de tri quand il change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SORT, sortBy);
  }, [sortBy]);

  const categories = useMemo(() => {
    const cats = new Set(articles.map((a) => a.category));
    return Array.from(cats).sort();
  }, [articles]);

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
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-16"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-2 mb-4">
            <div className="h-[1px] w-8 bg-primary/60" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold">Bibliothèque de savoirs</span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-serif font-medium mb-6 tracking-tight">
            Articles de <span className="italic text-primary">fond</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-muted-foreground max-w-2xl font-light leading-relaxed">
            Explorations intellectuelles et analyses stratégiques pour décrypter les enjeux du monde contemporain.
          </motion.p>
        </motion.div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground animate-pulse">Chargement de la bibliothèque...</p>
          </div>
        )}

        {error && (
          <div className="text-center text-destructive py-20 bg-destructive/5 rounded-2xl border border-destructive/10">
            <p className="font-medium">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 text-sm underline">Réessayer</button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Barre de contrôle Premium */}
            <div className="mb-12 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Recherche élégante */}
                <div className="lg:col-span-8 relative group">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
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
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
                      >
                        <X size={12} />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                {/* Sélecteur de tri Premium */}
                <div className="lg:col-span-4 relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-muted-foreground pointer-events-none">
                    <ArrowUpDown size={16} />
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full h-14 pl-12 pr-10 bg-card/40 border border-border/40 rounded-2xl appearance-none cursor-pointer focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all text-sm font-medium text-foreground"
                  >
                    <option value="recent">Plus récents d'abord</option>
                    <option value="oldest">Plus anciens d'abord</option>
                    <option value="title">Ordre alphabétique (A-Z)</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Navigation par Catégories Premium */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Filter size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Filtrer par univers</span>
                </div>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-6 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 border ${
                      selectedCategory === "all"
                        ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105"
                        : "bg-card/40 text-muted-foreground border-border/40 hover:border-primary/30 hover:text-foreground"
                    }`}
                  >
                    Tous les articles
                    <span className="ml-2 opacity-60 font-normal">{articles.length}</span>
                  </button>
                  {categories.map((cat) => {
                    const count = articles.filter((a) => a.category === cat).length;
                    const active = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-6 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 border ${
                          active
                            ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105"
                            : "bg-card/40 text-muted-foreground border-border/40 hover:border-primary/30 hover:text-foreground"
                        }`}
                      >
                        {cat}
                        <span className="ml-2 opacity-60 font-normal">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Résultats */}
            <div className="mb-8 flex items-center justify-between">
              <p className="text-sm text-muted-foreground font-light">
                Affichage de <span className="text-foreground font-medium">{filteredArticles.length}</span> article{filteredArticles.length > 1 ? 's' : ''}
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
                <h3 className="text-lg font-medium mb-2">Aucun résultat trouvé</h3>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                  Nous n'avons trouvé aucun article correspondant à votre recherche ou catégorie.
                </p>
                <button 
                  onClick={() => {setSearch(""); setSelectedCategory("all");}}
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
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{article.category}</span>
                        </div>
                        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{article.readTime} min</span>
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
                          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
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
