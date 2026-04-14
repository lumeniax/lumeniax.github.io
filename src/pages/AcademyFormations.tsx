import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function AcademyFormations() {
  const formations = [
    { title: "Introduction au développement personnel", duration: "4 Semaines", level: "Débutant", slug: "dev-personnel" },
    { title: "Maîtrise de l'attention et du focus", duration: "6 Semaines", level: "Intermédiaire", slug: "attention-focus" },
    { title: "Intelligence émotionnelle avancée", duration: "8 Semaines", level: "Avancé", slug: "intelligence-emotionnelle" },
    { title: "Productivité systémique", duration: "4 Semaines", level: "Intermédiaire", slug: "productivite-systemique" }
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
            Nos <span className="italic text-primary">Formations</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-muted-foreground max-w-2xl">
            Programmes intensifs pour maîtriser les outils de l'esprit.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {formations.map((form, i) => (
            <Link key={i} href={`/academy/formations/${form.slug}`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="p-8 md:p-12 border border-border/50 rounded-2xl bg-card hover:border-primary/50 transition-all flex flex-col justify-between h-full cursor-pointer group hover:shadow-lg hover:shadow-primary/10 hover:bg-card/80"
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-medium text-primary uppercase tracking-wider px-3 py-1 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                      {form.level}
                    </span>
                    <span className="text-sm text-muted-foreground">{form.duration}</span>
                  </div>
                  <h3 className="text-2xl font-serif mb-4 group-hover:text-primary transition-colors">
                    {form.title}
                  </h3>
                </div>
                <div className="mt-8 flex items-center gap-2 text-sm font-medium tracking-wide text-primary group-hover:translate-x-1 transition-transform">
                  <span>Découvrir le programme</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
