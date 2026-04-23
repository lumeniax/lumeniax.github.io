// ─────────────────────────────────────────────────────────────────────────────
// Met à jour dynamiquement les balises Open Graph et Twitter Card
// pour la page article courante. Restaure les balises d'origine au démontage.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from "react";

export interface ArticleMetaInput {
  title: string;
  description: string;
  url: string;
  image?: string;
}

const TAGS: Array<{ selector: string; attr: "content"; key: string }> = [
  { selector: 'meta[property="og:title"]', attr: "content", key: "title" },
  { selector: 'meta[property="og:description"]', attr: "content", key: "description" },
  { selector: 'meta[property="og:url"]', attr: "content", key: "url" },
  { selector: 'meta[property="og:image"]', attr: "content", key: "image" },
  { selector: 'meta[property="og:type"]', attr: "content", key: "type" },
  { selector: 'meta[name="twitter:title"]', attr: "content", key: "title" },
  { selector: 'meta[name="twitter:description"]', attr: "content", key: "description" },
  { selector: 'meta[name="twitter:image"]', attr: "content", key: "image" },
  { selector: 'meta[name="twitter:card"]', attr: "content", key: "card" },
  { selector: 'meta[name="description"]', attr: "content", key: "description" },
];

function ensureTag(selector: string): HTMLMetaElement {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    const m = selector.match(/(name|property)="([^"]+)"/);
    if (m) el.setAttribute(m[1], m[2]);
    document.head.appendChild(el);
  }
  return el;
}

export function useArticleMeta(meta: ArticleMetaInput | null) {
  useEffect(() => {
    if (!meta) return;

    const previousTitle = document.title;
    const restore: Array<() => void> = [() => (document.title = previousTitle)];

    document.title = `${meta.title} — Lumeniax`;

    const values: Record<string, string> = {
      title: meta.title,
      description: meta.description,
      url: meta.url,
      image: meta.image || `${window.location.origin}/opengraph.jpg`,
      type: "article",
      card: "summary_large_image",
    };

    for (const tag of TAGS) {
      const value = values[tag.key];
      if (!value) continue;
      const el = ensureTag(tag.selector);
      const previous = el.getAttribute(tag.attr);
      el.setAttribute(tag.attr, value);
      restore.push(() => {
        if (previous === null) el.removeAttribute(tag.attr);
        else el.setAttribute(tag.attr, previous);
      });
    }

    return () => {
      restore.forEach((fn) => fn());
    };
  }, [meta?.title, meta?.description, meta?.url, meta?.image]);
}
