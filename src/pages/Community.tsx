import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, BookOpen, Users, Zap, MessageSquare, Sparkles, ChevronRight } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { Button } from "@/components/ui/button";

export default function Community() {
  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Articles de Qualité",
      description: "Contenu soigneusement sélectionné pour nourrir votre curiosité et votre développement personnel.",
      color: "primary"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Communauté Engagée",
      description: "Rejoignez des esprits exigeants partageant les mêmes valeurs et ambitions.",
      color: "secondary"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "100% Gratuit",
      description: "Tout le contenu est accessible gratuitement, sans abonnement ni inscription obligatoire.",
      color: "accent"
    }
  ];

  const recentArticles = [
    {
      category: "PSYCHOLOGIE",
      date: "24 février 2026",
      emoji: "🌗",
      title: "L'Ombre et le Leadership : Intégrer sa part obscure pour doubler sa puissance",
      excerpt: "Découvrez comment transformer vos aspects cachés en sources de puissance..."
    },
    {
      category: "MINDSET",
      date: "1 avril 2026",
      emoji: "✨",
      title: "Réapprendre à briller sans s'épuiser",
      excerpt: "Un article inspirant sur comment retrouver votre éclat naturel..."
    },
    {
      category: "SPIRITUALITÉ & SENS",
      date: "25 mars 2026",
      emoji: "🧭",
      title: "Ikigai : Votre boussole pour une vie pleine de sens",
      excerpt: "Découvrez l'Ikigai : la boussole qui vous guidera vers une vie significative..."
    }
  ];

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
        </div>
        
        <div className="container relative z-10 mx-auto px-6 md:px-12 flex flex-col items-center text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            {/* Badge premium */}
            <motion.div variants={fadeUp} className="mb-6 inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-secondary/40 bg-gradient-to-r from-secondary/10 via-accent/5 to-primary/10 backdrop-blur-md hover:border-secondary/70 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/20">
              <Sparkles size={14} className="text-secondary" />
              <span className="text-xs font-medium tracking-widest text-secondary uppercase">Communauté Premium</span>
            </motion.div>
            
            {/* Hero title */}
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold leading-[1.1] mb-8 text-foreground">
              Votre source quotidienne<br className="hidden md:block" />
              de <span className="hero-gradient-text italic font-black">lumière, de savoir</span><br className="hidden md:block" />
              et d'inspiration
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Articles de qualité, formations gratuites et communauté engagée — tout ce qu'il vous faut pour grandir chaque jour.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/academy/articles">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                  <BookOpen size={18} />
                  Découvrir les articles
                </Button>
              </Link>
              
              <Link href="/academy/communaute">
                <Button size="lg" variant="outline" className="gap-2 border-secondary/40 text-secondary hover:bg-secondary/10 hover:border-secondary/70">
                  <Users size={18} />
                  Rejoindre la Communauté
                  <ChevronRight size={16} />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-bl from-accent/10 to-transparent rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl opacity-20" />
        </div>

        <div className="container relative z-10 mx-auto px-6 md:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-serif font-bold mb-6 text-foreground">
              Ce que vous trouverez<br className="hidden md:block" />
              sur la <span className="hero-gradient-text italic">Communauté</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-muted-foreground">
              Du contenu soigneusement sélectionné pour nourrir votre curiosité
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="group relative p-8 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-card-border hover:border-primary/50 transition-all duration-500 overflow-hidden hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${
                    feature.color === "primary" ? "from-primary to-primary/70" :
                    feature.color === "secondary" ? "from-secondary to-secondary/70" :
                    "from-accent to-accent/70"
                  } flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300 text-white`}>
                    {feature.icon}
                  </div>
                  
                  <h3 className="font-serif text-xl font-semibold mb-3 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* RECENT ARTICLES SECTION */}
      <section className="py-32 bg-background/50 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-3xl opacity-30" />
        </div>

        <div className="container relative z-10 mx-auto px-6 md:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-16"
          >
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
              <Zap size={24} className="text-accent" />
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground">
                Derniers articles
              </h2>
            </motion.div>
            <motion.p variants={fadeUp} className="text-lg text-muted-foreground">
              Nos contenus les plus récents pour nourrir votre curiosité
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          >
            {recentArticles.map((article, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="group relative p-6 rounded-xl bg-gradient-to-br from-card to-card/50 border border-card-border hover:border-secondary/50 transition-all duration-500 overflow-hidden hover:shadow-xl hover:shadow-secondary/20 hover:-translate-y-1 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-2xl">{article.emoji}</span>
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                      {article.category}
                    </span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-3">{article.date}</p>
                  
                  <h3 className="font-serif text-lg font-semibold mb-3 text-foreground group-hover:text-secondary transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="text-center"
          >
            <Link href="/academy/articles">
              <Button variant="outline" size="lg" className="gap-2 border-primary/40 text-primary hover:bg-primary/10 hover:border-primary/70">
                Voir tous les articles
                <ArrowRight size={18} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* WHY CHOOSE SECTION */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-primary/10 to-transparent rounded-full blur-3xl opacity-30" />
        </div>

        <div className="container relative z-10 mx-auto px-6 md:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-serif font-bold mb-12 text-foreground">
              Pourquoi choisir la <span className="hero-gradient-text italic">Communauté</span> ?
            </motion.h2>

            <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div variants={fadeUp} className="text-center">
                <div className="text-5xl font-serif font-bold text-accent mb-4">🆓</div>
                <h3 className="text-xl font-serif font-semibold mb-2 text-foreground">100% Gratuit</h3>
                <p className="text-muted-foreground">
                  Tout le contenu est accessible gratuitement, sans abonnement ni inscription obligatoire.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="text-center">
                <div className="text-5xl font-serif font-bold text-primary mb-4">🇫🇷</div>
                <h3 className="text-xl font-serif font-semibold mb-2 text-foreground">En Français</h3>
                <p className="text-muted-foreground">
                  Du contenu de qualité entièrement en français, pour toute la communauté francophone.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="text-center">
                <div className="text-5xl font-serif font-bold text-secondary mb-4">📱</div>
                <h3 className="text-xl font-serif font-semibold mb-2 text-foreground">Accessible Partout</h3>
                <p className="text-muted-foreground">
                  Consultez le contenu sur tous vos appareils, à tout moment et en tout lieu.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="text-center">
                <div className="text-5xl font-serif font-bold text-accent mb-4">∞</div>
                <h3 className="text-xl font-serif font-semibold mb-2 text-foreground">Contenus à Venir</h3>
                <p className="text-muted-foreground">
                  Une plateforme en constante évolution avec de nouveaux contenus régulièrement.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA FINAL SECTION */}
      <section className="py-32 bg-gradient-to-br from-primary/10 via-background to-secondary/10 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl opacity-40" />
        </div>

        <div className="container relative z-10 mx-auto px-6 md:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-serif font-bold mb-6 text-foreground">
              Prêt à rejoindre la <span className="hero-gradient-text italic">Communauté</span> ?
            </motion.h2>
            
            <motion.p variants={fadeUp} className="text-lg text-muted-foreground mb-12">
              Commencez votre voyage de croissance personnelle et intellectuelle dès aujourd'hui.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/academy/articles">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70">
                  <BookOpen size={18} />
                  Explorer les Articles
                </Button>
              </Link>
              
              <Link href="/academy/communaute">
                <Button size="lg" variant="outline" className="gap-2 border-primary/40 text-primary hover:bg-primary/10 hover:border-primary/70">
                  <MessageSquare size={18} />
                  Rejoindre le Forum
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
