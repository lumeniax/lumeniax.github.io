import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  BriefcaseBusiness,
  ChevronRight,
  Command,
  GraduationCap,
  Home,
  Info,
  Mail,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "./SearchBar";

type MobileNavItem = {
  key: string;
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  surfaceClassName: string;
  accentClassName: string;
};

type MobileMenuItem = {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accentClassName: string;
  glowClassName: string;
};

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileNavVisible, setMobileNavVisible] = useState(true);
  const [location] = useLocation();

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      setIsScrolled(currentScrollY > 50);

      if (window.innerWidth < 768) {
        if (mobileMenuOpen || currentScrollY < 80 || delta < 0) {
          setMobileNavVisible(true);
        } else if (delta > 12) {
          setMobileNavVisible(false);
        }
      }

      lastScrollY = currentScrollY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileNavVisible(true);
  }, [location]);

  useEffect(() => {
    if (!mobileMenuOpen || window.innerWidth >= 768) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileMenuOpen]);

  const isHome = location === "/";
  const isStudio = location.startsWith("/studio");
  const isAcademy = location.startsWith("/academy");
  const isContact = location === "/contact";
  const isMoreRoute = location === "/about";
  const activeMobileDockKey = mobileMenuOpen
    ? "plus"
    : isHome
    ? "home"
    : isStudio
    ? "studio"
    : isAcademy
    ? "academy"
    : isContact
    ? "contact"
    : isMoreRoute
    ? "plus"
    : null;

  const mobilePrimaryItems: MobileNavItem[] = [
    {
      key: "home",
      href: "/",
      label: "Accueil",
      icon: Home,
      isActive: activeMobileDockKey === "home",
      surfaceClassName:
        "bg-gradient-to-b from-accent/30 via-accent/14 to-transparent shadow-[0_16px_35px_-22px_rgba(232,185,107,0.95)]",
      accentClassName: "text-accent",
    },
    {
      key: "studio",
      href: "/studio",
      label: "Studio",
      icon: BriefcaseBusiness,
      isActive: activeMobileDockKey === "studio",
      surfaceClassName:
        "bg-gradient-to-b from-primary/28 via-primary/14 to-transparent shadow-[0_16px_35px_-22px_rgba(79,127,255,0.95)]",
      accentClassName: "text-primary",
    },
    {
      key: "academy",
      href: "/academy",
      label: "Academy",
      icon: GraduationCap,
      isActive: activeMobileDockKey === "academy",
      surfaceClassName:
        "bg-gradient-to-b from-secondary/28 via-secondary/14 to-transparent shadow-[0_16px_35px_-22px_rgba(124,92,255,0.95)]",
      accentClassName: "text-secondary",
    },
    {
      key: "contact",
      href: "/contact",
      label: "Contact",
      icon: Mail,
      isActive: activeMobileDockKey === "contact",
      surfaceClassName:
        "bg-gradient-to-b from-primary/20 via-accent/12 to-transparent shadow-[0_16px_35px_-22px_rgba(79,127,255,0.85)]",
      accentClassName: "text-primary",
    },
  ];

  const mobileMenuItems: MobileMenuItem[] = [
    {
      href: "/about",
      title: "À Propos",
      description: "Manifeste, positionnement et philosophie de l'écosystème.",
      icon: Info,
      accentClassName: "text-accent",
      glowClassName:
        "from-accent/18 via-accent/8 to-transparent shadow-[0_18px_40px_-24px_rgba(232,185,107,0.7)]",
    },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || mobileMenuOpen
            ? "bg-background/80 backdrop-blur-xl border-b border-primary/20 py-4 shadow-xl shadow-primary/10"
            : "bg-transparent py-4 md:py-6"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 md:px-12">
          <Link href="/">
            <div className="cursor-pointer group flex items-center gap-3 transition-all duration-500">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <picture className="relative">
                  <source srcSet="/images/logo.webp" type="image/webp" />
                  <img
                    src="/images/logo.png"
                    alt="Lumeniax Logo"
                    className="h-10 w-10 md:h-12 md:w-12 rounded-xl object-cover shadow-2xl transition-transform duration-500 group-hover:scale-110"
                  />
                </picture>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl md:text-2xl font-serif font-bold tracking-tighter bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  LUMENIAX
                </span>
                <span className="text-[9px] md:text-[10px] uppercase tracking-[0.28em] text-accent font-medium -mt-1 opacity-80">
                  Digital Elite
                </span>
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  isHome
                    ? "bg-accent/20 text-accent border border-accent/50 shadow-lg shadow-accent/20"
                    : "text-foreground/70 hover:text-accent hover:bg-accent/10 border border-transparent hover:border-accent/30"
                }`}
              >
                <Home size={18} />
                <span className="text-sm font-semibold tracking-wide">ACCUEIL</span>
              </button>
            </Link>

            <div className="flex items-center space-x-1 group relative">
              <Link href="/studio">
                <span
                  className={`text-sm font-semibold tracking-wide transition-all duration-300 ${
                    isStudio
                      ? "text-primary drop-shadow-lg drop-shadow-primary/50"
                      : "text-foreground/70 hover:text-primary hover:drop-shadow-md"
                  }`}
                >
                  STUDIO
                </span>
              </Link>
              {isStudio && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent rounded-full" />
              )}
            </div>

            <div className="flex items-center space-x-1 group relative">
              <Link href="/academy">
                <span
                  className={`text-sm font-semibold tracking-wide transition-all duration-300 ${
                    isAcademy
                      ? "text-secondary drop-shadow-lg drop-shadow-secondary/50"
                      : "text-foreground/70 hover:text-secondary hover:drop-shadow-md"
                  }`}
                >
                  ACADEMY
                </span>
              </Link>
              {isAcademy && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary to-accent rounded-full" />
              )}
            </div>

            <Link href="/about">
              <span
                className={`text-sm font-semibold tracking-wide transition-all duration-300 ${
                  location === "/about"
                    ? "text-primary drop-shadow-lg"
                    : "text-foreground/70 hover:text-primary hover:drop-shadow-md"
                }`}
              >
                À PROPOS
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <SearchBar />
              <Link href="/contact">
                <Button variant="premium" size="default" className="text-white">
                  CONTACT
                </Button>
              </Link>
            </div>
          </nav>

          <div className="flex items-center gap-3 md:hidden">
            <SearchBar />
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Fermer le menu mobile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-[56] bg-background/60 backdrop-blur-sm md:hidden"
            />

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-4 bottom-[calc(env(safe-area-inset-bottom,0px)+6.35rem)] z-[57] md:hidden"
            >
              <div className="mx-auto max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(124,92,255,0.18),transparent_38%),linear-gradient(180deg,rgba(17,21,31,0.98),rgba(9,12,20,0.98))] p-5 shadow-[0_30px_90px_-34px_rgba(0,0,0,0.95),0_24px_60px_-34px_rgba(79,127,255,0.45)] backdrop-blur-2xl">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-accent/90">
                      <Sparkles size={12} />
                      Navigation
                    </div>
                    <h3 className="font-serif text-2xl text-foreground">
                      Accès <span className="italic text-primary">premium</span>
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Les sections secondaires restent à portée de pouce, sans alourdir le dock principal.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-foreground/75 transition-colors hover:border-primary/40 hover:text-primary"
                    aria-label="Fermer"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="grid gap-3">
                  {mobileMenuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div
                        className={`group relative w-full overflow-hidden rounded-[1.4rem] border border-white/10 bg-gradient-to-r ${item.glowClassName} px-4 py-4 text-left transition-all duration-300 hover:border-white/20 hover:-translate-y-0.5`}
                      >
                        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <div className="relative flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-background/55 backdrop-blur-sm">
                              <item.icon size={18} className={item.accentClassName} />
                            </div>
                            <div>
                              <div className="text-base font-semibold text-foreground">
                                {item.title}
                              </div>
                              <div className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                {item.description}
                              </div>
                            </div>
                          </div>
                          <ChevronRight
                            size={18}
                            className={`shrink-0 transition-transform duration-300 group-hover:translate-x-1 ${item.accentClassName}`}
                          />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.nav
        initial={{ y: 18, opacity: 0 }}
        animate={{
          y: mobileNavVisible ? 0 : 18,
          opacity: mobileNavVisible ? 1 : 0.78,
          scale: mobileNavVisible ? 1 : 0.975,
        }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        className="mobile-nav-dock fixed inset-x-0 bottom-0 z-[58] px-3 md:hidden"
      >
        <div className="mx-auto max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(79,127,255,0.16),transparent_34%),linear-gradient(180deg,rgba(15,19,29,0.92),rgba(9,12,20,0.98))] p-2 shadow-[0_28px_80px_-34px_rgba(0,0,0,0.95),0_22px_60px_-34px_rgba(79,127,255,0.4)] backdrop-blur-2xl">
          <div className="grid grid-cols-5 gap-1">
            {mobilePrimaryItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="group relative flex h-16 w-full flex-col items-center justify-center gap-1 overflow-hidden rounded-[1.2rem] px-2 transition-all duration-300">
                  {item.isActive && (
                    <motion.span
                      layoutId="mobile-dock-active"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className={`absolute inset-0 rounded-[1.2rem] border border-white/10 ${item.surfaceClassName}`}
                    />
                  )}
                  <span className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <item.icon
                    size={18}
                    className={`relative z-10 transition-colors duration-300 ${
                      item.isActive
                        ? item.accentClassName
                        : "text-foreground/48 group-hover:text-foreground/78"
                    }`}
                  />
                  <span
                    className={`relative z-10 text-[0.64rem] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 ${
                      item.isActive
                        ? "text-foreground"
                        : "text-foreground/52 group-hover:text-foreground/75"
                    }`}
                    >
                      {item.label}
                    </span>
                </div>
              </Link>
            ))}

            <button
              type="button"
              onClick={() => setMobileMenuOpen((value) => !value)}
              className="group relative flex h-16 w-full flex-col items-center justify-center gap-1 overflow-hidden rounded-[1.2rem] px-2 transition-all duration-300"
              aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileMenuOpen}
            >
              {activeMobileDockKey === "plus" && (
                <motion.span
                  layoutId="mobile-dock-active"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  className="absolute inset-0 rounded-[1.2rem] border border-white/10 bg-gradient-to-b from-secondary/22 via-accent/10 to-transparent shadow-[0_16px_35px_-22px_rgba(124,92,255,0.9)]"
                />
              )}
              <span className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <Command
                size={18}
                className={`relative z-10 transition-colors duration-300 ${
                  activeMobileDockKey === "plus"
                    ? "text-secondary"
                    : "text-foreground/48 group-hover:text-foreground/78"
                }`}
              />
              <span
                className={`relative z-10 text-[0.64rem] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 ${
                  activeMobileDockKey === "plus"
                    ? "text-foreground"
                    : "text-foreground/52 group-hover:text-foreground/75"
                }`}
              >
                Plus
              </span>
            </button>
          </div>
        </div>
      </motion.nav>
    </>
  );
}
