import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function StudioProcess() {
  const steps = [
    { num: "01", title: "Analyse & Découverte", desc: "Comprendre votre besoin profond et les enjeux de votre marché." },
    { num: "02", title: "Stratégie & Conception", desc: "Architecture de solution sur-mesure et plan d'action détaillé." },
    { num: "03", title: "Réalisation & Itération", desc: "Développement agile avec retours fréquents pour ajustement continu." },
    { num: "04", title: "Déploiement & Formation", desc: "Mise en ligne, tests de qualité et formation à la prise en main." },
    { num: "05", title: "Suivi & Optimisation", desc: "Accompagnement post-lancement pour garantir les performances à long terme." }
  ];

  return (
    <div className="w-full pt-32 pb-20">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-3xl mx-auto text-center mb-24"
        >
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-serif font-medium mb-6">
            Notre <span className="italic text-primary">Processus</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-muted-foreground">
            Une méthodologie rigoureuse pour des résultats d'exception.
          </motion.p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-12">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-8"
            >
              <div className="flex-shrink-0 text-4xl font-serif text-primary/30 font-light italic">
                {step.num}
              </div>
              <div className="pt-2">
                <h3 className="text-2xl font-serif mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}