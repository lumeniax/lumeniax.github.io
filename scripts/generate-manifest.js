import { readdir, readFile, writeFile, mkdir } from "fs/promises";
import { join, basename } from "path";

const ARTICLES_DIR = join(process.cwd(), "public", "articles");
const CONTENT_DIR = join(ARTICLES_DIR, "content");
const OUTPUT_FILE = join(ARTICLES_DIR, "articles.json");
const SAFE_SLUG_PATTERN = /^[a-z0-9-]+$/;

const LEGACY_SLUG_ALIASES = {
  "15-utiliser-ia-pour-gagner-de-largent": [
    "utiliser-ia-pour-gagner-de-largent",
    "comment-utiliser-l-ia-pour-gagner-de-l-argent-en-2026-guide-pratique",
  ],
  "7-choses-eviter-spirituellement-puissant": [
    "7-choses-a-eviter-pour-devenir-spirituellement-puissant",
  ],
};

function slugify(text) {
  return String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function decodeHtmlEntities(text) {
  if (!text) return "";
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&nbsp;/g, " ");
}

function extractMeta(html, name) {
  // Utilisation de [^]*? (non-greedy) pour capturer tout jusqu'à la fermeture de l'attribut
  // On gère les cas où le contenu contient des apostrophes ou guillemets
  const patterns = [
    new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=(["'])([\\s\\S]*?)\\1`, "i"),
    new RegExp(`<meta[^>]+content=(["'])([\\s\\S]*?)\\1[^>]+name=["']${name}["']`, "i")
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return decodeHtmlEntities(match[2].trim());
  }
  return null;
}

function extractDescription(html) {
  const metaDesc = extractMeta(html, "description");
  if (metaDesc) return metaDesc;

  const introMatch = html.match(/<p[^>]+class=["']article-intro["'][^>]*>([\s\S]*?)<\/p>/i) || 
                     html.match(/<p[^>]+class=["'][^"']*article-intro[^"']*["'][^>]*>([\s\S]*?)<\/p>/i);
  if (introMatch) {
    return decodeHtmlEntities(introMatch[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
  }

  return "";
}

function extractTitle(html) {
  const lumeniaTitle = extractMeta(html, "lumenia:title");
  if (lumeniaTitle) return lumeniaTitle;

  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1Match) {
    return decodeHtmlEntities(h1Match[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
  }

  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (match) {
    return decodeHtmlEntities(match[1]
      .replace(/\s*-\s*(Lumenia|Lumeniax)[^<]*/i, "")
      .trim());
  }

  return null;
}

function extractArticleContent(html) {
  const introMatch = html.match(/<p[^>]+class=["'][^"']*article-intro[^"']*["'][^>]*>([\s\S]*?)<\/p>/i);
  const intro = introMatch ? `<p class="article-intro">${introMatch[1]}</p>` : "";

  let body = "";
  const BODY_OPEN = '<div class="article-body">';
  const FOOTER_OPEN = '<div class="article-footer">';
  
  const bodyStart = html.indexOf(BODY_OPEN);
  if (bodyStart !== -1) {
    const bodyContentStart = bodyStart + BODY_OPEN.length;
    const footerStart = html.indexOf(FOOTER_OPEN, bodyContentStart);
    body = footerStart > bodyContentStart
      ? html.slice(bodyContentStart, footerStart)
      : html.slice(bodyContentStart);
      
    const openDivs = (body.match(/<div/g) || []).length;
    const closeDivs = (body.match(/<\/div>/g) || []).length;
    if (openDivs > closeDivs) {
      body += "</div>".repeat(openDivs - closeDivs);
    }
  } else {
    const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i) || html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    body = mainMatch ? mainMatch[1] : html;
  }

  const cleaned = body
    .replace(/<header[\s\S]*?<\/header>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "")
    .replace(/<nav[\s\S]*?<\/nav>/gi, "")
    .replace(/<a[^>]+class=["'][^"']*back-link[^"']*["'][^>]*>[\s\S]*?<\/a>/gi, "")
    .replace(/<a[^>]+class=["'][^"']*back-to-top[^"']*["'][^>]*>[\s\S]*?<\/a>/gi, "")
    .trim();

  return intro + cleaned;
}

function extractBodyText(html) {
  const content = extractArticleContent(html);
  return content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

async function generateManifest() {
  console.log("🚀 Démarrage de la génération du manifeste (version finale sans coupures)...");
  
  let files;
  try {
    files = await readdir(ARTICLES_DIR);
  } catch (err) {
    console.error("❌ Erreur : Dossier public/articles introuvable.", err);
    process.exit(1);
  }

  await mkdir(CONTENT_DIR, { recursive: true });

  const htmlFiles = files.filter(
    (f) => f.endsWith(".html") && f !== "index.html" && !f.startsWith("exemple-")
  );

  console.log(`found ${htmlFiles.length} fichiers HTML à traiter.`);

  const articles = [];

  for (const file of htmlFiles) {
    try {
      const rawSlug = basename(file, ".html");
      const html = await readFile(join(ARTICLES_DIR, file), "utf-8");

      const title = extractTitle(html) || rawSlug;
      const category = extractMeta(html, "lumenia:category") || "Article";
      const date = extractMeta(html, "lumenia:date") || "";
      const icon = extractMeta(html, "lumenia:icon") || "✦";
      const description = extractDescription(html);
      const slug = SAFE_SLUG_PATTERN.test(rawSlug) ? rawSlug : slugify(rawSlug);
      const legacySlugs = Array.from(
        new Set([
          ...(slug !== rawSlug ? [rawSlug] : []),
          ...(LEGACY_SLUG_ALIASES[slug] || []),
        ]),
      );

      const articleContent = extractArticleContent(html);
      const contentFile = file;
      await writeFile(join(CONTENT_DIR, contentFile), articleContent, "utf-8");

      const bodyText = extractBodyText(html);
      const wordCount = bodyText.split(/\s+/).filter(Boolean).length;
      const readTime = Math.max(1, Math.round(wordCount / 200));

      const article = {
        title,
        slug,
        category,
        date,
        icon,
        description,
        readTime,
        file,
        contentFile,
      };

      if (legacySlugs.length > 0) {
        article.legacySlugs = legacySlugs;
      }

      articles.push(article);
    } catch (err) {
      console.error(`⚠️ Erreur lors du traitement de ${file}:`, err.message);
    }
  }

  articles.sort((a, b) => {
    if (a.date && b.date) {
      try {
        return b.date.localeCompare(a.date); 
      } catch {
        return a.title.localeCompare(b.title, "fr");
      }
    }
    return a.title.localeCompare(b.title, "fr");
  });

  await writeFile(OUTPUT_FILE, JSON.stringify(articles, null, 2), "utf-8");
  console.log(`✅ Manifeste généré : ${articles.length} articles → public/articles/articles.json`);
  console.log(`✅ Contenus extraits → public/articles/content/`);
}

generateManifest().catch(err => {
  console.error("💥 Erreur fatale lors de la génération :", err);
  process.exit(1);
});
