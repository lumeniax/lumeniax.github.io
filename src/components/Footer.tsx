import { Link } from "wouter";
import { Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border/50 pt-20 pb-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <Link href="/">
              <div className="text-2xl font-serif font-bold tracking-tight mb-4 cursor-pointer">
                LUMENIAX
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Écosystème digital premium francophone.
              <br />
              Intelligence sobre, élégance mémorable.
            </p>
          </div>
          
          <div>
            <h4 className="font-serif text-lg font-medium mb-6 flex items-center">
              <span className="w-4 h-[1px] bg-primary mr-3"></span>
              Studio
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/studio/services">
                  <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">Services & Expertise</span>
                </Link>
              </li>
              <li>
                <Link href="/studio/portfolio">
                  <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">Portfolio Projets</span>
                </Link>
              </li>
              <li>
                <Link href="/studio/process">
                  <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">Notre Processus</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-serif text-lg font-medium mb-6 flex items-center">
              <span className="w-4 h-[1px] bg-primary mr-3"></span>
              Academy
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/academy/articles">
                  <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">Articles de Fond</span>
                </Link>
              </li>
              <li>
                <Link href="/academy/formations">
                  <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">Formations Masterclass</span>
                </Link>
              </li>
              <li>
                <Link href="/academy/communaute">
                  <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">Rejoindre la Communauté</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-serif text-lg font-medium mb-6 flex items-center">
              <span className="w-4 h-[1px] bg-primary mr-3"></span>
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start text-sm text-muted-foreground">
                <Mail size={16} className="mr-3 mt-1 text-primary shrink-0" />
                <a
                  href="mailto:contact@lumeniax.com"
                  className="hover:text-primary transition-colors"
                >
                  contact@lumeniax.com
                </a>
              </li>
              <li className="flex items-start text-sm text-muted-foreground">
                <MapPin size={16} className="mr-3 mt-1 text-primary shrink-0" />
                <span>Présence : Togo, Bénin, Côte d'Ivoire, Sénégal & Europe</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs text-muted-foreground mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Lumeniax. Tous droits réservés.
          </p>
          <div className="flex space-x-6 text-xs text-muted-foreground">
            <Link href="/mentions-legales">
              <span className="hover:text-primary cursor-pointer transition-colors">Mentions Légales</span>
            </Link>
            <Link href="/politique-confidentialite">
              <span className="hover:text-primary cursor-pointer transition-colors">Politique de Confidentialité</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
