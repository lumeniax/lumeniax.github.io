import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function StudioServices() {
  const services = [
    {
      title: "Présence Digitale",
      description: "Sites web responsifs, e-commerce, portails & plateformes, maintenance.",
      details: "Nous créons des plateformes robustes, optimisées pour la conversion et l'expérience utilisateur. Chaque ligne de code est pensée pour la performance."
    },
    {
      title: "Contenu & Design",
      description: "Logos & identité visuelle, flyers, montage vidéo, CV optimisés IA.",
      details: "Votre image de marque est votre première poignée de main. Nous la rendons inoubliable."
    },
    {
      title: "Rédaction & Stratégie",
      description: "Business plans, propositions ONG, copywriting, rapports institutionnels.",
      details: "Les mots ont un pouvoir. Nous les agençons pour convaincre, vendre et fédérer."
    },
    {
      title: "IA & Automatisation",
      description: "Chatbots IA, optimisation SEO, automatisation de processus.",
      details: "Gagnez du temps et de l'efficacité en déléguant les tâches répétitives à des systèmes intelligents."
    },
    {
      title: "Formation Pratique",
      description: "Formation IA, coaching entrepreneurial, plans d'affaires adaptés Afrique.",
      details: "Transmettre notre savoir-faire pour vous rendre autonome dans l'écosystème digital."
    }
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
            Nos <span className="italic text-primary">Services</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-muted-foreground max-w-2xl">
            L'expertise pointue au service de vos ambitions.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 gap-12">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 md:p-12 border border-border/50 rounded-2xl bg-card hover:border-primary/30 transition-colors flex flex-col md:flex-row gap-8"
            >
              <div className="md:w-1/3">
                <h2 className="text-2xl font-serif text-primary mb-4">{service.title}</h2>
                <p className="text-sm font-medium tracking-wide uppercase text-muted-foreground">Service {String(index + 1).padStart(2, '0')}</p>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-xl mb-4">{service.description}</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">{service.details}</p>
                <Link href="/studio/contact">
                  <Button variant="outline" className="border-border">En savoir plus</Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}