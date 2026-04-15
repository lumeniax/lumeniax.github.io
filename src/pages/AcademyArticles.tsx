import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { Link } from "wouter";

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

export default function AcademyArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
            Articles de <span className="italic text-primary">Fond</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, i) => (
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
                    <span>{article.date || ""}{article.date ? " · " : ""}Lecture • {article.readTime} min</span>
                    <span className="text-primary group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
