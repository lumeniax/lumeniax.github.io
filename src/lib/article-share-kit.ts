import { generateSharePoster } from "./share-poster";
import { generateShareSummary, type ArticleInput } from "./viral-summary";
import type { SharePayload } from "./share";

export interface PreparedSharePayload extends SharePayload {}

const SHARE_KIT_CACHE = new Map<string, Promise<PreparedSharePayload>>();

function shareKitKey(article: ArticleInput, url: string) {
  return [
    article.id,
    article.title,
    (article.content || "").slice(0, 512),
    article.description || "",
    article.category || "",
    url,
  ].join("::");
}

export function prepareArticleShare(
  article: ArticleInput,
  url: string,
  options: { force?: boolean } = {},
) {
  const key = shareKitKey(article, url);

  if (!options.force && SHARE_KIT_CACHE.has(key)) {
    return SHARE_KIT_CACHE.get(key)!;
  }

  const promise = (async () => {
    const summary = await generateShareSummary(article, options);
    const poster = await generateSharePoster(article, summary, url, options).catch(
      (error) => {
        console.warn("[share] poster generation failed", error);
        return null;
      },
    );

    return {
      articleId: article.id,
      title: article.title,
      url,
      summary,
      poster,
    };
  })();

  SHARE_KIT_CACHE.set(key, promise);
  return promise;
}

export function warmArticleShare(article: ArticleInput, url: string) {
  void prepareArticleShare(article, url).catch(() => {
    // Warming is opportunistic; user-facing fallbacks still exist.
  });
}
