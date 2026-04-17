import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = location === "/";
  const isStudio = location.startsWith("/studio");
  const isAcademy = location.startsWith("/academy");

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-primary/20 py-4 shadow-xl shadow-primary/10"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/">
          <div className="cursor-pointer hover:opacity-90 transition-opacity duration-300">
            <img 
              src="/images/logo.png" 
              alt="Lumeniax Logo" 
              className="h-12 w-auto"
            />
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {/* Bouton Accueil */}
          <Link href="/">
            <button className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
              isHome 
                ? 'bg-accent/20 text-accent border border-accent/50 shadow-lg shadow-accent/20' 
                : 'text-foreground/70 hover:text-accent hover:bg-accent/10 border border-transparent hover:border-accent/30'
            }`}>
              <Home size={18} />
              <span className="text-sm font-semibold tracking-wide">ACCUEIL</span>
            </button>
          </Link>

          <div className="flex items-center space-x-1 group relative">
            <Link href="/studio">
              <span className={`text-sm font-semibold tracking-wide transition-all duration-300 ${isStudio ? 'text-primary drop-shadow-lg drop-shadow-primary/50' : 'text-foreground/70 hover:text-primary hover:drop-shadow-md'}`}>
                STUDIO
              </span>
            </Link>
            {isStudio && <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent rounded-full" />}
          </div>
          
          <div className="flex items-center space-x-1 group relative">
            <Link href="/academy">
              <span className={`text-sm font-semibold tracking-wide transition-all duration-300 ${isAcademy ? 'text-secondary drop-shadow-lg drop-shadow-secondary/50' : 'text-foreground/70 hover:text-secondary hover:drop-shadow-md'}`}>
                ACADEMY
              </span>
            </Link>
            {isAcademy && <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary to-accent rounded-full" />}
          </div>

          <Link href="/about">
            <span className={`text-sm font-semibold tracking-wide transition-all duration-300 ${location === '/about' ? 'text-primary drop-shadow-lg' : 'text-foreground/70 hover:text-primary hover:drop-shadow-md'}`}>
              À PROPOS
            </span>
          </Link>
          
          <Link href="/contact">
            <Button variant="premium" size="default" className="text-white">
              CONTACT
            </Button>
          </Link>
        </nav>

        <button
          className="md:hidden text-foreground hover:text-primary transition-colors duration-300"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-primary/20 p-6 shadow-2xl shadow-primary/10 md:hidden flex flex-col space-y-4"
          >
            {/* Bouton Accueil mobile */}
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <button className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all duration-300 ${
                isHome
                  ? 'bg-accent/20 border-accent/50 shadow-lg shadow-accent/20'
                  : 'bg-gradient-to-r from-accent/10 to-transparent border-accent/30 hover:border-accent/60 hover:shadow-lg hover:shadow-accent/20'
              }`}>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-accent flex items-center gap-2">
                    <Home size={18} />
                    Accueil
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">Retour à la page principale</p>
                </div>
                <ChevronRight size={18} className="text-accent/70" />
              </button>
            </Link>

            <Link href="/studio" onClick={() => setMobileMenuOpen(false)}>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/15 to-transparent rounded-lg border border-primary/30 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-primary">Studio</h3>
                  <p className="text-xs text-muted-foreground mt-1">Agence de transformation digitale</p>
                </div>
                <ChevronRight size={18} className="text-primary/70 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            
            <Link href="/academy" onClick={() => setMobileMenuOpen(false)}>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-secondary/15 to-transparent rounded-lg border border-secondary/30 hover:border-secondary/60 hover:shadow-lg hover:shadow-secondary/20 transition-all duration-300">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-secondary">Academy</h3>
                  <p className="text-xs text-muted-foreground mt-1">Plateforme éditoriale et formations</p>
                </div>
                <ChevronRight size={18} className="text-secondary/70 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link href="/about" onClick={() => setMobileMenuOpen(false)}>
              <span className="block py-2 text-sm font-semibold hover:text-primary transition-colors duration-300">À PROPOS</span>
            </Link>
            
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="premium" className="w-full mt-4 text-white">NOUS CONTACTER</Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
