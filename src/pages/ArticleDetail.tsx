import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ArticleInteractions } from "@/components/ArticleInteractions";
import { ArticleComments } from "@/components/ArticleComments";
import { AuthorSignature } from "@/components/AuthorSignature";

interface ArticleMeta {
  title: string;
  category: string;
  date: string;
  icon: string;
  description: string;
  readTime: number;
  slug: string;
  file: string;
  contentFile: string;
}

export default function ArticleDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";

  const [meta, setMeta] = useState<ArticleMeta | null>(null);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const commentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setNotFound(false);
      setContent("");
      setMeta(null);

      try {
        const articlesRes = await fetch("/articles/articles.json");
        if (!articlesRes.ok) throw new Error("manifest fetch failed");
        const articles: ArticleMeta[] = await articlesRes.json();

        const found = articles.find((a) => a.slug === slug);
        if (!found) {
          if (!cancelled) { setNotFound(true); setLoading(false); }
          return;
        }

        const contentRes = await fetch(`/articles/content/${found.contentFile}`);
        if (!contentRes.ok) {
          if (!cancelled) { setNotFound(true); setLoading(false); }
          return;
        }
        const html = await contentRes.text();

        if (!cancelled) {
          setMeta(found);
          setContent(html);
          setLoading(false);
        }
      } catch {
        if (!cancelled) { setNotFound(true); setLoading(false); }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return (
      <div className="w-full pt-32 pb-20">
        <div className="container mx-auto px-6 md:px-12 text-center text-muted-foreground">
          Chargement de l'article…
        </div>
      </div>
    );
  }

  if (notFound || !meta) {
    return (
      <div className="w-full pt-32 pb-20">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h1 className="text-4xl font-serif mb-4">Article non trouvé</h1>
          <p className="text-muted-foreground mb-8">Désolé, cet article n'existe pas ou a été supprimé.</p>
          <Link href="/academy/articles">
            <Button>Retour aux articles</Button>
          </Link>
        </div>
      </div>
    );
  }

  const articleUrl = `/academy/articles/${slug}`;

  return (
    <div className="w-full pt-32 pb-20">
      <div className="container mx-auto px-6 md:px-12 max-w-3xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <Link href="/academy/articles">
            <motion.button
              variants={fadeUp}
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour aux articles
            </motion.button>
          </Link>

          <motion.div variants={fadeUp} className="flex items-center gap-2 text-sm text-primary font-medium mb-4">
            <span>{meta.icon}</span>
            <span>{meta.category}</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-5xl font-serif font-medium mb-4"
          >
            {meta.title}
          </motion.h1>

          <motion.div
            variants={fadeUp}
            className="flex items-center gap-4 text-muted-foreground mb-12 pb-8 border-b border-border"
          >
            {meta.date && <span>{meta.date}</span>}
            <span>Lecture • {meta.readTime} min</span>
          </motion.div>

          {content ? (
            <motion.div
              variants={fadeUp}
              className="article-html-content"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <motion.p variants={fadeUp} className="text-muted-foreground">
              Contenu non disponible.
            </motion.p>
          )}

          {/* Interactions d'article (likes temps réel) */}
          <ArticleInteractions
            articleId={slug}
            articleTitle={meta.title}
            articleUrl={articleUrl}
            onCommentClick={() =>
              commentsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          />

          {/* Signature de l'auteur */}
          <AuthorSignature 
            authorName="Messan Salem ADIGUIDI"
            date={meta.date}
            category={meta.category}
          />

          {/* Commentaires temps réel */}
          <div ref={commentsRef}>
            <ArticleComments articleId={slug} articleTitle={meta.title} />
          </div>

          <motion.div
            variants={fadeUp}
            className="mt-16 pt-8 border-t border-border"
          >
            <h3 className="text-xl font-serif mb-4">Articles connexes</h3>
            <Link href="/academy/articles">
              <Button variant="outline">Découvrir d'autres articles</Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
