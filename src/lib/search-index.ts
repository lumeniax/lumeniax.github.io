export type SearchResult = {
  title: string;
  description: string;
  url: string;
  category: string;
  type: 'page' | 'article' | 'service';
};

export const GLOBAL_PAGES: SearchResult[] = [
  { title: "Accueil", description: "Page principale de l'écosystème Lumeniax.", url: "/", category: "Navigation", type: "page" },
  { title: "Studio", description: "Agence de transformation digitale, design et IA.", url: "/studio", category: "Studio", type: "page" },
  { title: "Academy", description: "Plateforme de savoirs, formations et médias.", url: "/academy", category: "Academy", type: "page" },
  { title: "À Propos", description: "Découvrez notre manifeste et notre vision.", url: "/about", category: "Navigation", type: "page" },
  { title: "Contact", description: "Contactez-nous pour vos projets ou questions.", url: "/contact", category: "Navigation", type: "page" },
  { title: "Communauté", description: "Rejoignez le cercle restreint d'esprits exigeants.", url: "/academy/communaute", category: "Academy", type: "page" },
  { title: "Formations", description: "Masterclasses et formations de haut niveau.", url: "/academy/formations", category: "Academy", type: "page" },
  { title: "Services Studio", description: "Nos expertises en design, IA et développement.", url: "/studio/services", category: "Studio", type: "page" },
  { title: "Portfolio", description: "Découvrez nos réalisations et projets livrés.", url: "/studio/portfolio", category: "Studio", type: "page" },
];

export const STUDIO_SERVICES: SearchResult[] = [
  { title: "Design UI/UX Premium", description: "Création d'interfaces modernes et mémorables.", url: "/studio/services", category: "Design", type: "service" },
  { title: "Développement Web & Mobile", description: "Solutions techniques robustes et performantes.", url: "/studio/services", category: "Tech", type: "service" },
  { title: "Intégration IA", description: "Automatisation et intelligence artificielle sur-mesure.", url: "/studio/services", category: "IA", type: "service" },
  { title: "Stratégie Digitale", description: "Accompagnement des décideurs dans leur transformation.", url: "/studio/services", category: "Stratégie", type: "service" },
];

// Cette fonction sera utilisée pour fusionner les articles du JSON avec les pages statiques
export async function getSearchIndex(): Promise<SearchResult[]> {
  try {
    const response = await fetch('/articles/articles.json');
    const articles = await response.json();
    
    const articleResults: SearchResult[] = articles.map((a: any) => ({
      title: a.title,
      description: a.description || `Article dans la catégorie ${a.category}`,
      url: `/academy/articles/${a.slug}`,
      category: a.category,
      type: 'article'
    }));

    return [...GLOBAL_PAGES, ...STUDIO_SERVICES, ...articleResults];
  } catch (error) {
    console.error("Erreur lors du chargement de l'index de recherche:", error);
    return [...GLOBAL_PAGES, ...STUDIO_SERVICES];
  }
}
