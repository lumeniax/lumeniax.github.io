import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, ChevronRight, BookOpen, Laptop, Sparkles, Zap } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section className="relative min-h-[100dvh] flex items-center justify-center pt-20 overflow-hidden bg-background">
        <div className="absolute inset-0 z-0">
          {/* Gradient hero background */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background z-10" />
          
          {/* Premium gradient blobs */}
          <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl opacity-40 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-secondary/20 to-transparent rounded-full blur-3xl opacity-40 animate-pulse" />
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-br from-accent/15 to-transparent rounded-full blur-3xl opacity-30" />
          
          {/* Background image */}
          <picture>
            <source srcSet="/images/hero-bg.webp" type="image/webp" />
            <img 
              src="/images/hero-bg.jpg" 
              alt="Lumeniax Abstract Background" 
              className="w-full h-full object-cover opacity-10"
              loading="eager"
              fetchPriority="high"
            />
          </picture>
        </div>
        
        <div className="container relative z-10 mx-auto px-6 md:px-12 flex flex-col items-center text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            {/* Badge premium */}
            <motion.div variants={fadeUp} className="mb-6 inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-primary/40 bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 backdrop-blur-md hover:border-primary/70 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
              <Zap size={14} className="text-primary" />
              <span className="text-xs font-medium tracking-widest text-primary uppercase">Écosystème digital premium</span>
            </motion.div>
            
            {/* Hero title avec gradient */}
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold leading-[1.1] mb-8 text-foreground">
              LUMENIAX, l'excellence <br className="hidden md:block" />
              <span className="hero-gradient-text italic font-black">sans compromis.</span>
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Une alliance unique entre une agence de transformation digitale d'élite et une plateforme intellectuelle de haut vol.
            </motion.p>
            
            {/* CTA Cards */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/studio">
                <div className="group relative w-full sm:w-64 p-6 bg-gradient-to-br from-card to-card/50 border border-primary/30 rounded-xl hover:border-primary/70 transition-all duration-500 cursor-pointer overflow-hidden hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
                      <Laptop className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold mb-2 text-foreground">Studio</h3>
                    <p className="text-sm text-muted-foreground mb-4">Transformation, Design & IA</p>
                    <div className="flex items-center text-xs font-semibold text-primary uppercase tracking-wider group-hover:translate-x-2 transition-transform duration-300">
                      Découvrir l'agence <ArrowRight size={14} className="ml-2" />
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link href="/academy">
                <div className="group relative w-full sm:w-64 p-6 bg-gradient-to-br from-card to-card/50 border border-secondary/30 rounded-xl hover:border-secondary/70 transition-all duration-500 cursor-pointer overflow-hidden hover:shadow-xl hover:shadow-secondary/20 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-secondary/30 transition-all duration-300">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold mb-2 text-foreground">Academy</h3>
                    <p className="text-sm text-muted-foreground mb-4">Savoirs, formations et médias</p>
                    <div className="flex items-center text-xs font-semibold text-secondary uppercase tracking-wider group-hover:translate-x-2 transition-transform duration-300">
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
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-bl from-accent/10 to-transparent rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl opacity-20" />
        </div>
        <div className="container relative z-10 mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-serif font-bold mb-6 text-foreground">
                L'intelligence <span className="hero-gradient-text italic">sobre</span>,<br />
                l'élégance mémorable.
              </motion.h2>
              <motion.div variants={fadeUp} className="w-12 h-1 bg-gradient-to-r from-primary via-accent to-secondary mb-8 rounded-full" />
              <motion.p variants={fadeUp} className="text-muted-foreground text-lg mb-6 leading-relaxed">
                Née de la fusion entre MSA Rising Digital et Lumenia, Lumeniax incarne une vision nouvelle : celle d'un écosystème où la performance technique rencontre la profondeur intellectuelle.
              </motion.p>
              <motion.p variants={fadeUp} className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Nous accompagnons les décideurs, entrepreneurs et esprits exigeants de l'Afrique francophone et de sa diaspora, en offrant des solutions digitales sur-mesure et un accès à des connaissances transformatrices.
              </motion.p>
              <motion.div variants={fadeUp}>
                <Link href="/about">
                  <Button variant="outline" className="group border-primary/40 text-primary hover:bg-primary/10 hover:border-primary/70 transition-all">
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
              <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-accent/15 to-secondary/25 mix-blend-multiply z-10 group-hover:opacity-100 transition-opacity duration-500 opacity-80" />
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" 
                alt="Architecture" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 rounded-2xl border border-primary/20 group-hover:border-primary/50 transition-colors duration-300 z-20" />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-background via-background/90 to-transparent z-30">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <span className="block text-3xl font-serif font-bold text-primary">150+</span>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Projets livrés</span>
                  </div>
                  <div className="w-[2px] h-12 bg-gradient-to-b from-primary via-accent to-secondary opacity-60" />
                  <div className="text-center">
                    <span className="block text-3xl font-serif font-bold text-secondary">40+</span>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Articles publiés</span>
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
