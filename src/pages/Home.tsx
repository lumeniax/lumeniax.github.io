import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, ChevronRight, BookOpen, Laptop, Sparkles, Zap } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section className="relative min-h-[100dvh] flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background z-10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50" />
          <img 
            src="/images/hero-bg.jpg" 
            alt="Lumeniax Abstract Background" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        <div className="container relative z-10 mx-auto px-6 md:px-12 flex flex-col items-center text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeUp} className="mb-6 inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-primary/30 bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm hover:border-primary/50 transition-colors">
              <Zap size={14} className="text-primary" />
              <span className="text-xs font-medium tracking-widest text-primary uppercase">Écosystème Digital Premium</span>
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium leading-[1.1] mb-8 text-foreground">
              L'excellence francophone <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary italic">sans compromis.</span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Une alliance unique entre une agence de transformation digitale d'élite et une plateforme intellectuelle de haut vol.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/studio">
                <div className="group relative w-full sm:w-64 p-6 bg-gradient-to-br from-card to-card/50 border border-primary/20 rounded-xl hover:border-primary/50 transition-all duration-500 cursor-pointer overflow-hidden hover:shadow-lg hover:shadow-primary/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <Laptop className="w-8 h-8 text-primary mb-4" />
                    <h3 className="font-serif text-xl font-medium mb-2">Studio</h3>
                    <p className="text-sm text-muted-foreground mb-4">Transformation, Design & IA</p>
                    <div className="flex items-center text-xs font-medium text-primary uppercase tracking-wider group-hover:translate-x-2 transition-transform duration-300">
                      Découvrir l'agence <ArrowRight size={14} className="ml-2" />
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link href="/academy">
                <div className="group relative w-full sm:w-64 p-6 bg-gradient-to-br from-card to-card/50 border border-secondary/20 rounded-xl hover:border-secondary/50 transition-all duration-500 cursor-pointer overflow-hidden hover:shadow-lg hover:shadow-secondary/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <BookOpen className="w-8 h-8 text-secondary mb-4" />
                    <h3 className="font-serif text-xl font-medium mb-2">Academy</h3>
                    <p className="text-sm text-muted-foreground mb-4">Savoirs, formations et médias</p>
                    <div className="flex items-center text-xs font-medium text-secondary uppercase tracking-wider group-hover:translate-x-2 transition-transform duration-300">
                      Explorer la plateforme <ArrowRight size={14} className="ml-2" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* PHILOSOPHY SECTION */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl opacity-40" />
        </div>
        <div className="container relative z-10 mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-serif font-medium mb-6">
                L'intelligence <span className="italic text-primary">sobre</span>,<br />
                l'élégance mémorable.
              </motion.h2>
              <motion.div variants={fadeUp} className="w-12 h-[2px] bg-gradient-to-r from-primary to-secondary mb-8" />
              <motion.p variants={fadeUp} className="text-muted-foreground text-lg mb-6 leading-relaxed">
                Née de la fusion entre MSA Rising Digital et Lumenia, Lumeniax incarne une vision nouvelle : celle d'un écosystème où la performance technique rencontre la profondeur intellectuelle.
              </motion.p>
              <motion.p variants={fadeUp} className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Nous accompagnons les décideurs, entrepreneurs et esprits exigeants de l'Afrique francophone et de sa diaspora, en offrant des solutions digitales sur-mesure et un accès à des connaissances transformatrices.
              </motion.p>
              <motion.div variants={fadeUp}>
                <Link href="/about">
                  <Button variant="outline" className="group border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                    Notre Manifeste
                    <ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-[600px] rounded-2xl overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 mix-blend-multiply z-10 group-hover:opacity-80 transition-opacity duration-500" />
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" 
                alt="Architecture" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-background via-background/80 to-transparent z-20">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <span className="block text-3xl font-serif text-primary">150+</span>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">Projets livrés</span>
                  </div>
                  <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-secondary opacity-50" />
                  <div className="text-center">
                    <span className="block text-3xl font-serif text-secondary">40+</span>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">Articles publiés</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
