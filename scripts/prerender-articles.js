// ─────────────────────────────────────────────────────────────────────────────
// Pré-rendu OG par article.
//
// Pour chaque article du manifeste, génère :
//   dist/academy/articles/<slug>/index.html
//
// Cette page contient :
//   - les vraies balises <meta og:*> et twitter:* (titre, description, image)
//   - le bundle Vite (script + styles) pour que la SPA boote normalement
//
// Conséquence : Facebook, LinkedIn, WhatsApp & co lisent le bon aperçu,
// et l'utilisateur final voit la SPA comme avant.
// ─────────────────────────────────────────────────────────────────────────────

import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";

const ROOT        = process.cwd();
const DIST_DIR    = join(ROOT, "dist");
const TEMPLATE    = join(DIST_DIR, "index.html");
const MANIFEST    = join(ROOT, "public", "articles", "articles.json");
const SITE_ORIGIN = process.env.SITE_ORIGIN || "https://lumeniax.com";
const SITE_NAME   = "Lumeniax";

function escapeHtml(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildOgBlock({ title, description, url, image }) {
  return [
    `<title>${escapeHtml(title)} — ${SITE_NAME}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    ``,
    `<meta property="og:type" content="article" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:locale" content="fr_FR" />`,
    `<meta property="og:url" content="${escapeHtml(url)}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:image" content="${escapeHtml(image)}" />`,
    `<meta property="og:image:secure_url" content="${escapeHtml(image)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    ``,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(image)}" />`,
    ``,
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
  ].join("\n    ");
}

// Remplace tout le bloc <head> entre les marqueurs <title>…</title> ET
// supprime/écrase les anciennes balises og:/twitter:/description du template.
function injectHead(template, ogBlock) {
  let html = template;

  // Retire toutes les balises og:* / twitter:* / description / canonical / <title>
  // existantes pour éviter les doublons côté crawler.
  const stripPatterns = [
    /<title[^>]*>[\s\S]*?<\/title>/i,
    /<meta[^>]+name=["']description["'][^>]*>\s*/gi,
    /<meta[^>]+property=["']og:[^"']+["'][^>]*>\s*/gi,
    /<meta[^>]+name=["']twitter:[^"']+["'][^>]*>\s*/gi,
    /<link[^>]+rel=["']canonical["'][^>]*>\s*/gi,
  ];
  for (const re of stripPatterns) html = html.replace(re, "");

  // Injecte le nouveau bloc juste après <head>.
  html = html.replace(/<head([^>]*)>/i, (_m, attrs) => `<head${attrs}>\n    ${ogBlock}`);

  return html;
}

async function main() {
  let template;
  try {
    template = await readFile(TEMPLATE, "utf8");
  } catch {
    console.error(`[prerender] dist/index.html introuvable — lance "vite build" d'abord.`);
    process.exit(0);
  }

  const articles = JSON.parse(await readFile(MANIFEST, "utf8"));
  if (!Array.isArray(articles)) {
    console.error("[prerender] manifest invalide.");
    process.exit(1);
  }

  let count = 0;
  for (const a of articles) {
    if (!a?.slug || !a?.title) continue;

    const url = `${SITE_ORIGIN}/academy/articles/${a.slug}`;
    const image = `${SITE_ORIGIN}/opengraph.jpg`;
    const description = (a.description || a.title).slice(0, 280);

    const ogBlock = buildOgBlock({ title: a.title, description, url, image });
    const html = injectHead(template, ogBlock);

    const outDir = join(DIST_DIR, "academy", "articles", a.slug);
    await mkdir(outDir, { recursive: true });
    await writeFile(join(outDir, "index.html"), html, "utf8");
    count++;
  }

  console.log(`✓ Pré-rendu OG : ${count} pages article générées.`);
}

main().catch((err) => {
  console.error("[prerender] erreur :", err);
  process.exit(1);
});
