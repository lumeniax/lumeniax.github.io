import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function StudioPortfolio() {
  const projects = [
    { title: "CV Premium Ingénieur Logiciel", category: "Rédaction & CV", desc: "Design ATS-friendly optimisé IA, 48h." },
    { title: "Business Plan AGR Agricole", category: "Plans d'Affaires", desc: "Analyse de marché, projections financières, 5 jours." },
    { title: "Site Web Institution Religieuse", category: "Création Web", desc: "Responsive, gestion événements, donations." },
    { title: "Chatbot IA PME Commerce", category: "IA & Automatisation", desc: "Réponse 24h/24 clients, intégration WhatsApp." },
    { title: "Identité Visuelle Startup EdTech", category: "Design", desc: "Logo, charte graphique complète, supports." },
    { title: "Projet ONG Proposition", category: "Rédaction", desc: "Dossier de financement accepté, 3 jours." }
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
            Notre <span className="italic text-primary">Portfolio</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-muted-foreground max-w-2xl">
            Découvrez comment nous avons transformé la vision de nos clients en réalité digitale.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative h-80 rounded-xl overflow-hidden bg-card border border-border/50"
            >
              <div className="absolute inset-0 bg-secondary/10 group-hover:bg-secondary/30 transition-colors" />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background to-transparent translate-y-4 group-hover:translate-y-0 transition-transform">
                <span className="text-xs font-medium text-primary uppercase tracking-wider mb-2 block">{project.category}</span>
                <h3 className="font-serif text-xl mb-2">{project.title}</h3>
                <p className="text-sm text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">{project.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}