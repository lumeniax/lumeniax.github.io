import { readdir, readFile, writeFile, mkdir } from "fs/promises";
import { join, basename } from "path";

const ARTICLES_DIR = join(process.cwd(), "public", "articles");
const CONTENT_DIR = join(ARTICLES_DIR, "content");
const OUTPUT_FILE = join(ARTICLES_DIR, "articles.json");

function extractMeta(html, name) {
  const dq = html.match(new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content="([^"]+)"`, "i"))
    || html.match(new RegExp(`<meta[^>]+content="([^"]+)"[^>]+name=["']${name}["']`, "i"));
  if (dq) return dq[1].trim();
  const sq = html.match(new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content='([^']+)'`, "i"))
    || html.match(new RegExp(`<meta[^>]+content='([^']+)'[^>]+name=["']${name}["']`, "i"));
  return sq ? sq[1].trim() : null;
}

function extractDescription(html) {
  const dq = html.match(/<meta[^>]+name=["']description["'][^>]+content="([^"]+)"/i)
    || html.match(/<meta[^>]+content="([^"]+)"[^>]+name=["']description["']/i);
  if (dq) return dq[1].trim();
  const sq = html.match(/<meta[^>]+name=["']description["'][^>]+content='([^']+)'/i)
    || html.match(/<meta[^>]+content='([^']+)'[^>]+name=["']description["']/i);
  return sq ? sq[1].trim() : "";
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match ? match[1].replace(/\s*-\s*(Lumenia|Lumeniax)[^<]*/i, "").trim() : null;
}

function extractArticleContent(html) {
  const introMatch = html.match(/<p[^>]+class=["'][^"']*article-intro[^"']*["'][^>]*>([\s\S]*?)<\/p>/i);
  const intro = introMatch ? `<p class="article-intro">${introMatch[1]}</p>` : "";

  const BODY_OPEN = '<div class="article-body">';
  const FOOTER_OPEN = '<div class="article-footer">';
  const bodyStart = html.indexOf(BODY_OPEN);

  if (bodyStart === -1) {
    const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    return intro + (mainMatch ? mainMatch[1] : "");
  }

  const bodyContentStart = bodyStart + BODY_OPEN.length;
  const footerStart = html.indexOf(FOOTER_OPEN, bodyContentStart);
  const body = footerStart > bodyContentStart
    ? html.slice(bodyContentStart, footerStart)
    : html.slice(bodyContentStart);

  const cleaned = body
    .replace(/<a[^>]+class=["'][^"']*back-link[^"']*["'][^>]*>[\s\S]*?<\/a>/gi, "")
    .replace(/<a[^>]+class=["'][^"']*back-to-top[^"']*["'][^>]*>[\s\S]*?<\/a>/gi, "")
    .trim();

  return intro + cleaned;
}

function extractBodyText(html) {
  const bodyMatch = html.match(/<div[^>]+class=["'][^"']*article-body[^"']*["'][^>]*>([\s\S]*)/i);
  if (!bodyMatch) return "";
  return bodyMatch[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

async function generateManifest() {
  let files;
  try {
    files = await readdir(ARTICLES_DIR);
  } catch {
    console.error("Dossier public/articles introuvable.");
    process.exit(1);
  }

  await mkdir(CONTENT_DIR, { recursive: true });

  const htmlFiles = files.filter(
    (f) => f.endsWith(".html") && f !== "index.html"
  );

  const articles = [];

  for (const file of htmlFiles) {
    const slug = basename(file, ".html");
    const html = await readFile(join(ARTICLES_DIR, file), "utf-8");

    const lumeniaTitle = extractMeta(html, "lumenia:title");
    const fallbackTitle = extractTitle(html);
    const title = lumeniaTitle || fallbackTitle || slug;

    const category = extractMeta(html, "lumenia:category") || "Article";
    const date = extractMeta(html, "lumenia:date") || "";
    const icon = extractMeta(html, "lumenia:icon") || "✦";
    const description = extractDescription(html);

    const articleContent = extractArticleContent(html);
    const contentFile = `${slug}.html`;
    await writeFile(join(CONTENT_DIR, contentFile), articleContent, "utf-8");

    const bodyText = extractBodyText(html);
    const wordCount = bodyText.split(/\s+/).filter(Boolean).length;
    const readTime = Math.max(1, Math.round(wordCount / 200));

    articles.push({ title, slug, category, date, icon, description, readTime, file, contentFile });
  }

  articles.sort((a, b) => a.title.localeCompare(b.title, "fr"));

  await writeFile(OUTPUT_FILE, JSON.stringify(articles, null, 2), "utf-8");
  console.log(`✓ Manifeste généré : ${articles.length} articles → public/articles/articles.json`);
  console.log(`✓ Contenus extraits → public/articles/content/`);
}

generateManifest();
