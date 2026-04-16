import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Laptop, PenTool, Bot, GraduationCap, Zap, Search, Lightbulb, Settings, HeartHandshake } from "lucide-react";

export default function StudioServices() {
  const serviceCategories = [
    {
      id: 'presence',
      title: 'Présence Digitale',
      icon: <Laptop className="w-8 h-8" />,
      tagline: 'Soyez visible là où sont vos clients',
      description: 'Sites web modernes, rapides et optimisés pour convertir vos visiteurs en clients.',
      problem: 'Invisible en ligne',
      result: 'Visibilité 24h/24 et crédibilité renforcée',
      color: 'border-primary/50',
      bgColor: 'bg-primary/5',
      services: ['Sites web responsifs et modernes', 'E-commerce & boutiques en ligne', 'Portails & plateformes web', 'Maintenance & optimisation']
    },
    {
      id: 'contenu',
      title: 'Contenu & Design',
      icon: <PenTool className="w-8 h-8" />,
      tagline: 'Une image qui inspire confiance',
      description: 'Du logo au montage vidéo, nous créons les supports qui racontent votre histoire avec impact.',
      problem: 'Communication sans impact visuel',
      result: 'Marque forte qui convertit',
      color: 'border-secondary/50',
      bgColor: 'bg-secondary/5',
      services: ['Logos & identité visuelle', 'Flyers, brochures et bannières', 'Montage vidéo professionnel', 'CV & portfolios optimisés']
    },
    {
      id: 'ia',
      title: 'IA & Automatisation',
      icon: <Bot className="w-8 h-8" />,
      tagline: 'Automatisez, surpassez vos concurrents',
      description: 'Chatbots, SEO et automatisation pour plus de temps et plus de prospects qualifiés.',
      problem: 'Processus lents, absence de SEO',
      result: 'Gain de temps et meilleur ROI',
      color: 'border-accent/50',
      bgColor: 'bg-accent/5',
      services: ['Chatbots IA intelligents', 'Optimisation SEO avancée', 'Automatisation des processus', 'Consulting en outils IA']
    },
    {
      id: 'formation',
      title: 'Formation & Accompagnement',
      icon: <GraduationCap className="w-8 h-8" />,
      tagline: 'Montez en compétences',
      description: 'Formations pratiques en IA, marketing digital et entrepreneuriat pour les réalités africaines.',
      problem: 'Équipes non autonomes sur le digital',
      result: 'Compétences opérationnelles acquises',
      color: 'border-primary/50',
      bgColor: 'bg-primary/5',
      services: ['Formation IA pratique', 'Cours marketing digital', 'Mentorat professionnel', 'Coaching entrepreneurial']
    }
  ];

  const processSteps = [
    { number: '01', icon: <Search className="w-5 h-5" />, title: 'Analyse', description: 'Consultation gratuite pour comprendre vos objectifs.' },
    { number: '02', icon: <Lightbulb className="w-5 h-5" />, title: 'Proposition', description: 'Devis détaillé et planning clair.' },
    { number: '03', icon: <Settings className="w-5 h-5" />, title: 'Réalisation', description: 'Nos experts exécutent votre projet.' },
    { number: '04', icon: <HeartHandshake className="w-5 h-5" />, title: 'Livraison', description: 'Ajustements, validation et support.' }
  ];

  return (
    <div className="w-full pt-32 pb-20 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        {/* HERO SECTION */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-24 text-center max-w-3xl mx-auto"
        >
          <motion.div variants={fadeUp} className="mb-6 inline-flex items-center space-x-2">
            <div className="w-8 h-[1px] bg-primary"></div>
            <span className="text-xs font-medium tracking-widest text-primary uppercase">Expertise & Solutions</span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-serif font-medium mb-8 leading-tight">
            Nos <span className="italic text-primary">Services</span> Premium
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-muted-foreground leading-relaxed">
            Nous combinons créativité et technologie pour offrir des solutions digitales qui propulsent votre croissance en Afrique et au-delà.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/studio/contact">
              <Button size="lg" className="h-12 px-8 text-sm uppercase tracking-widest">
                Démarrer un projet <Zap className="ml-2 w-4 h-4 fill-current" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* SERVICES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
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
              
              <div className="grid grid-cols-1 gap-3 mb-8">
                {cat.services.map((s, i) => (
                  <div key={i} className="flex items-center text-sm text-foreground/80">
                    <CheckCircle className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
                    {s}
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-border/50 flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-muted-foreground block uppercase tracking-tighter">Résultat attendu</span>
                  <span className="font-medium text-foreground">{cat.result}</span>
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

        {/* PROCESS SECTION */}
        <div className="bg-card border border-border/50 rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          
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
      </div>
    </div>
  );
}
