import {
  generateLumeniaxTrigger,
  type ContentType,
  type TriggerType,
} from "./lumeniax-triggers";

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
  excerpt: string;
  keywords: string[];
  variants: Record<ShareNetwork, string>;
  psychology: {
    trigger: TriggerType;
    contentType: ContentType;
    tension: string;
    conclusion: string;
    cta: string;
  };
}

export interface ArticleInput {
  id: string;
  title: string;
  content?: string;
  description?: string;
  category?: string;
  icon?: string;
}

const CACHE_PREFIX = "lumeniax:viral-summary:v2:";

const EMOTION_LEXICON: Record<string, { weight: number; emojis: string[] }> = {
  secret: { weight: 3, emojis: ["🤫", "👀"] },
  verite: { weight: 3, emojis: ["💡", "🧠"] },
  cache: { weight: 3, emojis: ["🕵️", "🔍"] },
  revelation: { weight: 3, emojis: ["💥", "✨"] },
  mystere: { weight: 2, emojis: ["🔮"] },
  choc: { weight: 3, emojis: ["⚡", "💥"] },
  danger: { weight: 3, emojis: ["⚠️"] },
  piege: { weight: 3, emojis: ["⚠️", "🪤"] },
  erreur: { weight: 2, emojis: ["⚠️"] },
  attention: { weight: 2, emojis: ["⚠️"] },
  puissance: { weight: 2, emojis: ["🔥", "💪"] },
  force: { weight: 2, emojis: ["💪"] },
  reussir: { weight: 2, emojis: ["🚀"] },
  succes: { weight: 2, emojis: ["🏆"] },
  transformer: { weight: 2, emojis: ["🦋"] },
  dieu: { weight: 2, emojis: ["🙏", "✨"] },
  foi: { weight: 1, emojis: ["🙏"] },
  cerveau: { weight: 1, emojis: ["🧠"] },
  sagesse: { weight: 1, emojis: ["📚"] },
  temps: { weight: 1, emojis: ["⏳"] },
  productivite: { weight: 1, emojis: ["⚡"] },
  peur: { weight: 2, emojis: ["😱"] },
  douleur: { weight: 2, emojis: ["💔"] },
};

const CATEGORY_EMOJI: Record<string, string> = {
  "Spiritualité & Foi": "🙏",
  Philosophie: "📚",
  "Développement personnel": "🌱",
  Psychologie: "🧠",
  Sciences: "🔬",
  Technologie: "💻",
  Productivité: "⚡",
  Société: "🌍",
  Mindset: "🎯",
  Vérité: "💎",
  Décision: "⏹️",
  Comportement: "⚠️",
  Construction: "🌱",
  "Réflexion & Technologie": "🦾",
  "Productivité & Psychologie": "🌊",
};

const ALWAYS_HASHTAGS = ["#Lumeniax", "#LumeniaxAcademy"];
const SITE_HANDLE = "@Lumeniax";

const CATEGORY_HASHTAGS: Record<string, string[]> = {
  "Spiritualité & Foi": ["#Spiritualite", "#Foi", "#Eveil"],
  Philosophie: ["#Philosophie", "#Sagesse"],
  "Développement personnel": ["#DeveloppementPersonnel", "#Mindset"],
  Psychologie: ["#Psychologie", "#Mental"],
  Réflexion: ["#Reflexion", "#Idees"],
  Sciences: ["#Science", "#Connaissance"],
  Technologie: ["#Tech", "#Innovation"],
  Productivité: ["#Productivite", "#Focus"],
  Société: ["#Societe", "#Culture"],
  Mindset: ["#Mindset", "#Discipline"],
  Vérité: ["#Verite", "#Clarte"],
  Décision: ["#Decision", "#Action"],
  Comportement: ["#Habitudes", "#Transformation"],
  Construction: ["#Construction", "#Avenir"],
  "Réflexion & Technologie": ["#Tech", "#Reflexion"],
  "Productivité & Psychologie": ["#Productivite", "#Psychologie"],
};

const STOP_WORDS = new Set([
  "alors",
  "apres",
  "aussi",
  "avec",
  "avoir",
  "avant",
  "beaucoup",
  "bien",
  "cette",
  "ceux",
  "cela",
  "celui",
  "comme",
  "comment",
  "dans",
  "depuis",
  "devoir",
  "donc",
  "encore",
  "entre",
  "faire",
  "faut",
  "leurs",
  "leurs",
  "leurs",
  "meme",
  "moins",
  "notre",
  "nous",
  "parce",
  "pendant",
  "personne",
  "plus",
  "pourquoi",
  "quand",
  "quelque",
  "reste",
  "sans",
  "sera",
  "sont",
  "sous",
  "toute",
  "toutes",
  "votre",
  "vous",
  "etre",
  "dans",
  "mais",
  "cela",
  "ainsi",
  "leur",
  "leurs",
  "elle",
  "elles",
  "nous",
  "tout",
  "tous",
  "cest",
  "cette",
  "cette",
  "celles",
  "cette",
  "dune",
  "dans",
  "pour",
  "avec",
  "aussi",
  "cela",
  "etre",
  "fait",
  "faites",
  "font",
  "plus",
  "trop",
  "ainsi",
  "chez",
  "leurs",
  "vont",
  "faites",
  "votre",
  "comme",
  "cette",
  "ainsi",
  "avant",
  "apres",
  "parmi",
  "selon",
  "juste",
  "entre",
  "parfois",
  "aucune",
  "aucun",
  "jamais",
  "toujours",
  "encore",
  "telle",
  "telles",
  "telles",
  "etre",
  "dans",
  "vrai",
  "vraie",
  "vraies",
  "vrais",
  "the",
  "that",
  "this",
]);

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, " ")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeEntities(value: string) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripHtml(html: string) {
  return decodeEntities(
    html
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

function extractHeadings(html: string) {
  if (!html) return [];

  const output: string[] = [];
  const matcher = /<h([23])[^>]*>([\s\S]*?)<\/h\1>/gi;
  let result: RegExpExecArray | null;

  while ((result = matcher.exec(html)) !== null) {
    const text = decodeEntities(result[2].replace(/<[^>]+>/g, " "))
      .replace(/\s+/g, " ")
      .trim();
    if (text && text.length >= 3 && text.length <= 120) {
      output.push(text);
    }
  }

  return Array.from(new Set(output));
}

function splitSentences(text: string) {
  return text
    .split(/(?<=[.!?])\s+(?=[A-ZÀ-ÖØ-Ý])/u)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 24 && sentence.length < 260);
}

function scoreSentence(sentence: string) {
  const normalized = normalizeText(sentence);
  let score = 0;
  const emojis = new Set<string>();

  Object.entries(EMOTION_LEXICON).forEach(([token, meta]) => {
    if (normalized.includes(token)) {
      score += meta.weight;
      meta.emojis.forEach((emoji) => emojis.add(emoji));
    }
  });

  if (/[!?]/.test(sentence)) score += 1;
  if (/\b(jamais|toujours|tout|rien|seul|maintenant)\b/i.test(sentence)) score += 1;
  if (sentence.length < 150) score += 1;

  return { score, emojis: Array.from(emojis) };
}

function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
}

function cleanOutlineEntry(value: string) {
  return value.replace(/^[^A-Za-zÀ-ÿ0-9]+/u, "").trim();
}

function bulletLabel(index: number, emojis: string[]) {
  const fallback = ["✨", "🔥", "💡", "🎯", "⚡"];
  return emojis[index] || fallback[index % fallback.length];
}

function toTitleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function extractKeywords(
  article: ArticleInput,
  corpus: string,
  headings: string[],
) {
  const scores = new Map<string, number>();
  const pushWords = (input: string, weight: number) => {
    const tokens = normalizeText(input).match(/[a-z0-9-]{4,}/g) || [];
    tokens.forEach((token) => {
      if (STOP_WORDS.has(token) || /^\d+$/.test(token)) return;
      scores.set(token, (scores.get(token) || 0) + weight);
    });
  };

  pushWords(article.title, 4);
  pushWords(article.description || "", 3);
  pushWords(article.category || "", 3);
  headings.forEach((heading) => pushWords(heading, 2));
  pushWords(corpus, 1);

  return Array.from(scores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([token]) => toTitleCase(token.replace(/-/g, " ")));
}

function buildCategoryHashtags(category?: string) {
  if (!category) return [];
  if (CATEGORY_HASHTAGS[category]) return CATEGORY_HASHTAGS[category];

  const generated = category
    .split(/[,&/|-]/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 3)
    .map((part) =>
      `#${normalizeText(part)
        .split(" ")
        .map((word) => toTitleCase(word))
        .join("")}`,
    )
    .filter((hashtag) => hashtag.length > 1);

  return generated;
}

function buildHashtags(article: ArticleInput) {
  const tags = new Set<string>(ALWAYS_HASHTAGS);
  buildCategoryHashtags(article.category).forEach((tag) => tags.add(tag));
  return Array.from(tags).slice(0, 5).join(" ");
}

function buildHashtagsTwitter(article: ArticleInput) {
  return buildHashtags(article)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function truncateTwitter(text: string) {
  if (text.length <= 240) return text;
  return `${text.slice(0, 237).trimEnd()}…`;
}

function runHeuristicSummary(article: ArticleInput): ViralSummary {
  const raw = article.content ? stripHtml(article.content) : "";
  const corpus = raw || article.description || article.title;
  const headings = article.content ? extractHeadings(article.content) : [];
  const sentences = splitSentences(corpus);
  const scored = sentences
    .map((sentence) => ({ sentence, ...scoreSentence(sentence) }))
    .sort((left, right) => right.score - left.score);

  const primarySentence = scored[0]?.sentence || article.description || article.title;
  const secondarySentence =
    scored.find((entry) => entry.sentence !== primarySentence && entry.score > 0)
      ?.sentence || article.description || "";

  const aggregateEmojis = new Set<string>();
  scored.slice(0, 5).forEach((entry) =>
    entry.emojis.forEach((emoji) => aggregateEmojis.add(emoji)),
  );

  if (article.category && CATEGORY_EMOJI[article.category]) {
    aggregateEmojis.add(CATEGORY_EMOJI[article.category]);
  }
  if (article.icon) aggregateEmojis.add(article.icon);

  const emojis = Array.from(aggregateEmojis).slice(0, 4);
  const baseEmoji = emojis[0] || article.icon || "🔥";
  const excerpt = truncate(primarySentence, 220);
  const supportingLine =
    secondarySentence && secondarySentence !== primarySentence
      ? truncate(secondarySentence, 180)
      : "";
  const keywords = extractKeywords(article, corpus, headings);

  const lumeniax = generateLumeniaxTrigger(corpus, article.id || article.title);
  const hook = lumeniax.hook;

  const outlineSource =
    headings.length >= 2
      ? headings.slice(0, 4)
      : scored
          .map((entry) => entry.sentence)
          .filter((sentence) => sentence !== primarySentence)
          .slice(0, 4)
          .map((sentence) => truncate(sentence, 96));

  const outline = outlineSource.map(
    (entry, index) => `${bulletLabel(index, emojis.slice(1))} ${entry}`,
  );
  const plainOutline = outline.map((entry) => cleanOutlineEntry(entry));
  const outlineBlock = plainOutline.length
    ? `\n\nÀ retenir :\n${plainOutline.map((entry) => `• ${entry}`).join("\n")}`
    : "";

  const brandLine = `${SITE_HANDLE} • ${buildHashtags(article)}`;
  const intro =
    `${baseEmoji} ${hook}\n\n` +
    `${article.title}\n\n` +
    `${excerpt}` +
    (supportingLine ? `\n\n${supportingLine}` : "");

  const bodyCore =
    `${intro}${outlineBlock}\n\n` +
    `⚡ ${lumeniax.mentalTension}\n\n` +
    `${lumeniax.conclusion}\n\n` +
    `${lumeniax.cta}`;

  const text = `${bodyCore}\n\n${brandLine}`;

  const whatsappBody =
    `${baseEmoji} *${hook}*\n\n` +
    `*${article.title}*\n\n` +
    `${excerpt}` +
    (supportingLine ? `\n\n_${supportingLine}_` : "") +
    outlineBlock +
    `\n\n⚡ ${lumeniax.mentalTension}\n\n${lumeniax.cta}\n\n${brandLine}`;

  const facebookBody =
    `${baseEmoji} ${hook}\n\n` +
    `${article.title.toUpperCase()}\n\n` +
    `${excerpt}` +
    (supportingLine ? `\n\n${supportingLine}` : "") +
    outlineBlock +
    `\n\n${lumeniax.conclusion}\n\n${lumeniax.cta}\n\n${brandLine}`;

  const telegramBody =
    `${baseEmoji} ${hook}\n\n` +
    `**${article.title}**\n\n` +
    `${excerpt}` +
    outlineBlock +
    `\n\n${lumeniax.cta}\n\n${brandLine}`;

  const messengerBody =
    `${baseEmoji} ${hook}\n\n` +
    `${excerpt}` +
    (plainOutline[0] ? `\n\n• ${plainOutline[0]}` : "") +
    `\n\n${lumeniax.cta}\n\n${brandLine}`;

  const twitterBody = truncateTwitter(
    `${baseEmoji} ${hook}\n\n${truncate(excerpt, 120)}\n\n${SITE_HANDLE} ${buildHashtagsTwitter(article)}`,
  );

  const rawScore =
    (scored[0]?.score || 0) +
    Math.min(emojis.length, 3) +
    Math.min(outline.length, 3) +
    Math.min(keywords.length, 2) +
    (supportingLine ? 1 : 0);
  const score = Math.max(1, Math.min(10, 4 + Math.round(rawScore / 2)));

  return {
    text,
    score,
    emojis,
    hook,
    intro,
    outline,
    excerpt,
    keywords,
    psychology: {
      trigger: lumeniax.trigger,
      contentType: lumeniax.type,
      tension: lumeniax.mentalTension,
      conclusion: lumeniax.conclusion,
      cta: lumeniax.cta,
    },
    variants: {
      default: text,
      whatsapp: whatsappBody,
      facebook: facebookBody,
      messenger: messengerBody,
      telegram: telegramBody,
      twitter: twitterBody,
    },
  };
}

export async function generateShareSummary(
  article: ArticleInput,
  options: { force?: boolean } = {},
): Promise<ViralSummary> {
  const cacheKey = CACHE_PREFIX + article.id;

  if (!options.force && typeof localStorage !== "undefined") {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached) as ViralSummary;
    } catch {
      // Ignore invalid cache entries.
    }
  }

  const summary = runHeuristicSummary(article);

  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(cacheKey, JSON.stringify(summary));
    } catch {
      // Ignore storage quota issues.
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

  for (let index = localStorage.length - 1; index >= 0; index--) {
    const key = localStorage.key(index);
    if (key && key.startsWith(CACHE_PREFIX)) {
      localStorage.removeItem(key);
    }
  }
}
