import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function PolitiqueConfidentialite() {
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
            Politique de <span className="italic text-primary">Confidentialité</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-sm text-muted-foreground">
            Dernière mise à jour : {new Date().getFullYear()}
          </motion.p>
        </motion.div>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-10 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-serif text-foreground mb-3">Collecte de données</h2>
            <p>
              Lumeniax collecte uniquement les données que vous nous fournissez volontairement via les formulaires de contact présents sur ce site (nom, prénom, adresse email, message).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-foreground mb-3">Utilisation des données</h2>
            <p>
              Les données collectées sont utilisées exclusivement pour :
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Répondre à vos demandes de contact</li>
              <li>Vous envoyer des informations relatives à nos services</li>
              <li>Améliorer la qualité de notre service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-serif text-foreground mb-3">Conservation des données</h2>
            <p>
              Vos données personnelles sont conservées le temps nécessaire à la gestion de votre demande, et au maximum pendant 3 ans à compter de notre dernier contact.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-foreground mb-3">Partage de données</h2>
            <p>
              Lumeniax ne vend, n'échange ni ne transfère vos données personnelles à des tiers sans votre consentement explicite, sauf obligation légale.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-foreground mb-3">Cookies</h2>
            <p>
              Ce site n'utilise pas de cookies de traçage tiers. Des cookies techniques essentiels au bon fonctionnement du site peuvent être utilisés.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-foreground mb-3">Vos droits</h2>
            <p>
              Conformément aux réglementations applicables en matière de protection des données, vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition concernant vos données personnelles.
            </p>
            <p className="mt-2">
              Pour exercer ces droits, contactez-nous à :{" "}
              <a href="mailto:contact@lumeniax.com" className="text-primary hover:underline">
                contact@lumeniax.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
