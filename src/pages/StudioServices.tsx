import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, PenTool, Palette, Video, Zap, GraduationCap, ShoppingBag, Search, Lightbulb, Settings, HeartHandshake } from "lucide-react";

export default function StudioServices() {
  const serviceCategories = [
    {
      id: 'redaction',
      title: 'Rédaction & Contenu',
      icon: <PenTool className="w-8 h-8" />,
      tagline: 'Vos mots, amplifiés par l\'IA',
      description: 'Contenus professionnels et persuasifs, du CV au livre, optimisés pour convertir et inspirer.',
      problem: 'Contenus génériques sans impact',
      result: 'Textes professionnels et mémorables',
      color: 'border-primary/50',
      bgColor: 'bg-primary/5',
      services: [
        'CV professionnels optimisés IA',
        'Lettres de motivation personnalisées',
        'Optimisation profils LinkedIn',
        'Discours & exhortations chrétiennes',
        'Ebooks & livres autobiographiques',
        'Articles de blog SEO',
        'Fiches produits e-commerce',
        'Descriptions Airbnb',
        'Scripts YouTube & TikTok',
        'Newsletters & résumés de livres',
        'Mémoires universitaires',
        'Traduction automatique améliorée'
      ]
    },
    {
      id: 'design',
      title: 'Design & Identité Visuelle',
      icon: <Palette className="w-8 h-8" />,
      tagline: 'Votre marque, visuellement distinctive',
      description: 'Logos, affiches, brochures et designs numériques qui captivent et convertissent votre audience.',
      problem: 'Visuels génériques et peu professionnels',
      result: 'Identité visuelle cohérente et attrayante',
      color: 'border-secondary/50',
      bgColor: 'bg-secondary/5',
      services: [
        'Logos avec IA',
        'Affiches & flyers pour églises',
        'Cartes de visite & badges',
        'Couvertures de livres',
        'Miniatures YouTube',
        'Visuels Instagram & PowerPoint',
        'Brochures & catalogues produits',
        'Mockups & packaging',
        'Invitations numériques',
        'Calendriers & stickers digitaux',
        'Templates Canva personnalisés',
        'Tableaux muraux & BD éducatives',
        'Images réalistes pour publicité'
      ]
    },
    {
      id: 'video',
      title: 'Vidéo, Audio & Multimédia',
      icon: <Video className="w-8 h-8" />,
      tagline: 'Contenu audiovisuel qui engage',
      description: 'Vidéos, podcasts et contenus multimédias automatisés pour YouTube, TikTok et réseaux sociaux.',
      problem: 'Production vidéo coûteuse et chronophage',
      result: 'Contenus audiovisuels professionnels',
      color: 'border-accent/50',
      bgColor: 'bg-accent/5',
      services: [
        'Vidéos motivationnelles & explicatives',
        'Montage vidéo automatisé',
        'Vidéos pour églises',
        'Voix off IA & livres audio',
        'Podcasts & méditations audio',
        'Clips TikTok & reels Instagram',
        'Sous-titrage automatique multilingue',
        'Jingles & publicités vidéo',
        'Storytelling vidéo',
        'Vidéos éducatives pour enfants',
        'Contenus YouTube automatisés',
        'Conversion PowerPoint en vidéo',
        'Vidéos immobilières attractives'
      ]
    },
    {
      id: 'business',
      title: 'Business, IA & Automatisation',
      icon: <Zap className="w-8 h-8" />,
      tagline: 'Automatisez, optimisez, croissez',
      description: 'Chatbots, SEO, CRM et automatisation pour transformer votre présence digitale en machine de croissance.',
      problem: 'Processus manuels, absence de stratégie',
      result: 'Systèmes automatisés et rentables',
      color: 'border-primary/50',
      bgColor: 'bg-primary/5',
      services: [
        'Chatbots WhatsApp intelligents',
        'Automatisation réponses clients',
        'Sites web simples avec IA',
        'Landing pages optimisées',
        'Optimisation SEO locale',
        'Gestion réseaux sociaux automatisée',
        'Calendriers éditoriaux',
        'Analyse de marché avec IA',
        'Business plans & plans d\'affaires',
        'Propositions projets ONG',
        'Automatisation facturation',
        'Formulaires intelligents',
        'Tableaux Excel automatisés',
        'CRM simple & systèmes d\'inscription'
      ]
    },
    {
      id: 'formation',
      title: 'Formation & Produits Digitaux',
      icon: <GraduationCap className="w-8 h-8" />,
      tagline: 'Montez en compétences, créez des revenus',
      description: 'Formations pratiques et produits digitaux pour maîtriser l\'IA, le marketing et l\'entrepreneuriat africain.',
      problem: 'Manque de compétences digitales',
      result: 'Expertise et revenus passifs',
      color: 'border-secondary/50',
      bgColor: 'bg-secondary/5',
      services: [
        'Formation IA pour débutants',
        'Formation Prompt Engineering',
        'Formation Canva',
        'Formation création CV',
        'Formation création ebook',
        'Formation marketing digital',
        'Coaching orientation scolaire',
        'Supports scolaires interactifs',
        'Vente ebooks',
        'Templates business plan',
        'Prompts IA prêts à l\'emploi',
        'Packs prédications',
        'Guides pratiques africains',
        'Modèles PowerPoint premium'
      ]
    }
  ];

  const processSteps = [
    { number: '01', icon: <Search className="w-5 h-5" />, title: 'Analyse', description: 'Consultation gratuite pour comprendre vos besoins spécifiques.' },
    { number: '02', icon: <Lightbulb className="w-5 h-5" />, title: 'Stratégie', description: 'Proposition personnalisée avec devis et planning détaillé.' },
    { number: '03', icon: <Settings className="w-5 h-5" />, title: 'Exécution', description: 'Nos experts livrent votre projet avec excellence.' },
    { number: '04', icon: <HeartHandshake className="w-5 h-5" />, title: 'Support', description: 'Ajustements, optimisation et support continu.' }
  ];

  const whyChooseUs = [
    { title: 'Expertise IA', desc: 'Nous utilisons les dernières technologies d\'IA pour automatiser et optimiser.' },
    { title: 'Africain-Centré', desc: 'Solutions adaptées au marché africain et à votre contexte local.' },
    { title: 'Tarifs Accessibles', desc: 'Qualité premium sans prix exorbitant, même pour PME et startups.' },
    { title: 'Support Réactif', desc: 'Équipe disponible pour vos questions et ajustements.' },
    { title: 'Résultats Mesurables', desc: 'Nous suivons les KPIs et optimisons pour votre ROI.' },
    { title: 'Confidentialité', desc: 'Vos données et projets sont sécurisés et confidentiels.' }
  ];

  return (
    <div className="w-full pt-32 pb-20 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        {/* HERO SECTION */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-24 text-center max-w-4xl mx-auto"
        >
          <motion.div variants={fadeUp} className="mb-6 inline-flex items-center space-x-2">
            <div className="w-8 h-[1px] bg-primary"></div>
            <span className="text-xs font-medium tracking-widest text-primary uppercase">Expertise Complète</span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-serif font-medium mb-8 leading-tight">
            Tous nos <span className="italic text-primary">Services</span> Premium
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            De la rédaction à la vidéo, du design à l'automatisation : 5 catégories de services pour transformer votre présence digitale et générer des revenus.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/studio/contact">
              <Button size="lg" className="h-12 px-8 text-sm uppercase tracking-widest">
                Démarrer un projet <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* SERVICES GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-32">
          {serviceCategories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`p-8 md:p-10 border ${cat.color} rounded-3xl ${cat.bgColor} relative group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500`}
            >
              <div className="flex justify-between items-start mb-8">
                <div className="p-4 bg-background rounded-2xl text-primary shadow-sm group-hover:scale-110 transition-transform duration-500">
                  {cat.icon}
                </div>
                <span className="text-4xl font-serif opacity-10 font-bold">0{index + 1}</span>
              </div>
              
              <h2 className="text-2xl font-serif font-medium mb-2">{cat.title}</h2>
              <p className="text-primary text-sm font-medium mb-4 italic">{cat.tagline}</p>
              <p className="text-muted-foreground mb-8 leading-relaxed">{cat.description}</p>
              
              <div className="grid grid-cols-1 gap-2 mb-8 max-h-64 overflow-y-auto pr-2">
                {cat.services.map((s, i) => (
                  <div key={i} className="flex items-start text-sm text-foreground/80">
                    <CheckCircle className="w-4 h-4 text-primary mr-3 flex-shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-border/50 flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-muted-foreground block uppercase tracking-tighter">Résultat</span>
                  <span className="font-medium text-foreground text-sm">{cat.result}</span>
                </div>
                <Link href="/studio/contact">
                  <Button variant="ghost" size="sm" className="group/btn">
                    Détails <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* WHY CHOOSE US */}
        <div className="bg-card border border-border/50 rounded-[2.5rem] p-8 md:p-16 mb-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          
          <div className="relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4">Pourquoi nous choisir ?</h2>
              <p className="text-muted-foreground">Nous combinons expertise, innovation et accessibilité pour votre succès.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {whyChooseUs.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="p-6 border border-border/50 rounded-2xl bg-background/50 hover:border-primary/30 transition-colors"
                >
                  <h3 className="font-serif font-medium text-lg mb-2 text-primary">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* PROCESS SECTION */}
        <div className="bg-card border border-border/50 rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden mb-32">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          
          <div className="relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4">Notre Processus</h2>
              <p className="text-muted-foreground">Une méthode structurée pour garantir l'excellence de chaque projet.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, i) => (
                <div key={i} className="relative">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm mr-4">
                      {step.number}
                    </div>
                    <div className="h-[1px] flex-grow bg-border hidden lg:block" />
                  </div>
                  <div className="flex items-center space-x-2 mb-3 text-primary">
                    {step.icon}
                    <h3 className="font-serif font-medium text-lg">{step.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA SECTION */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-primary to-secondary text-primary-foreground rounded-[3rem] p-12 md:p-20 relative overflow-hidden text-center"
        >
          <div className="absolute top-0 left-0 w-full h-full opacity-10" />
          <h2 className="text-4xl md:text-5xl font-serif font-medium mb-6 relative z-10">Prêt à transformer votre présence digitale ?</h2>
          <p className="text-primary-foreground/90 max-w-2xl mx-auto mb-10 text-lg relative z-10">
            Rejoignez les centaines de clients qui nous font confiance pour leurs projets digitaux.
          </p>
          <Link href="/studio/contact">
            <Button size="lg" variant="secondary" className="h-16 px-10 text-sm uppercase tracking-widest bg-background text-foreground hover:bg-background/90 relative z-10">
              Demander un devis <ArrowRight className="ml-3 w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
