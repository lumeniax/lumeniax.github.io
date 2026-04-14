import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function About() {
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
            À propos de <span className="italic text-primary">Lumeniax</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-muted-foreground">
            L'excellence francophone, née d'une fusion stratégique.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-serif mb-6 text-primary">La Genèse</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Lumeniax est le fruit de la fusion de deux entités remarquables : MSA Rising Digital, une agence de services digitaux reconnue en Afrique francophone, et Lumenia, une plateforme éditoriale de haute volée.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              En réunissant l'expertise technologique et la profondeur intellectuelle, nous avons créé un écosystème unique. Nous ne construisons pas seulement des sites web ; nous bâtissons des empires digitaux nourris par la connaissance.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="aspect-square bg-card border border-border/50 rounded-2xl flex items-center justify-center p-12"
          >
            <div className="text-center">
              <div className="text-2xl font-serif font-bold tracking-tight mb-4 text-muted-foreground">MSA Rising Digital</div>
              <div className="text-primary my-4">+</div>
              <div className="text-2xl font-serif font-bold tracking-tight text-muted-foreground">Lumenia</div>
              <div className="w-full h-[1px] bg-border my-8"></div>
              <div className="text-4xl font-serif font-bold tracking-tight text-primary">LUMENIAX</div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto p-12 border border-border/50 rounded-2xl bg-card text-center"
        >
          <h2 className="text-3xl font-serif mb-6">Notre Manifeste</h2>
          <p className="text-xl text-muted-foreground leading-relaxed italic font-light">
            "Nous croyons que la technologie sans intelligence est vide, et que l'intelligence sans outil est inaudible. Nous existons pour armer les visionnaires avec le meilleur du digital et le plus profond du savoir."
          </p>
        </motion.div>
      </div>
    </div>
  );
}