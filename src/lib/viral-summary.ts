// ─────────────────────────────────────────────────────────────────────────────
// Générateur de résumé viral pour les partages d'articles.
//
// Stratégie : un moteur heuristique 100% client (aucune clé API requise) qui
// transforme un article en accroche émotionnelle courte, calcule un score de
// viralité (1–10), ajoute des emojis selon la tonalité détectée, et propose
// des variantes adaptées à chaque réseau social (WhatsApp, Facebook, Telegram,
// Twitter / X, Messenger). Les résumés sont mis en cache (localStorage) pour
// éviter tout recalcul.
//
// Le système est conçu comme un point d'extension : il suffit de remplacer
// `runHeuristicSummary` par un appel à une vraie IA (OpenAI, Claude, Gemini…)
// pour basculer en mode IA sans toucher au reste du code.
// ─────────────────────────────────────────────────────────────────────────────

export type ShareNetwork =
  | "default"
  | "whatsapp"
  | "facebook"
  | "messenger"
  | "telegram"
  | "twitter";

export interface ViralSummary {
  text: string;
  score: number;
  emojis: string[];
  hook: string;
  intro: string;
  outline: string[];
  variants: Record<ShareNetwork, string>;
}

export interface ArticleInput {
  id: string;
  title: string;
  content?: string;
  description?: string;
  category?: string;
  icon?: string;
}

const CACHE_PREFIX = "lumeniax:viral-summary:v1:";

// ── Détection émotionnelle ────────────────────────────────────────────────────

const EMOTION_LEXICON: Record<string, { weight: number; emojis: string[] }> = {
  // Curiosité
  secret: { weight: 3, emojis: ["🤫", "👀"] },
  vérité: { weight: 3, emojis: ["💡", "👁️"] },
  vrai: { weight: 1, emojis: ["✨"] },
  caché: { weight: 3, emojis: ["🕵️", "🔍"] },
  révélation: { weight: 3, emojis: ["💥", "✨"] },
  mystère: { weight: 2, emojis: ["🔮"] },
  // Choc / urgence
  choc: { weight: 3, emojis: ["⚡", "💥"] },
  danger: { weight: 3, emojis: ["⚠️"] },
  piège: { weight: 3, emojis: ["⚠️", "🪤"] },
  erreur: { weight: 2, emojis: ["⚠️"] },
  attention: { weight: 2, emojis: ["⚠️"] },
  // Pouvoir / motivation
  puissance: { weight: 2, emojis: ["🔥", "💪"] },
  force: { weight: 2, emojis: ["💪"] },
  réussir: { weight: 2, emojis: ["🚀"] },
  réussite: { weight: 2, emojis: ["🚀"] },
  succès: { weight: 2, emojis: ["🏆"] },
  changer: { weight: 2, emojis: ["🔄"] },
  transformer: { weight: 2, emojis: ["🦋"] },
  // Spiritualité
  dieu: { weight: 2, emojis: ["🙏", "✝️"] },
  esprit: { weight: 1, emojis: ["✨"] },
  foi: { weight: 1, emojis: ["🙏"] },
  // Mental / sagesse
  cerveau: { weight: 1, emojis: ["🧠"] },
  esprit_critique: { weight: 1, emojis: ["🧠"] },
  sagesse: { weight: 1, emojis: ["📖"] },
  philosophie: { weight: 1, emojis: ["📖"] },
  // Productivité / temps
  temps: { weight: 1, emojis: ["⏳"] },
  productivité: { weight: 1, emojis: ["⚡"] },
  // Émotions négatives qui captivent
  fuir: { weight: 2, emojis: ["🏃"] },
  peur: { weight: 2, emojis: ["😱"] },
  douleur: { weight: 2, emojis: ["💔"] },
};

const CATEGORY_EMOJI: Record<string, string> = {
  "Spiritualité & Foi": "🙏",
  "Philosophie": "📖",
  "Développement personnel": "🌱",
  "Psychologie": "🧠",
  "Sciences": "🔬",
  "Technologie": "💻",
  "Productivité": "⚡",
  "Société": "🌍",
};

const HOOK_TEMPLATES = [
  "STOP — lis ça avant de scroller.",
  "Personne ne t'a jamais expliqué ça aussi clairement.",
  "C'est exactement ce que les autres préfèrent que tu ignores.",
  "Lis ça avant qu'il ne soit trop tard.",
  "Ce que je viens de découvrir va te bouleverser.",
  "Si tu lis ça, ta vision changera pour toujours.",
  "Voilà la vérité que personne n'ose dire tout haut.",
  "Ce détail va te faire tout repenser.",
  "Tu ne verras plus jamais les choses pareil.",
  "À lire absolument — et à partager.",
];

const CTA_TEMPLATES = [
  "👇 Découvre tout dans l'article :",
  "👉 L'article complet est ici :",
  "🔗 À lire en entier ici :",
  "✨ Plonge dans la lecture :",
];

// ── Utilitaires ───────────────────────────────────────────────────────────────

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripHtml(html: string): string {
  return decodeEntities(
    html
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\s+/g, " ")
    .trim();
}

// Extrait les titres de sections (H2/H3) pour bâtir le sommaire.
function extractHeadings(html: string): string[] {
  if (!html) return [];
  const out: string[] = [];
  const re = /<h([23])[^>]*>([\s\S]*?)<\/h\1>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const text = decodeEntities(m[2].replace(/<[^>]+>/g, " "))
      .replace(/\s+/g, " ")
      .trim();
    if (text && text.length >= 3 && text.length <= 120) out.push(text);
  }
  // Déduplique en gardant l'ordre.
  return Array.from(new Set(out));
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+(?=[A-ZÉÈÀÂÊÎÔÛŒÇ])/u)
    .map((s) => s.trim())
    .filter((s) => s.length > 20 && s.length < 240);
}

function scoreSentence(s: string): { score: number; emojis: string[] } {
  const lower = s.toLowerCase();
  let score = 0;
  const emojis = new Set<string>();
  for (const word of Object.keys(EMOTION_LEXICON)) {
    if (lower.includes(word)) {
      score += EMOTION_LEXICON[word].weight;
      EMOTION_LEXICON[word].emojis.forEach((e) => emojis.add(e));
    }
  }
  if (/[!?]/.test(s)) score += 1;
  if (/\b(jamais|toujours|tout|rien|seul)\b/i.test(s)) score += 1;
  if (s.length < 140) score += 1;
  return { score, emojis: Array.from(emojis) };
}

function seedHash(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pickHook(seed: string): string {
  return HOOK_TEMPLATES[seedHash(seed) % HOOK_TEMPLATES.length];
}

function pickCTA(seed: string): string {
  return CTA_TEMPLATES[seedHash(seed + "_cta") % CTA_TEMPLATES.length];
}

function bulletEmoji(index: number, themeEmojis: string[]): string {
  const fallback = ["✨", "🔥", "💡", "🎯", "⚡"];
  return themeEmojis[index] || fallback[index % fallback.length];
}

// ── Cœur du moteur ────────────────────────────────────────────────────────────

function runHeuristicSummary(article: ArticleInput): ViralSummary {
  const raw = article.content ? stripHtml(article.content) : "";
  const corpus = raw || article.description || article.title;
  const headings = article.content ? extractHeadings(article.content) : [];

  const sentences = splitSentences(corpus);
  const scored = sentences
    .map((s) => ({ s, ...scoreSentence(s) }))
    .sort((a, b) => b.score - a.score);

  const best = scored[0]?.s || article.description || article.title;

  // Cherche une 2e phrase forte, distincte de la 1ère.
  const second =
    scored.find((x) => x.s !== best && x.score > 0)?.s ||
    article.description ||
    "";

  const aggregateEmojis = new Set<string>();
  scored.slice(0, 5).forEach((x) => x.emojis.forEach((e) => aggregateEmojis.add(e)));

  if (article.category && CATEGORY_EMOJI[article.category]) {
    aggregateEmojis.add(CATEGORY_EMOJI[article.category]);
  }
  if (article.icon) aggregateEmojis.add(article.icon);

  const emojis = Array.from(aggregateEmojis).slice(0, 4);
  const hook = pickHook(article.id || article.title);
  const cta = pickCTA(article.id || article.title);
  const baseEmoji = emojis[0] || "🔥";

  // ── Introduction forte : hook + titre en gras + 1ère phrase choc + relance.
  const trimmedBest = best.length > 220 ? best.slice(0, 217).trimEnd() + "…" : best;
  const trimmedSecond =
    second && second !== best
      ? second.length > 200
        ? second.slice(0, 197).trimEnd() + "…"
        : second
      : "";

  const intro =
    `${baseEmoji} ${hook}\n\n` +
    `« ${article.title} »\n\n` +
    `${trimmedBest}` +
    (trimmedSecond ? `\n\n${trimmedSecond}` : "");

  // ── Sommaire : 3 à 5 grandes lignes pour exciter la curiosité.
  const themeEmojis = emojis.slice(1).concat(["✨", "🔥", "💡", "🎯", "⚡"]);
  let outlineSource = headings.slice(0, 5);
  if (outlineSource.length < 3) {
    // Fallback : on construit des « teasers » à partir des meilleures phrases.
    outlineSource = scored
      .map((x) => x.s)
      .filter((s) => s !== best)
      .slice(0, 4)
      .map((s) => (s.length > 90 ? s.slice(0, 87).trimEnd() + "…" : s));
  }
  const outline = outlineSource.map(
    (h, i) => `${bulletEmoji(i, themeEmojis)} ${h}`
  );

  // ── Texte complet (résumé long, format universel).
  const text =
    intro +
    (outline.length
      ? `\n\n📌 Au programme :\n${outline.join("\n")}`
      : "") +
    `\n\n${cta}`;

  // ── Score viral 1–10.
  const rawScore =
    (scored[0]?.score || 0) +
    emojis.length +
    (sentences.length > 5 ? 1 : 0) +
    (outline.length >= 3 ? 1 : 0) +
    (trimmedSecond ? 1 : 0);
  const score = Math.max(1, Math.min(10, 4 + Math.round(rawScore)));

  // ── Variantes par réseau ───────────────────────────────────────────────────
  const outlineBlock = outline.length
    ? `\n\n📌 Au programme :\n${outline.join("\n")}`
    : "";

  const whatsappBody =
    `${baseEmoji} *${hook}*\n\n` +
    `*${article.title}*\n\n` +
    `${trimmedBest}` +
    (trimmedSecond ? `\n\n_${trimmedSecond}_` : "") +
    outlineBlock +
    `\n\n${cta}`;

  const facebookBody =
    `${emojis.join(" ") || baseEmoji}  ${hook}\n\n` +
    `${article.title.toUpperCase()}\n\n` +
    `${trimmedBest}` +
    (trimmedSecond ? `\n\n${trimmedSecond}` : "") +
    outlineBlock +
    `\n\n${cta}`;

  const telegramBody =
    `${baseEmoji} ${hook}\n\n` +
    `**${article.title}**\n\n` +
    `${trimmedBest}` +
    outlineBlock +
    `\n\n${cta}`;

  const messengerBody =
    `${baseEmoji} ${hook}\n\n${trimmedBest}` +
    (outline.length ? `\n\n• ${outline.slice(0, 3).join("\n• ")}` : "") +
    `\n\n${cta}`;

  const twitterBody = truncateTwitter(
    `${baseEmoji} ${hook}\n\n${trimmedBest}`
  );

  const variants: Record<ShareNetwork, string> = {
    default: text,
    whatsapp: whatsappBody,
    facebook: facebookBody,
    messenger: messengerBody,
    telegram: telegramBody,
    twitter: twitterBody,
  };

  return { text, score, emojis, hook, intro, outline, variants };
}

function truncateTwitter(text: string): string {
  // Garde ~240 caractères pour laisser de la place à l'URL.
  if (text.length <= 240) return text;
  return text.slice(0, 237).trimEnd() + "…";
}

// ── API publique ──────────────────────────────────────────────────────────────

export async function generateShareSummary(
  article: ArticleInput,
  opts: { force?: boolean } = {}
): Promise<ViralSummary> {
  const cacheKey = CACHE_PREFIX + article.id;

  if (!opts.force && typeof localStorage !== "undefined") {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached) as ViralSummary;
    } catch {
      /* ignore */
    }
  }

  // Petite latence simulée pour laisser respirer l'UX (loader visible).
  await new Promise((r) => setTimeout(r, 250));

  const summary = runHeuristicSummary(article);

  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(cacheKey, JSON.stringify(summary));
    } catch {
      /* ignore */
    }
  }

  return summary;
}

export function clearShareSummaryCache(articleId?: string) {
  if (typeof localStorage === "undefined") return;
  if (articleId) {
    localStorage.removeItem(CACHE_PREFIX + articleId);
    return;
  }
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const k = localStorage.key(i);
    if (k && k.startsWith(CACHE_PREFIX)) localStorage.removeItem(k);
  }
}
