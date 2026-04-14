import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { Link } from "wouter";

export default function AcademyArticles() {
  const articles = [
    { title: "Amor Fati : Aimer le destin", slug: "amor-fati" },
    { title: "Antifragilité : prospérer par le désordre", slug: "antifragilite" },
    { title: "Biominétisme : ingénierie de la nature", slug: "biomimetisme" },
    { title: "Chronos vs Kairos : maîtriser le temps", slug: "chronos-kairos" },
    { title: "L'économie de l'attention : l'or moderne", slug: "economie-attention" },
    { title: "État de Flow : la performance sans effort", slug: "etat-flow" },
    { title: "Fatigue mentale et burnout digital", slug: "fatigue-burnout" },
    { title: "Ikigai : la boussole du sens", slug: "ikigai" },
    { title: "Meta-apprentissage : apprendre à apprendre", slug: "meta-apprentissage" },
    { title: "Neuroplasticité dirigée", slug: "neuroplasticite" },
    { title: "Le mythe du multitasking", slug: "multitasking" },
    { title: "Le nerf vague, clé du calme", slug: "nerf-vague" },
    { title: "Éthique algorithmique", slug: "ethique-algo" },
    { title: "Le syndrome de l'imposteur comme allié", slug: "syndrome-imposteur" },
    { title: "Épigénétique : au-delà de l'ADN", slug: "epigenetique" }
  ];

  return (
    <div className="w-full pt-32 pb-20">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-20"
        >
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-serif font-medium mb-6">
            Articles de <span className="italic text-primary">Fond</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-muted-foreground max-w-2xl">
            Explorations intellectuelles pour comprendre le monde et soi-même.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <Link key={i} href={`/academy/articles/${article.slug}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 6) * 0.1 }}
                className="p-6 border border-border/50 rounded-xl bg-card hover:border-primary/50 hover:bg-card/80 transition-all cursor-pointer group h-full hover:shadow-lg hover:shadow-primary/10"
              >
                <h3 className="font-serif text-lg mb-4 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Lecture • 5 min</span>
                  <span className="text-primary group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
