import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

const formationsData: Record<string, {
  title: string;
  level: string;
  duration: string;
  description: string;
  objectives: string[];
  modules: string[];
  price: string;
}> = {
  "dev-personnel": {
    title: "Introduction au développement personnel",
    level: "Débutant",
    duration: "4 Semaines",
    description: "Une introduction complète aux principes fondamentaux du développement personnel, conçue pour les débutants qui souhaitent transformer leur vie.",
    objectives: [
      "Comprendre les principes fondamentaux du développement personnel",
      "Identifier vos valeurs et vos objectifs de vie",
      "Développer une mentalité de croissance",
      "Créer un plan d'action personnel",
      "Surmonter les obstacles courants"
    ],
    modules: [
      "Module 1 : Les fondamentaux du changement",
      "Module 2 : Connaissance de soi et introspection",
      "Module 3 : Fixer et atteindre des objectifs",
      "Module 4 : Habitudes et routines transformatrices"
    ],
    price: "99€"
  },
  "attention-focus": {
    title: "Maîtrise de l'attention et du focus",
    level: "Intermédiaire",
    duration: "6 Semaines",
    description: "Apprenez à maîtriser votre attention dans un monde plein de distractions et développez une concentration profonde.",
    objectives: [
      "Comprendre les mécanismes de l'attention",
      "Identifier et éliminer les sources de distraction",
      "Pratiquer la concentration profonde",
      "Optimiser votre environnement de travail",
      "Mesurer et améliorer votre focus"
    ],
    modules: [
      "Module 1 : Neuroscience de l'attention",
      "Module 2 : L'économie de l'attention",
      "Module 3 : Techniques de concentration",
      "Module 4 : Gestion de l'énergie mentale",
      "Module 5 : Productivité profonde",
      "Module 6 : Maintenir le focus long terme"
    ],
    price: "149€"
  },
  "intelligence-emotionnelle": {
    title: "Intelligence émotionnelle avancée",
    level: "Avancé",
    duration: "8 Semaines",
    description: "Maîtrisez vos émotions et développez une intelligence émotionnelle avancée pour améliorer vos relations et votre leadership.",
    objectives: [
      "Comprendre la nature des émotions",
      "Développer l'auto-conscience émotionnelle",
      "Gérer efficacement les émotions difficiles",
      "Améliorer l'empathie et les relations",
      "Devenir un leader émotionnellement intelligent"
    ],
    modules: [
      "Module 1 : Fondamentaux de l'IE",
      "Module 2 : Auto-conscience émotionnelle",
      "Module 3 : Régulation émotionnelle",
      "Module 4 : Motivation intrinsèque",
      "Module 5 : Empathie et connexion",
      "Module 6 : Compétences sociales",
      "Module 7 : Leadership émotionnel",
      "Module 8 : Intégration et maîtrise"
    ],
    price: "199€"
  },
  "productivite-systemique": {
    title: "Productivité systémique",
    level: "Intermédiaire",
    duration: "4 Semaines",
    description: "Construisez des systèmes de productivité durables qui fonctionnent avec votre nature plutôt que contre elle.",
    objectives: [
      "Comprendre les systèmes de productivité",
      "Évaluer votre productivité actuelle",
      "Créer des systèmes adaptés à votre style",
      "Automatiser les tâches répétitives",
      "Mesurer et optimiser continuellement"
    ],
    modules: [
      "Module 1 : Principes de la productivité systémique",
      "Module 2 : Audit de votre productivité",
      "Module 3 : Systèmes et workflows",
      "Module 4 : Outils et automatisation"
    ],
    price: "129€"
  }
};

export default function FormationDetail() {
  const params = useParams<{ slug: string }>();
  const formation = formationsData[params.slug || ""];

  if (!formation) {
    return (
      <div className="w-full pt-32 pb-20">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h1 className="text-4xl font-serif mb-4">Formation non trouvée</h1>
          <p className="text-muted-foreground mb-8">Désolé, cette formation n'existe pas.</p>
          <Link href="/academy/formations">
            <Button>Retour aux formations</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pt-32 pb-20">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <Link href="/academy/formations">
            <motion.button
              variants={fadeUp}
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour aux formations
            </motion.button>
          </Link>

          <motion.div variants={fadeUp} className="mb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-serif font-medium mb-4">
                  {formation.title}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {formation.description}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-serif font-medium text-primary mb-2">
                  {formation.price}
                </div>
                <Button size="lg" className="w-full md:w-auto">
                  S'inscrire maintenant
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 py-8 border-y border-border">
              <div>
                <span className="text-xs font-medium text-muted-foreground uppercase">Niveau</span>
                <p className="text-lg font-serif">{formation.level}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-muted-foreground uppercase">Durée</span>
                <p className="text-lg font-serif">{formation.duration}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-muted-foreground uppercase">Format</span>
                <p className="text-lg font-serif">En ligne</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="mb-16">
            <h2 className="text-3xl font-serif font-medium mb-8">Objectifs d'apprentissage</h2>
            <div className="space-y-4">
              {formation.objectives.map((objective, index) => (
                <div key={index} className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-lg text-foreground">{objective}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="mb-16">
            <h2 className="text-3xl font-serif font-medium mb-8">Contenu du programme</h2>
            <div className="space-y-4">
              {formation.modules.map((module, index) => (
                <div
                  key={index}
                  className="p-6 border border-border/50 rounded-xl bg-card hover:border-primary/30 transition-colors"
                >
                  <p className="font-serif text-lg">{module}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="bg-gradient-to-r from-primary/10 to-secondary/10 p-8 rounded-2xl border border-primary/20 text-center"
          >
            <h3 className="text-2xl font-serif font-medium mb-4">Prêt à commencer ?</h3>
            <p className="text-muted-foreground mb-6">
              Rejoignez des centaines d'apprenants qui transforment leur vie grâce à nos formations.
            </p>
            <Button size="lg" className="w-full md:w-auto">
              S'inscrire à cette formation
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
