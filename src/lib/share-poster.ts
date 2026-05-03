import type { TriggerType } from "./lumeniax-triggers";
import type { ArticleInput, ViralSummary } from "./viral-summary";

export interface SharePoster {
  file: File | null;
  blob: Blob;
  dataUrl: string;
  filename: string;
  mimeType: "image/png";
  width: number;
  height: number;
  alt: string;
}

type PosterPalette = {
  background: [string, string, string];
  accent: string;
  secondary: string;
  text: string;
  muted: string;
  line: string;
};

const POSTER_CACHE = new Map<string, Promise<SharePoster>>();
const POSTER_WIDTH = 1200;
const POSTER_HEIGHT = 1500;

const PALETTES: Record<TriggerType, PosterPalette> = {
  curiosité: {
    background: ["#08111f", "#102543", "#23589b"],
    accent: "#a2d2ff",
    secondary: "#61a5ff",
    text: "#f5fbff",
    muted: "rgba(245,251,255,0.72)",
    line: "rgba(162,210,255,0.16)",
  },
  ego: {
    background: ["#130c22", "#301650", "#7f4de2"],
    accent: "#e8d3ff",
    secondary: "#c59cff",
    text: "#fff8ff",
    muted: "rgba(255,248,255,0.72)",
    line: "rgba(229,211,255,0.18)",
  },
  urgence: {
    background: ["#1a0d10", "#48161f", "#a73b49"],
    accent: "#ffd8cb",
    secondary: "#ff9c88",
    text: "#fff7f5",
    muted: "rgba(255,247,245,0.74)",
    line: "rgba(255,216,203,0.16)",
  },
  appartenance: {
    background: ["#081917", "#0e3d38", "#2d8d7c"],
    accent: "#c9fff0",
    secondary: "#84e6c8",
    text: "#f4fffb",
    muted: "rgba(244,255,251,0.74)",
    line: "rgba(201,255,240,0.16)",
  },
  vérité: {
    background: ["#15110a", "#3b2a10", "#9f6f20"],
    accent: "#ffe2b5",
    secondary: "#ffbd5a",
    text: "#fffaf2",
    muted: "rgba(255,250,242,0.74)",
    line: "rgba(255,226,181,0.18)",
  },
};

function seedHash(seed: string) {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index++) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}

function createRandom(seed: number) {
  let state = seed || 1;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
}

function cleanLine(value: string) {
  return value.replace(/^[^A-Za-zÀ-ÿ0-9]+/u, "").trim();
}

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines = Number.POSITIVE_INFINITY,
) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = context.measureText(testLine).width;

    if (width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });

  if (currentLine) lines.push(currentLine);

  if (lines.length <= maxLines) return lines;

  const clamped = lines.slice(0, maxLines);
  clamped[maxLines - 1] = truncate(clamped[maxLines - 1], Math.max(16, clamped[maxLines - 1].length - 2));
  return clamped;
}

function drawRoundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function fillGradientOrb(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
) {
  const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = gradient;
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill();
}

function drawBackdrop(
  context: CanvasRenderingContext2D,
  palette: PosterPalette,
  seed: string,
) {
  const random = createRandom(seedHash(seed));
  const gradient = context.createLinearGradient(0, 0, POSTER_WIDTH, POSTER_HEIGHT);
  gradient.addColorStop(0, palette.background[0]);
  gradient.addColorStop(0.45, palette.background[1]);
  gradient.addColorStop(1, palette.background[2]);
  context.fillStyle = gradient;
  context.fillRect(0, 0, POSTER_WIDTH, POSTER_HEIGHT);

  context.save();
  context.globalAlpha = 0.95;
  fillGradientOrb(context, POSTER_WIDTH * 0.86, POSTER_HEIGHT * 0.18, 320, `${palette.secondary}55`);
  fillGradientOrb(context, POSTER_WIDTH * 0.18, POSTER_HEIGHT * 0.86, 380, `${palette.accent}33`);
  fillGradientOrb(context, POSTER_WIDTH * 0.58, POSTER_HEIGHT * 0.58, 280, `${palette.secondary}20`);
  context.restore();

  context.save();
  context.strokeStyle = palette.line;
  context.lineWidth = 1;
  for (let x = -160; x < POSTER_WIDTH + 200; x += 120) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x + 240, POSTER_HEIGHT);
    context.stroke();
  }
  context.restore();

  context.save();
  for (let index = 0; index < 14; index++) {
    const size = 24 + random() * 120;
    const x = random() * POSTER_WIDTH;
    const y = random() * POSTER_HEIGHT;
    context.globalAlpha = 0.12 + random() * 0.08;
    context.fillStyle = index % 2 === 0 ? palette.accent : palette.secondary;
    drawRoundedRect(context, x, y, size, size * (0.2 + random() * 0.6), 999);
    context.fill();
  }
  context.restore();
}

function drawPill(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  label: string,
  palette: PosterPalette,
  background = "rgba(255,255,255,0.08)",
) {
  context.save();
  context.font = '600 24px "Segoe UI", sans-serif';
  const width = context.measureText(label).width + 42;
  drawRoundedRect(context, x, y, width, 50, 999);
  context.fillStyle = background;
  context.fill();
  context.strokeStyle = "rgba(255,255,255,0.12)";
  context.stroke();
  context.fillStyle = palette.text;
  context.fillText(label, x + 21, y + 33);
  context.restore();
  return width;
}

function posterKey(article: ArticleInput, summary: ViralSummary, url: string) {
  return [
    article.id,
    article.title,
    summary.hook,
    summary.psychology.trigger,
    summary.keywords.join("|"),
    url,
  ].join("::");
}

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Impossible de générer l'image de partage."));
    }, "image/png");
  });
}

async function createPoster(
  article: ArticleInput,
  summary: ViralSummary,
  url: string,
): Promise<SharePoster> {
  if (typeof document === "undefined") {
    throw new Error("Le générateur d'image n'est disponible que dans le navigateur.");
  }

  const palette = PALETTES[summary.psychology.trigger] || PALETTES.curiosité;
  const canvas = document.createElement("canvas");
  canvas.width = POSTER_WIDTH;
  canvas.height = POSTER_HEIGHT;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas indisponible.");
  }

  drawBackdrop(context, palette, posterKey(article, summary, url));

  context.save();
  context.fillStyle = palette.text;
  context.font = '700 26px "Segoe UI", sans-serif';
  let pillOffset = 88;
  pillOffset += drawPill(context, 88, 92, "Lumeniax Academy", palette, "rgba(255,255,255,0.12)") + 14;
  drawPill(
    context,
    pillOffset,
    92,
    article.category || "Article",
    palette,
    "rgba(255,255,255,0.08)",
  );
  context.restore();

  if (article.icon) {
    context.save();
    context.font = '200 220px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
    context.globalAlpha = 0.26;
    context.textAlign = "right";
    context.fillStyle = palette.accent;
    context.fillText(article.icon, POSTER_WIDTH - 92, 238);
    context.restore();
  }

  const titleX = 92;
  const titleY = 268;
  const titleWidth = 820;
  context.save();
  context.fillStyle = palette.text;
  context.font = '700 82px Georgia, "Times New Roman", serif';
  const titleLines = wrapText(context, article.title, titleWidth, 4);
  titleLines.forEach((line, index) => {
    context.fillText(line, titleX, titleY + index * 92);
  });
  context.restore();

  const hookY = titleY + titleLines.length * 92 + 34;
  context.save();
  context.fillStyle = palette.muted;
  context.font = '600 40px "Segoe UI", sans-serif';
  const hookLines = wrapText(context, summary.hook, titleWidth, 3);
  hookLines.forEach((line, index) => {
    context.fillText(line, titleX, hookY + index * 52);
  });
  context.restore();

  const excerptY = hookY + hookLines.length * 52 + 52;
  context.save();
  drawRoundedRect(context, 86, excerptY - 38, 1028, 286, 36);
  context.fillStyle = "rgba(8, 10, 16, 0.18)";
  context.fill();
  context.strokeStyle = "rgba(255,255,255,0.1)";
  context.stroke();
  context.fillStyle = palette.text;
  context.font = '600 28px "Segoe UI", sans-serif';
  context.fillText("Hook prêt à partager", 126, excerptY + 6);
  context.fillStyle = palette.muted;
  context.font = '400 32px "Segoe UI", sans-serif';
  const excerptLines = wrapText(context, summary.excerpt, 920, 4);
  excerptLines.forEach((line, index) => {
    context.fillText(line, 126, excerptY + 68 + index * 44);
  });
  context.restore();

  const keywordsY = excerptY + 292;
  context.save();
  context.fillStyle = palette.muted;
  context.font = '600 22px "Segoe UI", sans-serif';
  context.fillText("Angles de diffusion", 92, keywordsY);
  context.restore();

  let chipX = 92;
  const chipY = keywordsY + 20;
  const chips = summary.keywords.slice(0, 3);
  chips.forEach((keyword, index) => {
    chipX += drawPill(
      context,
      chipX,
      chipY,
      keyword,
      palette,
      index === 0 ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.08)",
    ) + 14;
  });

  const insightsY = chipY + 114;
  const insightTitle = cleanLine(summary.outline[0] || summary.psychology.tension);
  const insightBody = cleanLine(summary.outline[1] || summary.psychology.conclusion);

  context.save();
  drawRoundedRect(context, 86, insightsY, 1028, 288, 40);
  context.fillStyle = "rgba(3, 6, 12, 0.28)";
  context.fill();
  context.strokeStyle = "rgba(255,255,255,0.12)";
  context.stroke();

  context.fillStyle = palette.accent;
  context.font = '700 22px "Segoe UI", sans-serif';
  context.fillText("Résumé narratif", 126, insightsY + 54);

  context.fillStyle = palette.text;
  context.font = '700 42px Georgia, "Times New Roman", serif';
  const insightTitleLines = wrapText(context, truncate(insightTitle, 84), 900, 2);
  insightTitleLines.forEach((line, index) => {
    context.fillText(line, 126, insightsY + 114 + index * 52);
  });

  context.fillStyle = palette.muted;
  context.font = '400 30px "Segoe UI", sans-serif';
  const insightBodyLines = wrapText(
    context,
    truncate(`${insightBody}. ${summary.psychology.cta}`, 180),
    900,
    3,
  );
  insightBodyLines.forEach((line, index) => {
    context.fillText(line, 126, insightsY + 190 + index * 40);
  });
  context.restore();

  context.save();
  context.strokeStyle = "rgba(255,255,255,0.16)";
  context.beginPath();
  context.moveTo(92, 1374);
  context.lineTo(1108, 1374);
  context.stroke();

  context.fillStyle = palette.text;
  context.font = '600 22px "Segoe UI", sans-serif';
  context.fillText("Partage social prêt", 92, 1418);
  context.fillStyle = palette.muted;
  context.textAlign = "right";
  context.fillText("lumeniax.github.io", 1108, 1418);
  context.restore();

  const blob = await canvasToBlob(canvas);
  const filename = `${article.id || "article"}-share.png`;
  const file =
    typeof File !== "undefined"
      ? new File([blob], filename, { type: "image/png" })
      : null;

  return {
    file,
    blob,
    dataUrl: canvas.toDataURL("image/png"),
    filename,
    mimeType: "image/png",
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    alt: `Visuel de partage pour ${article.title}`,
  };
}

export function generateSharePoster(
  article: ArticleInput,
  summary: ViralSummary,
  url: string,
  options: { force?: boolean } = {},
) {
  const key = posterKey(article, summary, url);

  if (!options.force && POSTER_CACHE.has(key)) {
    return POSTER_CACHE.get(key)!;
  }

  const promise = createPoster(article, summary, url);
  POSTER_CACHE.set(key, promise);
  return promise;
}
