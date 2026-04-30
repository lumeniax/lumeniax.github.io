/**
 * Moteur de déclencheurs psychologiques adaptatifs – Lumeniax
 * 
 * Ce module analyse le contenu pour générer des versions virales optimisées
 * basées sur des déclencheurs psychologiques spécifiques.
 */

export type ContentType = 'vérité dure' | 'conseil' | 'histoire personnelle' | 'motivation' | 'spirituel';
export type TriggerType = 'curiosité' | 'ego' | 'urgence' | 'appartenance' | 'vérité';

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
    "Ce que personne ne vous dira sur ce sujet...",
    "J'ai découvert un secret que 99% des gens ignorent.",
    "Arrêtez tout. Voici la pièce manquante du puzzle.",
    "Pourquoi tout ce que vous savez sur ce sujet est probablement faux."
  ],
  ego: [
    "Seuls les esprits les plus aiguisés comprendront ceci.",
    "Êtes-vous prêt à passer au niveau supérieur ?",
    "Ce n'est pas pour tout le monde. C'est pour ceux qui osent.",
    "La différence entre ceux qui réussissent et les autres tient en une phrase."
  ],
  urgence: [
    "Lisez ceci avant qu'il ne soit trop tard.",
    "Le monde change, et vous risquez de rester sur le carreau.",
    "Chaque seconde compte. Voici pourquoi vous devez agir maintenant.",
    "L'opportunité de votre vie est juste devant vous."
  ],
  appartenance: [
    "Nous sommes une nouvelle génération de penseurs.",
    "Rejoignez ceux qui refusent la médiocrité.",
    "Vous n'êtes plus seul dans cette quête.",
    "Ensemble, nous redéfinissons les règles du jeu."
  ],
  vérité: [
    "La vérité est souvent brutale, mais elle libère.",
    "Assez de mensonges. Voici la réalité du terrain.",
    "Ce que vous fuyez est exactement ce dont vous avez besoin.",
    "Regardez la réalité en face, même si elle fait mal."
  ]
};

const TENSIONS: Record<ContentType, string[]> = {
  'vérité dure': ["Le confort est votre pire ennemi.", "Votre déni est votre prison.", "La réalité ne se soucie pas de vos sentiments."],
  'conseil': ["Appliquer ceci demande du courage.", "Savoir ne suffit pas, agir est la clé.", "Le prix de l'inaction est plus élevé que celui de l'effort."],
  'histoire personnelle': ["J'ai dû tout perdre pour comprendre.", "Derrière chaque succès se cache une cicatrice.", "Mon échec a été ma plus grande leçon."],
  'motivation': ["Votre potentiel est une bombe à retardement.", "Le destin n'attend pas les indécis.", "Brisez vos chaînes mentales aujourd'hui."],
  'spirituel': ["L'invisible dirige le visible.", "Votre âme connaît déjà le chemin.", "Le silence contient toutes les réponses."]
};

const CONCLUSIONS: string[] = [
  "Le choix vous appartient désormais.",
  "Ne laissez pas cette pensée s'éteindre.",
  "Transformez cette prise de conscience en action.",
  "L'évolution commence par un simple pas.",
  "Soyez le changement que vous cherchez."
];

const CTAS: string[] = [
  "Partagez si vous osez dire la vérité.",
  "Taguez quelqu'un qui a besoin d'entendre ça.",
  "Commentez 'PRÊT' pour passer à l'action.",
  "Enregistrez ce post pour ne jamais oublier.",
  "Partagez pour éveiller les consciences."
];

function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function detectContentType(content: string): ContentType {
  const text = content.toLowerCase();
  if (text.includes('dieu') || text.includes('âme') || text.includes('prière') || text.includes('spirituel')) return 'spirituel';
  if (text.includes('échec') || text.includes('vérité') || text.includes('brutal') || text.includes('mensonge')) return 'vérité dure';
  if (text.includes('je') || text.includes('mon') || text.includes('ma') || text.includes('vécu')) return 'histoire personnelle';
  if (text.includes('comment') || text.includes('astuce') || text.includes('conseil') || text.includes('étape')) return 'conseil';
  return 'motivation';
}

export function generateLumeniaxTrigger(content: string): LumeniaxOutput {
  const type = detectContentType(content);
  
  // Mapper le type de contenu à un déclencheur psychologique probable
  const triggerMap: Record<ContentType, TriggerType> = {
    'vérité dure': 'vérité',
    'conseil': 'curiosité',
    'histoire personnelle': 'ego',
    'motivation': 'urgence',
    'spirituel': 'appartenance'
  };
  
  const trigger = triggerMap[type];
  const hook = getRandom(HOOKS[trigger]);
  const tension = getRandom(TENSIONS[type]);
  const conclusion = getRandom(CONCLUSIONS);
  const cta = getRandom(CTAS);
  
  // Nettoyage et optimisation du texte original (tronqué si trop long)
  const optimizedText = content.length > 300 ? content.substring(0, 297) + "..." : content;
  
  const fullOutput = `${hook}\n\n${optimizedText}\n\n⚡ ${tension}\n\n${conclusion}\n\n${cta}\n\n— Lumeniax`;
  
  return {
    hook,
    optimizedText,
    mentalTension: tension,
    conclusion,
    cta,
    fullOutput,
    type,
    trigger
  };
}
