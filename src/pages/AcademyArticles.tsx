import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { Link } from "wouter";
import { normalizeDate, compareDatesDesc } from "@/lib/date-utils";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                {/* Catégories */}
                <div className="flex-1">
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                    Catégorie
                  </p>
                  <Tabs
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                    className="w-full"
                  >
                    <TabsList className="bg-background/60 border border-border/50 w-full justify-start overflow-x-auto">
                      <TabsTrigger value="all" className="text-xs">
                        Tous
                      </TabsTrigger>
                      {categories.map((cat) => (
                        <TabsTrigger key={cat} value={cat} className="text-xs">
                          {cat}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>

                {/* Tri */}
                <div className="flex-1">
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                    Tri
                  </p>
                  <Tabs
                    value={sortBy}
                    onValueChange={(v) => setSortBy(v as SortOption)}
                    className="w-full"
                  >
                    <TabsList className="bg-background/60 border border-border/50 w-full">
                      <TabsTrigger value="recent" className="text-xs">
                        Plus récents
                      </TabsTrigger>
                      <TabsTrigger value="oldest" className="text-xs">
                        Plus anciens
                      </TabsTrigger>
                      <TabsTrigger value="title" className="text-xs">
                        Titre (A-Z)
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
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
