import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Home, Laptop, GraduationCap, Info, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
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

  const mobileNavItems = [
    { href: "/", label: "Accueil", icon: Home, active: isHome },
    { href: "/studio", label: "Studio", icon: Laptop, active: isStudio },
    { href: "/academy", label: "Academy", icon: GraduationCap, active: isAcademy },
    { href: "/about", label: "À propos", icon: Info, active: location === "/about" },
    { href: "/contact", label: "Contact", icon: Mail, active: location === "/contact" },
  ];

  return (
    <>
      {/* ── TOP NAVBAR (desktop + mobile logo) ── */}
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

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-1 group relative">
              <Link href="/">
                <span className={`text-sm font-semibold tracking-wide transition-all duration-300 flex items-center gap-1 ${isHome ? "text-primary drop-shadow-lg drop-shadow-primary/50" : "text-foreground/70 hover:text-primary hover:drop-shadow-md"}`}>
                  <Home size={13} />
                  ACCUEIL
                </span>
              </Link>
              {isHome && <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent rounded-full" />}
            </div>

            <div className="flex items-center space-x-1 group relative">
              <Link href="/studio">
                <span className={`text-sm font-semibold tracking-wide transition-all duration-300 ${isStudio ? "text-primary drop-shadow-lg drop-shadow-primary/50" : "text-foreground/70 hover:text-primary hover:drop-shadow-md"}`}>
                  STUDIO
                </span>
              </Link>
              {isStudio && <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent rounded-full" />}
            </div>

            <div className="flex items-center space-x-1 group relative">
              <Link href="/academy">
                <span className={`text-sm font-semibold tracking-wide transition-all duration-300 ${isAcademy ? "text-secondary drop-shadow-lg drop-shadow-secondary/50" : "text-foreground/70 hover:text-secondary hover:drop-shadow-md"}`}>
                  ACADEMY
                </span>
              </Link>
              {isAcademy && <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary to-accent rounded-full" />}
            </div>

            <Link href="/about">
              <span className={`text-sm font-semibold tracking-wide transition-all duration-300 ${location === "/about" ? "text-primary drop-shadow-lg" : "text-foreground/70 hover:text-primary hover:drop-shadow-md"}`}>
                À PROPOS
              </span>
            </Link>

            <Link href="/contact">
              <Button variant="premium" size="default" className="text-white">
                CONTACT
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* ── BOTTOM NAV BAR (mobile only) ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/90 backdrop-blur-xl border-t border-primary/20 shadow-2xl shadow-primary/10">
        <div className="flex items-stretch">
          {mobileNavItems.map(({ href, label, icon: Icon, active }) => (
            <Link key={href} href={href} className="flex-1">
              <motion.div
                whileTap={{ scale: 0.92 }}
                className={`flex flex-col items-center justify-center gap-1 py-2.5 px-1 cursor-pointer transition-all duration-300 ${
                  active ? "text-primary" : "text-foreground/50 hover:text-foreground/80"
                }`}
              >
                <div className="relative flex items-center justify-center">
                  {active && (
                    <motion.div
                      layoutId="mobile-nav-pill"
                      className="absolute inset-0 -m-1.5 rounded-full bg-primary/15"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon
                    size={20}
                    strokeWidth={active ? 2.2 : 1.8}
                    className="relative z-10"
                  />
                </div>
                <span
                  className={`text-[10px] font-semibold tracking-wide leading-none ${
                    active ? "text-primary" : "text-foreground/50"
                  }`}
                >
                  {label}
                </span>
                {active && (
                  <motion.div
                    layoutId="mobile-nav-dot"
                    className="w-1 h-1 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.div>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
