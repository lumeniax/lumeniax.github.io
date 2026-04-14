import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function MentionsLegales() {
  return (
    <div className="w-full pt-32 pb-20">
      <div className="container mx-auto px-6 md:px-12 max-w-3xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-16"
        >
          <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl font-serif font-medium mb-4">
            Mentions <span className="italic text-primary">Légales</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-sm text-muted-foreground">
            Dernière mise à jour : {new Date().getFullYear()}
          </motion.p>
        </motion.div>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-10 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-serif text-foreground mb-3">Éditeur du site</h2>
            <p>
              Le site <strong>lumeniax.com</strong> est édité par <strong>Lumeniax</strong>, résultant de la fusion de MSA Rising Digital et Lumenia.
            </p>
            <p className="mt-2">
              Email de contact :{" "}
              <a href="mailto:contact@lumeniax.com" className="text-primary hover:underline">
                contact@lumeniax.com
              </a>
            </p>
            <p className="mt-2">
              Présence : Togo, Bénin, Côte d'Ivoire, Sénégal et Europe.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-foreground mb-3">Hébergement</h2>
            <p>
              Ce site est hébergé sur GitHub Pages, un service de GitHub, Inc. (88 Colin P Kelly Jr St, San Francisco, CA 94107, États-Unis).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-foreground mb-3">Propriété intellectuelle</h2>
            <p>
              L'ensemble des contenus présents sur ce site (textes, images, graphismes, logotypes) sont la propriété exclusive de Lumeniax, sauf mention contraire. Toute reproduction, distribution ou utilisation sans autorisation préalable est strictement interdite.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-foreground mb-3">Limitation de responsabilité</h2>
            <p>
              Lumeniax s'efforce de fournir des informations exactes et à jour sur ce site. Toutefois, nous ne pouvons garantir l'exactitude, la complétude ou l'actualité des informations diffusées.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-foreground mb-3">Contact</h2>
            <p>
              Pour toute question relative aux mentions légales, contactez-nous à{" "}
              <a href="mailto:contact@lumeniax.com" className="text-primary hover:underline">
                contact@lumeniax.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
