export interface ArticleMeta {
  title: string;
  slug: string;
  category: string;
  date: string;
  icon: string;
  description: string;
  readTime: number;
  file: string;
  contentFile: string;
  legacySlugs?: string[];
}

const ARTICLE_DATA_VERSION = "2026-05-02-articles-v2";

function withVersion(path: string) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}v=${ARTICLE_DATA_VERSION}`;
}

function safeDecodeURIComponent(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function getArticleHref(slug: string) {
  return `/academy/articles/${encodeURIComponent(slug)}`;
}

export function getArticleContentUrl(contentFile: string) {
  return withVersion(`/articles/content/${encodeURIComponent(contentFile)}`);
}

export async function fetchArticleManifest(
  signal?: AbortSignal,
): Promise<ArticleMeta[]> {
  const response = await fetch(withVersion("/articles/articles.json"), {
    signal,
    headers: {
      "cache-control": "no-cache",
      pragma: "no-cache",
    },
  });

  if (!response.ok) {
    throw new Error("Impossible de charger les articles.");
  }

  return response.json();
}

export function resolveArticleBySlug(
  articles: ArticleMeta[],
  rawSlug: string,
) {
  const slug = safeDecodeURIComponent(rawSlug);

  return (
    articles.find(
      (article) =>
        article.slug === slug || article.legacySlugs?.includes(slug),
    ) ?? null
  );
}
