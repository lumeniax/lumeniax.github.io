/**
 * Moteur interne de declencheurs psychologiques adaptatifs.
 *
 * Il est utilise comme couche strategique pour le partage social, sans etre
 * expose comme experience distincte dans l'interface.
 */

export type ContentType =
  | "vérité dure"
  | "conseil"
  | "histoire personnelle"
  | "motivation"
  | "spirituel";

export type TriggerType =
  | "curiosité"
  | "ego"
  | "urgence"
  | "appartenance"
  | "vérité";

export interface LumeniaxOutput {
  hook: string;
  optimizedText: string;
  mentalTension: string;
  conclusion: string;
  cta: string;
  fullOutput: string;
  type: ContentType;
  trigger: TriggerType;
}

const HOOKS: Record<TriggerType, string[]> = {
  curiosité: [
    "La piece manquante n'est pas celle que vous imaginez.",
    "Ce detail renverse tout ce qu'on croit savoir sur ce sujet.",
    "Vous allez comprendre pourquoi cette idee accroche autant les esprits.",
    "Le vrai levier est cache en pleine lumiere."
  ],
  ego: [
    "Ceux qui prennent de l'avance voient cela plus tot que les autres.",
    "Les esprits qui montent en gamme ne laissent jamais passer ce signal.",
    "Il y a un niveau de lecture que la plupart n'atteignent jamais.",
    "Les personnes qui progressent vite ont toutes ce reflexe."
  ],
  urgence: [
    "Ce mecanisme agit deja pendant que vous l'ignorez.",
    "Chaque report renforce exactement ce que vous voulez eviter.",
    "Attendre encore revient a lui laisser plus de place.",
    "Le vrai risque n'est pas visible tant qu'il n'est pas trop tard."
  ],
  appartenance: [
    "Les personnes qui avancent ensemble reconnaissent ce signal immediatement.",
    "Une meme prise de conscience relie souvent ceux qui evoluent.",
    "Ce message parle a ceux qui refusent la surface.",
    "On reconnait sa tribu a ce qu'elle choisit de regarder en face."
  ],
  vérité: [
    "La verite la plus utile est rarement la plus confortable.",
    "Le point aveugle n'est pas la ou tout le monde regarde.",
    "Ce que vous evitez de nommer pilote souvent le reste.",
    "Le probleme n'est pas toujours celui que l'on croit."
  ]
};

const TENSIONS: Record<ContentType, string[]> = {
  "vérité dure": [
    "Le confort prolonge souvent le vrai probleme.",
    "Ce que vous tolérez finit par vous definir.",
    "La lucidite demande parfois de rompre avec l'habitude."
  ],
  conseil: [
    "Comprendre sans appliquer ne change encore rien.",
    "La valeur apparait seulement quand l'idee devient un geste.",
    "Le plus dur n'est pas de savoir, c'est de corriger le rythme."
  ],
  "histoire personnelle": [
    "Ce type de bascule laisse toujours une trace durable.",
    "Les vraies lecons naissent souvent d'une friction intime.",
    "Ce qui semble personnel touche en realite un schema plus large."
  ],
  motivation: [
    "Ce potentiel reste bloque tant qu'il n'entre pas en mouvement.",
    "L'energie sans direction nourrit surtout la frustration.",
    "Le moment cle arrive avant la sensation d'etre pret."
  ],
  spirituel: [
    "Le calme revele parfois ce que le bruit vous cache.",
    "L'invisible faconne souvent les decisions visibles.",
    "Certaines verites se discernent mieux quand tout ralentit."
  ]
};

const CONCLUSIONS: string[] = [
  "La prise de conscience devient utile seulement lorsqu'elle modifie votre prochaine action.",
  "La bonne question maintenant est ce que vous changez des aujourd'hui.",
  "La clarte n'a de valeur que si elle se transforme en direction.",
  "Il suffit parfois d'un ajustement net pour rompre tout un cycle."
];

const CTAS: string[] = [
  "Gardez cette idee pres de vous et partagez-la a la bonne personne.",
  "Si ce message vous parle, envoyez-le a quelqu'un qui doit le lire maintenant.",
  "Enregistrez cette idee et transmettez-la avant que l'urgence ne retombe.",
  "Partagez ce point de vue si vous voulez provoquer une vraie reaction."
];

const CONTENT_SIGNALS: Array<{ type: ContentType; words: string[] }> = [
  {
    type: "spirituel",
    words: ["dieu", "ame", "priere", "silence", "esprit", "foi", "sacre", "meditation", "invisible"]
  },
  {
    type: "vérité dure",
    words: ["verite", "mensonge", "realite", "illusion", "brutal", "fuir", "deni", "blocage", "manipulation"]
  },
  {
    type: "histoire personnelle",
    words: ["j'ai", "je", "mon", "ma", "mes", "vecu", "experience", "histoire", "parcours"]
  },
  {
    type: "conseil",
    words: ["comment", "astuce", "methode", "conseil", "etape", "technique", "strategie", "guide"]
  },
  {
    type: "motivation",
    words: ["oser", "agir", "discipline", "changer", "passer", "maintenant", "ambition", "avance", "courage"]
  }
];

const TRIGGER_SIGNALS: Array<{ trigger: TriggerType; words: string[] }> = [
  {
    trigger: "curiosité",
    words: ["pourquoi", "comment", "secret", "cache", "mystere", "detail", "decouvrir", "piece", "levier"]
  },
  {
    trigger: "ego",
    words: ["elite", "niveau", "avance", "leaders", "aiguises", "rare", "maitrise", "superieur", "discipline"]
  },
  {
    trigger: "urgence",
    words: ["maintenant", "temps", "tard", "avant", "danger", "risque", "detruit", "bloque", "agir"]
  },
  {
    trigger: "appartenance",
    words: ["nous", "ensemble", "communaute", "generation", "tribu", "partage", "relie", "collectif", "alliance"]
  },
  {
    trigger: "vérité",
    words: ["verite", "mensonge", "realite", "face", "brutale", "illusion", "deni", "frontal", "nommer"]
  }
];

const TYPE_TO_TRIGGER: Record<ContentType, TriggerType> = {
  "vérité dure": "vérité",
  conseil: "curiosité",
  "histoire personnelle": "ego",
  motivation: "urgence",
  spirituel: "appartenance"
};

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function compactText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function seedHash(seed: string) {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}

function pickSeeded<T>(values: T[], seed: string): T {
  return values[seedHash(seed) % values.length];
}

function countMatches(text: string, words: string[]) {
  return words.reduce((score, word) => {
    if (word.includes("'") || word.includes(" ")) {
      return score + (text.includes(word) ? 2 : 0);
    }

    const pattern = new RegExp(`\\b${word}\\b`, "g");
    const matches = text.match(pattern);
    return score + (matches?.length || 0);
  }, 0);
}

export function detectContentType(content: string): ContentType {
  const text = normalizeText(content);
  const ranked = CONTENT_SIGNALS.map(({ type, words }) => ({
    type,
    score: countMatches(text, words),
  })).sort((a, b) => b.score - a.score);

  if (ranked[0] && ranked[0].score > 0) {
    return ranked[0].type;
  }

  return "motivation";
}

function detectTrigger(content: string, type: ContentType): TriggerType {
  const text = normalizeText(content);
  const ranked = TRIGGER_SIGNALS.map(({ trigger, words }) => ({
    trigger,
    score: countMatches(text, words) + (TYPE_TO_TRIGGER[type] === trigger ? 2 : 0),
  })).sort((a, b) => b.score - a.score);

  if (ranked[0] && ranked[0].score > 0) {
    return ranked[0].trigger;
  }

  return TYPE_TO_TRIGGER[type];
}

export function generateLumeniaxTrigger(
  content: string,
  seed = "",
): LumeniaxOutput {
  const source = compactText(content);
  const type = detectContentType(source);
  const trigger = detectTrigger(source, type);
  const identity = `${seed}:${type}:${trigger}:${source.slice(0, 280)}`;

  const hook = pickSeeded(HOOKS[trigger], `${identity}:hook`);
  const tension = pickSeeded(TENSIONS[type], `${identity}:tension`);
  const conclusion = pickSeeded(CONCLUSIONS, `${identity}:conclusion`);
  const cta = pickSeeded(CTAS, `${identity}:cta`);
  const optimizedText =
    source.length > 280 ? `${source.slice(0, 277).trimEnd()}...` : source;
  const fullOutput = `${hook}\n\n${optimizedText}\n\n⚡ ${tension}\n\n${conclusion}\n\n${cta}`;

  return {
    hook,
    optimizedText,
    mentalTension: tension,
    conclusion,
    cta,
    fullOutput,
    type,
    trigger,
  };
}
