import { readdir, readFile, writeFile, mkdir } from "fs/promises";
import { join, basename } from "path";

const ARTICLES_DIR = join(process.cwd(), "public", "articles");
const CONTENT_DIR = join(ARTICLES_DIR, "content");
const OUTPUT_FILE = join(ARTICLES_DIR, "articles.json");

function extractMeta(html, name) {
  // Regex plus flexible pour les attributs dans n'importe quel ordre
  const patterns = [
    new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${name}["']`, "i")
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1].trim();
  }
  return null;
}

function extractDescription(html) {
  return extractMeta(html, "description") || "";
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (!match) return null;
  return match[1]
    .replace(/\s*-\s*(Lumenia|Lumeniax)[^<]*/i, "")
    .trim();
}

function extractArticleContent(html) {
  // 1. Chercher l'intro
  const introMatch = html.match(/<p[^>]+class=["'][^"']*article-intro[^"']*["'][^>]*>([\s\S]*?)<\/p>/i);
  const intro = introMatch ? `<p class="article-intro">${introMatch[1]}</p>` : "";

  // 2. Chercher le corps principal
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
      
    // Fermer les balises div si nécessaire (extraction brute)
    const openDivs = (body.match(/<div/g) || []).length;
    const closeDivs = (body.match(/<\/div>/g) || []).length;
    if (openDivs > closeDivs) {
      body += "</div>".repeat(openDivs - closeDivs);
    }
  } else {
    // Fallback sur <main> ou <body>
    const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i) || html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    body = mainMatch ? mainMatch[1] : html;
  }

  // 3. Nettoyage
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
  console.log("🚀 Démarrage de la génération du manifeste...");
  
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
      const slug = basename(file, ".html");
      const html = await readFile(join(ARTICLES_DIR, file), "utf-8");

      const title = extractMeta(html, "lumenia:title") || extractTitle(html) || slug;
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

      articles.push({ 
        title, 
        slug, 
        category, 
        date, 
        icon, 
        description, 
        readTime, 
        file, 
        contentFile 
      });
    } catch (err) {
      console.error(`⚠️ Erreur lors du traitement de ${file}:`, err.message);
    }
  }

  // Tri par date (plus récent en premier) si possible, sinon par titre
  articles.sort((a, b) => {
    if (a.date && b.date) {
      try {
        // Tentative de tri par date (format attendu: "25 avril 2026")
        // Note: Simple comparaison de chaînes si le format est constant, 
        // ou on pourrait parser les mois en français.
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
