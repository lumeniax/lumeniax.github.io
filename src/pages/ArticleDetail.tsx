import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const articlesData: Record<string, { title: string; content: string; readTime: number }> = {
  "amor-fati": {
    title: "Amor Fati : Aimer le destin",
    readTime: 5,
    content: `Amor Fati, la philosophie stoïcienne de l'amour du destin, nous enseigne à embrasser la vie telle qu'elle se présente, sans résistance ni regret.

Cette philosophie ancienne, popularisée par Nietzsche, nous invite à transformer notre relation aux événements. Au lieu de combattre ce qui ne peut être changé, nous apprenons à voir chaque obstacle comme une opportunité de croissance.

L'essence d'Amor Fati réside dans l'acceptation active. Ce n'est pas de la résignation passive, mais plutôt une affirmation consciente de la vie dans toute sa complexité. Lorsque nous embrassons notre destin, nous libérons l'énergie mentale autrefois consacrée à la résistance et la regret.

Les pratiquants d'Amor Fati rapportent une résilience accrue, une meilleure santé mentale et une satisfaction de vie plus profonde. En acceptant ce qui est, nous gagnons le pouvoir de façonner ce qui sera.

Commencez dès aujourd'hui : identifiez une situation difficile de votre vie. Au lieu de la combattre, demandez-vous : "Comment puis-je transformer cela en une force ?" Cette simple question peut révolutionner votre perspective.`
  },
  "antifragilite": {
    title: "Antifragilité : prospérer par le désordre",
    readTime: 5,
    content: `L'antifragilité, concept développé par Nassim Taleb, va au-delà de la résilience. Tandis que la résilience signifie revenir à l'état initial après un choc, l'antifragilité signifie s'améliorer et se renforcer grâce aux perturbations.

Les systèmes antifragiles tirent profit de la volatilité et du chaos. Pensez à votre système immunitaire : il se renforce à travers l'exposition aux pathogènes. De même, nos muscles se développent par le stress de l'exercice.

Dans un monde d'incertitude croissante, cultiver l'antifragilité est devenu essentiel. Cela signifie :
- Accepter les petits échecs comme des apprentissages
- Construire de la redondance dans vos systèmes
- Chercher la variation plutôt que l'uniformité
- Prendre des risques asymétriques (petites pertes, grands gains potentiels)

Les organisations antifragiles survivent non seulement aux crises, elles en émergent plus fortes. Comment pouvez-vous rendre votre vie, votre entreprise ou votre équipe antifragile ?`
  },
  "biomimetisme": {
    title: "Biominétisme : ingénierie de la nature",
    readTime: 5,
    content: `La nature est le plus grand ingénieur et designer que nous connaissions. Le biominétisme, l'art d'imiter les stratégies de la nature, offre des solutions innovantes aux défis humains.

Des structures de nid d'abeille aux algorithmes inspirés par les colonies de fourmis, la nature nous montre comment résoudre les problèmes de manière efficace et élégante. Le Velcro a été inspiré par les graines de bardane. Les avions furtifs s'inspirent des hiboux.

Cette approche révolutionne l'innovation en trois niveaux :
- Niveau biologique : imiter les formes et processus naturels
- Niveau écologique : imiter les stratégies et systèmes
- Niveau évolutif : imiter l'évolution elle-même

En adoptant le biominétisme, nous créons des solutions plus durables, efficaces et harmonieuses avec notre environnement. C'est une philosophie de design qui reconnaît que nous ne sommes pas séparés de la nature, mais en faisons partie.`
  },
  "chronos-kairos": {
    title: "Chronos vs Kairos : maîtriser le temps",
    readTime: 5,
    content: `Les Grecs anciens distinguaient deux concepts du temps : Chronos et Kairos. Comprendre cette distinction transforme notre relation au temps.

Chronos est le temps linéaire, mesurable, quantitatif. C'est les heures, les minutes, les secondes. C'est le temps du calendrier et de la montre. Kairos, en revanche, est le temps qualitatif, le moment opportun, l'instant présent chargé de sens.

Nous vivons dans une culture obsédée par Chronos. Nous comptons les heures, optimisons les minutes, nous stressons de ne jamais en avoir assez. Mais la vraie vie se vit en Kairos - dans les moments de connexion, de création, de transformation.

La maîtrise du temps réside dans l'équilibre :
- Respecter Chronos pour la structure et la discipline
- Honorer Kairos pour le sens et la profondeur
- Reconnaître que certains moments ne peuvent pas être précipités
- Cultiver la présence pour saisir les opportunités

Demandez-vous : passez-vous votre vie à compter les heures ou à vivre les moments ?`
  },
  "economie-attention": {
    title: "L'économie de l'attention : l'or moderne",
    readTime: 5,
    content: `Dans le 21e siècle, l'attention est devenue la ressource la plus précieuse. Les mégacorporations se battent pour chaque seconde de votre attention, car c'est ce qui génère les revenus publicitaires.

L'économie de l'attention fonctionne selon une logique simple : votre attention est monétisée. Les réseaux sociaux, les applications, les sites web - tous sont conçus pour maximiser le temps que vous y passez. Chaque notification, chaque algorithme, chaque couleur est optimisée pour vous garder engagé.

Mais il y a un coût caché. L'attention fragmentée mène à :
- Une productivité réduite
- Une créativité diminuée
- Une santé mentale compromise
- Une vie moins intentionnelle

Reprendre le contrôle de votre attention est un acte de rébellion. Cela signifie :
- Désactiver les notifications
- Créer des zones sans technologie
- Pratiquer la concentration profonde
- Être intentionnel avec votre temps

Votre attention est votre vie. Protégez-la jalousement.`
  },
  "etat-flow": {
    title: "État de Flow : la performance sans effort",
    readTime: 5,
    content: `L'état de flow, décrit par Mihaly Csikszentmihalyi, est cet état de concentration totale où le temps disparaît et la performance s'élève naturellement.

Avez-vous déjà perdu la notion du temps en travaillant sur quelque chose que vous aimiez ? C'était le flow. C'est l'état où le défi rencontre exactement votre niveau de compétence, créant une absorption totale.

Les caractéristiques du flow :
- Concentration complète sur la tâche
- Fusion de l'action et de la conscience
- Perte de la conscience de soi
- Sens du contrôle sur l'activité
- Temps qui passe inaperçu
- Expérience intrinsèquement gratifiante

Pour cultiver le flow dans votre vie :
- Choisissez des activités avec des objectifs clairs
- Assurez-vous que le défi correspond à votre niveau
- Minimisez les distractions
- Créez un environnement propice
- Pratiquez régulièrement

Le flow n'est pas une destination, c'est un chemin. Plus vous le pratiquez, plus il devient naturel.`
  }
};

export default function ArticleDetail() {
  const params = useParams<{ slug: string }>();
  const article = articlesData[params.slug || ""];

  if (!article) {
    return (
      <div className="w-full pt-32 pb-20">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h1 className="text-4xl font-serif mb-4">Article non trouvé</h1>
          <p className="text-muted-foreground mb-8">Désolé, cet article n'existe pas.</p>
          <Link href="/academy/articles">
            <Button>Retour aux articles</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pt-32 pb-20">
      <div className="container mx-auto px-6 md:px-12 max-w-3xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <Link href="/academy/articles">
            <motion.button
              variants={fadeUp}
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour aux articles
            </motion.button>
          </Link>

          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-5xl font-serif font-medium mb-4"
          >
            {article.title}
          </motion.h1>

          <motion.div
            variants={fadeUp}
            className="flex items-center gap-4 text-muted-foreground mb-12 pb-8 border-b border-border"
          >
            <span>Lecture • {article.readTime} min</span>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="prose prose-invert max-w-none"
          >
            {article.content.split("\n\n").map((paragraph, index) => (
              <p key={index} className="text-lg leading-relaxed mb-6 text-foreground">
                {paragraph}
              </p>
            ))}
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-16 pt-8 border-t border-border"
          >
            <h3 className="text-xl font-serif mb-4">Articles connexes</h3>
            <Link href="/academy/articles">
              <Button variant="outline">Découvrir d'autres articles</Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
