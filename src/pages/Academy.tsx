import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { BookOpen, PlayCircle, Users, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Academy() {
  return (
    <div className="w-full pt-24 pb-20">
      <section className="container mx-auto px-6 md:px-12 mb-32">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl"
        >
          <motion.div variants={fadeUp} className="mb-6 inline-flex items-center space-x-2">
            <div className="w-8 h-[1px] bg-primary"></div>
            <span className="text-xs font-medium tracking-widest text-primary uppercase">Lumeniax Academy</span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-serif font-medium leading-[1.1] mb-8 text-foreground">
            Élever l'<span className="italic text-primary">esprit</span>.
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-muted-foreground mb-12 max-w-2xl leading-relaxed">
            Une plateforme éditoriale et de formation dédiée à la croissance personnelle, professionnelle et intellectuelle.
          </motion.p>
          <motion.div variants={fadeUp} className="flex gap-4">
            <Link href="/academy/articles">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Lire nos articles <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <section className="bg-card py-32 border-y border-border/50">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <Link href="/academy/articles">
              <motion.div variants={fadeUp} className="cursor-pointer p-8 h-full border border-border/50 rounded-xl bg-background/50 hover:border-primary/50 transition-all group">
                <BookOpen className="w-8 h-8 text-primary mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="font-serif text-xl mb-3">Articles de Fond</h3>
                <p className="text-sm text-muted-foreground">Plus de 40 publications sur le développement personnel, l'attention et la philosophie.</p>
              </motion.div>
            </Link>
            
            <Link href="/academy/formations">
              <motion.div variants={fadeUp} className="cursor-pointer p-8 h-full border border-border/50 rounded-xl bg-background/50 hover:border-primary/50 transition-all group">
                <PlayCircle className="w-8 h-8 text-primary mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="font-serif text-xl mb-3">Formations & Vidéos</h3>
                <p className="text-sm text-muted-foreground">Masterclasses sur le focus, l'intelligence émotionnelle et la productivité.</p>
              </motion.div>
            </Link>

            <Link href="/academy/communaute">
              <motion.div variants={fadeUp} className="cursor-pointer p-8 h-full border border-border/50 rounded-xl bg-background/50 hover:border-primary/50 transition-all group">
                <Users className="w-8 h-8 text-primary mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="font-serif text-xl mb-3">Communauté</h3>
                <p className="text-sm text-muted-foreground">Un espace d'échange pour les esprits exigeants partageant les mêmes valeurs.</p>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}