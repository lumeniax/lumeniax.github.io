import { Link } from "wouter";
import { Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gradient-to-t from-card via-background to-background border-t border-primary/20 pt-20 pb-10 relative overflow-hidden">
      {/* Premium gradient overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-gradient-to-tr from-secondary/5 to-transparent rounded-full blur-3xl opacity-20" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <Link href="/">
              <div className="cursor-pointer hover:opacity-90 transition-opacity duration-300 mb-4">
                <picture>
                  <source srcSet="/images/logo.webp" type="image/webp" />
                  <img 
                    src="/images/logo.png" 
                    alt="Lumeniax Logo" 
                    className="h-16 w-auto"
                    width="200"
                    height="64"
                    loading="lazy"
                  />
                </picture>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Écosystème digital premium francophone.
              <br />
              Intelligence sobre, élégance mémorable.
            </p>
          </div>
          
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6 flex items-center text-foreground">
              <span className="w-6 h-[2px] bg-gradient-to-r from-primary to-accent mr-3 rounded-full"></span>
              Studio
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/studio/services">
                  <span className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 cursor-pointer hover:translate-x-1 inline-block">Services & Expertise</span>
                </Link>
              </li>
              <li>
                <Link href="/studio/portfolio">
                  <span className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 cursor-pointer hover:translate-x-1 inline-block">Portfolio Projets</span>
                </Link>
              </li>
              <li>
                <Link href="/studio/process">
                  <span className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 cursor-pointer hover:translate-x-1 inline-block">Notre Processus</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6 flex items-center text-foreground">
              <span className="w-6 h-[2px] bg-gradient-to-r from-secondary to-accent mr-3 rounded-full"></span>
              Academy
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/academy/articles">
                  <span className="text-sm text-muted-foreground hover:text-secondary transition-colors duration-300 cursor-pointer hover:translate-x-1 inline-block">Articles de fond</span>
                </Link>
              </li>
              <li>
                <Link href="/academy/formations">
                  <span className="text-sm text-muted-foreground hover:text-secondary transition-colors duration-300 cursor-pointer hover:translate-x-1 inline-block">Masterclasses et formations</span>
                </Link>
              </li>
              <li>
                <Link href="/academy/communaute">
                  <span className="text-sm text-muted-foreground hover:text-secondary transition-colors duration-300 cursor-pointer hover:translate-x-1 inline-block">Rejoindre la Communauté</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6 flex items-center text-foreground">
              <span className="w-6 h-[2px] bg-gradient-to-r from-accent to-primary mr-3 rounded-full"></span>
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start text-sm text-muted-foreground hover:text-primary transition-colors duration-300 group">
                <Mail size={16} className="mr-3 mt-1 text-primary shrink-0 group-hover:drop-shadow-lg transition-all" />
                <a
                  href="mailto:contact@lumeniax.com"
                  className="hover:text-primary transition-colors duration-300"
                >
                  contact@lumeniax.com
                </a>
              </li>
              <li className="flex items-start text-sm text-muted-foreground group">
                <MapPin size={16} className="mr-3 mt-1 text-accent shrink-0 group-hover:drop-shadow-lg transition-all" />
                <span>Présence : Togo, Bénin, Côte d'Ivoire, Sénégal & Europe</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-primary/20 flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs text-muted-foreground mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Lumeniax. Tous droits réservés.
          </p>
          <div className="flex space-x-6 text-xs text-muted-foreground">
            <Link href="/mentions-legales">
              <span className="hover:text-primary cursor-pointer transition-colors duration-300">Mentions Légales</span>
            </Link>
            <Link href="/politique-confidentialite">
              <span className="hover:text-primary cursor-pointer transition-colors duration-300">Politique de Confidentialité</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
