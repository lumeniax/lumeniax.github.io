import { motion } from "framer-motion";
import { fadeUp, staggerContainer, scaleUp } from "@/lib/animations";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Quote, ArrowRight, Laptop, Code, PenTool, Bot, GraduationCap } from "lucide-react";

export default function Studio() {
  const stats = [
    { value: "150+", label: "Projets livrés" },
    { value: "120+", label: "Clients satisfaits" },
    { value: "95%", label: "Satisfaction client" },
    { value: "10+", label: "Experts en réseau" }
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
    <div className="w-full pt-24 pb-20">
      <section className="container mx-auto px-6 md:px-12 mb-32 relative">
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
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-serif font-medium leading-[1.1] mb-8 text-foreground">
            L'art de la <span className="italic text-primary">transformation</span> digitale.
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-muted-foreground mb-12 max-w-2xl leading-relaxed">
            Nous concevons des expériences numériques premium, alliant design mémorable et ingénierie de pointe pour propulser votre présence. L'excellence au service de l'Afrique francophone et de sa diaspora.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
            <Link href="/studio/services">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8 text-sm uppercase tracking-widest">
                Nos Services <ArrowRight className="ml-3 w-4 h-4" />
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

      {/* Stats Section */}
      <section className="bg-card border-y border-border/50 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-secondary/5 mix-blend-multiply" />
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border/50"
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

      {/* Expertise Section */}
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
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <motion.div variants={fadeUp} className="p-8 border border-border/50 rounded-xl bg-card hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 group">
              <Laptop className="w-8 h-8 text-primary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-serif text-xl mb-3">Présence Digitale</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Sites web responsifs, e-commerce, portails & plateformes conçus pour convertir.</p>
            </motion.div>
            <motion.div variants={fadeUp} className="p-8 border border-border/50 rounded-xl bg-card hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 group">
              <PenTool className="w-8 h-8 text-primary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-serif text-xl mb-3">Contenu & Design</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Identité visuelle mémorable, design d'interfaces élégantes et supports de communication.</p>
            </motion.div>
            <motion.div variants={fadeUp} className="p-8 border border-border/50 rounded-xl bg-card hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 group">
              <Bot className="w-8 h-8 text-primary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-serif text-xl mb-3">IA & Automatisation</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Chatbots intelligents et automatisation de processus pour gagner en productivité.</p>
            </motion.div>
            <motion.div variants={fadeUp} className="p-8 border border-border/50 rounded-xl bg-card hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 group">
              <GraduationCap className="w-8 h-8 text-primary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-serif text-xl mb-3">Formation Pratique</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Coaching technologique et accompagnement entrepreneurial adapté au marché africain.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-card py-32 border-y border-border/50">
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
                className="p-8 border border-border/50 rounded-2xl bg-background/50 relative"
              >
                <Quote className="absolute top-8 right-8 w-8 h-8 text-primary/20" />
                <div className="mb-8">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest rounded-full mb-6">
                    {test.metric}
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
    </div>
  );
}