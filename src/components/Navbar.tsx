import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";
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

  const isStudio = location.startsWith("/studio");
  const isAcademy = location.startsWith("/academy");

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-primary/10 py-4 shadow-lg shadow-primary/5"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/">
          <div className="text-2xl font-serif font-bold tracking-tight cursor-pointer hover:text-primary transition-colors">
            LUMENIAX
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <div className="flex items-center space-x-1 group relative">
            <Link href="/studio">
              <span className={`text-sm font-medium tracking-wide transition-colors ${isStudio ? 'text-primary' : 'text-foreground/80 hover:text-primary'}`}>
                STUDIO
              </span>
            </Link>
            {isStudio && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-transparent" />}
          </div>
          
          <div className="flex items-center space-x-1 group relative">
            <Link href="/academy">
              <span className={`text-sm font-medium tracking-wide transition-colors ${isAcademy ? 'text-secondary' : 'text-foreground/80 hover:text-secondary'}`}>
                ACADEMY
              </span>
            </Link>
            {isAcademy && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-secondary to-transparent" />}
          </div>

          <Link href="/about">
            <span className={`text-sm font-medium tracking-wide transition-colors ${location === '/about' ? 'text-primary' : 'text-foreground/80 hover:text-primary'}`}>
              À PROPOS
            </span>
          </Link>
          
          <Link href="/contact">
            <Button className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/30 transition-all text-white border-0">
              CONTACT
            </Button>
          </Link>
        </nav>

        <button
          className="md:hidden text-foreground hover:text-primary transition-colors"
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
            className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-primary/10 p-6 shadow-xl md:hidden flex flex-col space-y-4"
          >
            <Link href="/studio" onClick={() => setMobileMenuOpen(false)}>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-transparent rounded-lg border border-primary/20 hover:border-primary/50 transition-all">
                <div>
                  <h3 className="font-serif text-lg font-medium text-primary">Studio</h3>
                  <p className="text-xs text-muted-foreground mt-1">Agence de transformation digitale</p>
                </div>
                <ChevronRight size={18} className="text-primary/50" />
              </div>
            </Link>
            
            <Link href="/academy" onClick={() => setMobileMenuOpen(false)}>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-secondary/10 to-transparent rounded-lg border border-secondary/20 hover:border-secondary/50 transition-all">
                <div>
                  <h3 className="font-serif text-lg font-medium text-secondary">Academy</h3>
                  <p className="text-xs text-muted-foreground mt-1">Plateforme éditoriale et formations</p>
                </div>
                <ChevronRight size={18} className="text-secondary/50" />
              </div>
            </Link>

            <Link href="/about" onClick={() => setMobileMenuOpen(false)}>
              <span className="block py-2 text-sm font-medium hover:text-primary transition-colors">À PROPOS</span>
            </Link>
            
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full mt-4 bg-gradient-to-r from-primary to-secondary">NOUS CONTACTER</Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
