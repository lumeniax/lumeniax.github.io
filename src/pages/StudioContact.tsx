import { useState } from "react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { Mail, MapPin, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StudioContact() {
  const [submitted, setSubmitted] = useState(false);
  const [fields, setFields] = useState({
    nom: "",
    email: "",
    projet: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { nom, email, projet } = fields;
    const body = `Nom: ${nom}%0AEmail: ${email}%0A%0AProjet:%0A${encodeURIComponent(projet)}`;
    window.location.href = `mailto:studio@lumeniax.com?subject=${encodeURIComponent("Nouveau projet Studio")}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <div className="w-full pt-32 pb-20">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-3xl mx-auto text-center mb-20"
        >
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-serif font-medium mb-6">
            Contactez le <span className="italic text-primary">Studio</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-muted-foreground">
            Discutons de votre projet de transformation digitale.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl font-serif mb-8">Informations</h2>
            <div className="space-y-8">
              <div className="flex items-start">
                <Mail className="w-6 h-6 text-primary mr-4 mt-1" />
                <div>
                  <h4 className="font-medium mb-1">Email</h4>
                  <a
                    href="mailto:studio@lumeniax.com"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    studio@lumeniax.com
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="w-6 h-6 text-primary mr-4 mt-1" />
                <div>
                  <h4 className="font-medium mb-1">Présence</h4>
                  <p className="text-muted-foreground">Togo, Bénin, Côte d'Ivoire, Sénégal et Europe.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="p-8 border border-border/50 rounded-2xl bg-card"
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center space-y-4">
                <CheckCircle className="w-12 h-12 text-primary" />
                <h3 className="text-xl font-serif">Demande envoyée !</h3>
                <p className="text-muted-foreground text-sm">
                  Votre client email s'est ouvert avec votre message pré-rempli. Nous reviendrons vers vous rapidement.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-sm text-primary hover:underline mt-4"
                >
                  Envoyer une autre demande
                </button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="studio-nom" className="block text-sm font-medium mb-2 text-muted-foreground">
                    Nom complet
                  </label>
                  <input
                    id="studio-nom"
                    name="nom"
                    type="text"
                    required
                    placeholder="Jean Dupont"
                    value={fields.nom}
                    onChange={handleChange}
                    className="w-full p-4 bg-background border border-border/50 rounded-lg focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="studio-email" className="block text-sm font-medium mb-2 text-muted-foreground">
                    Email
                  </label>
                  <input
                    id="studio-email"
                    name="email"
                    type="email"
                    required
                    placeholder="jean@entreprise.com"
                    value={fields.email}
                    onChange={handleChange}
                    className="w-full p-4 bg-background border border-border/50 rounded-lg focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="studio-projet" className="block text-sm font-medium mb-2 text-muted-foreground">
                    Votre projet
                  </label>
                  <textarea
                    id="studio-projet"
                    name="projet"
                    rows={4}
                    required
                    placeholder="Décrivez brièvement vos besoins..."
                    value={fields.projet}
                    onChange={handleChange}
                    className="w-full p-4 bg-background border border-border/50 rounded-lg focus:outline-none focus:border-primary transition-colors resize-none"
                  ></textarea>
                </div>
                <Button type="submit" className="w-full h-12 text-lg">Envoyer la demande</Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
