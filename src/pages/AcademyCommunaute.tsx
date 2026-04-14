import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { MessageSquare, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AcademyCommunaute() {
  return (
    <div className="w-full pt-32 pb-20">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center mb-24"
        >
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-serif font-medium mb-6">
            La <span className="italic text-primary">Communauté</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-muted-foreground mb-8">
            Rejoignez un cercle restreint d'esprits exigeants. Échangez, apprenez et grandissez ensemble.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Rejoindre le cercle
            </Button>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 border border-border/50 rounded-2xl bg-card text-center"
          >
            <MessageSquare className="w-10 h-10 text-primary mx-auto mb-6" />
            <h3 className="text-xl font-serif mb-4">Échanges Privés</h3>
            <p className="text-sm text-muted-foreground">Discussions de haut niveau sur la productivité, le stress et l'apprentissage.</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-8 border border-border/50 rounded-2xl bg-card text-center"
          >
            <BookOpen className="w-10 h-10 text-primary mx-auto mb-6" />
            <h3 className="text-xl font-serif mb-4">Club de Lecture</h3>
            <p className="text-sm text-muted-foreground">Analyses et retours d'expérience sur des ouvrages fondamentaux.</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-8 border border-border/50 rounded-2xl bg-card text-center"
          >
            <Users className="w-10 h-10 text-primary mx-auto mb-6" />
            <h3 className="text-xl font-serif mb-4">Réseautage</h3>
            <p className="text-sm text-muted-foreground">Mettez-vous en relation avec des professionnels et entrepreneurs de toute la francophonie.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}