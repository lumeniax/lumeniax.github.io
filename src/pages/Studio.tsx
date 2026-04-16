import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Quote, ArrowRight, Laptop, PenTool, Bot, GraduationCap, Zap, CheckCircle } from "lucide-react";

export default function Studio() {
  const stats = [
    { value: "150+", label: "Projets livrés" },
    { value: "120+", label: "Clients satisfaits" },
    { value: "95%", label: "Satisfaction client" },
    { value: "10+", label: "Experts en réseau" }
  ];

  const expertise = [
    {
      icon: <Laptop className="w-8 h-8" />,
      title: "Présence Digitale",
      desc: "Sites web responsifs, e-commerce et plateformes conçus pour convertir.",
      color: "text-primary"
    },
    {
      icon: <PenTool className="w-8 h-8" />,
      title: "Contenu & Design",
      desc: "Identité visuelle mémorable et design d'interfaces élégantes.",
      color: "text-secondary"
    },
    {
      icon: <Bot className="w-8 h-8" />,
      title: "IA & Automatisation",
      desc: "Chatbots intelligents et automatisation pour gagner en productivité.",
      color: "text-accent"
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Formation Pratique",
      desc: "Coaching technologique adapté au marché africain et international.",
      color: "text-primary"
    }
  ];

  const testimonials = [
    {
      text: "Notre présence en ligne a été transformée. Chiffre d'affaires triplé en 6 mois.",
      author: "Kofi A.",
      role: "Directeur PME, Togo",
      metric: "+300% ventes"
    },
    {
      text: "Site e-commerce livré en 10 jours, design soigné. Mes clients adorent.",
      author: "Aminata D.",
      role: "Fondatrice Boutique, Bénin",
      metric: "+180 commandes/mois"
    },
    {
      text: "Le chatbot IA répond à mes clients 24h/24. J'économise 15h par semaine.",
      author: "Jean-Claude M.",
      role: "Entrepreneur Tech, Côte d'Ivoire",
      metric: "15h gagnées/semaine"
    }
  ];

  return (
    <div className="w-full pt-24 pb-20 overflow-hidden">
      {/* HERO SECTION */}
      <section className="container mx-auto px-6 md:px-12 mb-32 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary rounded-full blur-[120px]" />
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl"
        >
          <motion.div variants={fadeUp} className="mb-6 inline-flex items-center space-x-2">
            <div className="w-8 h-[1px] bg-primary"></div>
            <span className="text-xs font-medium tracking-widest text-primary uppercase">Lumeniax Studio</span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-5xl md:text-8xl font-serif font-medium leading-[1.05] mb-8 text-foreground">
            L'art de la <span className="italic text-primary">transformation</span> digitale.
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl leading-relaxed">
            Nous concevons des expériences numériques premium, alliant design mémorable et ingénierie de pointe pour propulser votre présence. L'excellence au service de l'Afrique et de sa diaspora.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
            <Link href="/studio/services">
              <Button size="lg" className="h-14 px-8 text-sm uppercase tracking-widest group">
                Nos Services <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/studio/portfolio">
              <Button size="lg" variant="outline" className="border-border h-14 px-8 text-sm uppercase tracking-widest hover:border-primary/50 transition-colors">
                Voir le Portfolio
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* STATS SECTION */}
      <section className="bg-card border-y border-border/50 py-20 relative overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, i) => (
              <motion.div key={i} variants={fadeUp} className="text-center px-4">
                <div className="text-4xl md:text-5xl font-serif text-primary mb-2">{stat.value}</div>
                <div className="text-sm font-medium uppercase tracking-wider text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* EXPERTISE SECTION */}
      <section className="py-32">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-20"
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-serif font-medium mb-6">
              Nos Piliers <span className="italic text-primary">d'Expertise</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground max-w-xl">
              Une approche holistique pour couvrir tous vos besoins numériques avec le plus haut standard de qualité.
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {expertise.map((item, i) => (
              <motion.div key={i} variants={fadeUp} className="p-8 border border-border/50 rounded-2xl bg-card hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 group">
                <div className={`${item.color} mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  {item.icon}
                </div>
                <h3 className="font-serif text-xl mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{item.desc}</p>
                <div className="flex items-center text-xs font-bold text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  En savoir plus <ArrowRight className="ml-2 w-3 h-3" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-card py-32 border-y border-border/50 relative">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-20 text-center max-w-3xl mx-auto"
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-serif font-medium mb-6">
              L'impact en <span className="italic text-primary">chiffres</span> et en mots.
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 border border-border/50 rounded-3xl bg-background/50 relative group hover:border-primary/30 transition-colors"
              >
                <Quote className="absolute top-8 right-8 w-8 h-8 text-primary/10 group-hover:text-primary/20 transition-colors" />
                <div className="mb-8">
                  <span className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full mb-6">
                    <CheckCircle className="w-3 h-3 mr-2" /> {test.metric}
                  </span>
                  <p className="text-lg leading-relaxed font-serif italic text-foreground/90">"{test.text}"</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{test.author}</h4>
                  <p className="text-sm text-muted-foreground">{test.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-32 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-primary text-primary-foreground rounded-[3rem] p-12 md:p-20 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <h2 className="text-4xl md:text-6xl font-serif font-medium mb-8 relative z-10">Prêt à briller dans le <span className="italic opacity-80">digital</span> ?</h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-12 text-lg relative z-10">
            Rejoignez les leaders qui nous font confiance pour leur transformation numérique.
          </p>
          <Link href="/studio/contact">
            <Button size="lg" variant="secondary" className="h-16 px-10 text-sm uppercase tracking-widest bg-background text-foreground hover:bg-background/90 relative z-10">
              Parlons de votre projet <Zap className="ml-3 w-4 h-4 fill-current" />
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
