import { useLocation, Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";

function getParentPath(pathname: string): string | null {
  if (pathname === "/" || pathname === "") return null;
  const segments = pathname.replace(/\/$/, "").split("/");
  segments.pop();
  const parent = segments.join("/");
  return parent === "" ? "/" : parent;
}

function getLabel(parentPath: string): string {
  if (parentPath === "/") return "Accueil";
  if (parentPath === "/studio") return "Studio";
  if (parentPath === "/studio/services") return "Services";
  if (parentPath === "/studio/portfolio") return "Portfolio";
  if (parentPath === "/studio/process") return "Processus";
  if (parentPath === "/studio/contact") return "Studio";
  if (parentPath === "/academy") return "Academy";
  if (parentPath === "/academy/articles") return "Articles";
  if (parentPath === "/academy/formations") return "Formations";
  if (parentPath === "/academy/videos") return "Vidéos";
  if (parentPath === "/academy/communaute") return "Communauté";
  if (parentPath === "/about") return "À propos";
  if (parentPath === "/contact") return "Contact";
  return "Retour";
}

function getColorClass(parentPath: string): string {
  if (parentPath.startsWith("/studio")) return "hover:text-primary hover:border-primary/50 hover:shadow-primary/20";
  if (parentPath.startsWith("/academy")) return "hover:text-secondary hover:border-secondary/50 hover:shadow-secondary/20";
  if (parentPath === "/about") return "hover:text-accent hover:border-accent/50 hover:shadow-accent/20";
  return "hover:text-primary hover:border-primary/50 hover:shadow-primary/20";
}

export function BackButton() {
  const [location] = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const parent = getParentPath(location);

  // Afficher le bouton après un court délai pour éviter le clignotement
  useEffect(() => {
    setIsVisible(true);
  }, [location]);

  // Détecter le scroll pour ajuster le style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!parent || !isVisible) return null;

  const label = getLabel(parent);
  const colorClass = getColorClass(parent);

  return (
    <div className={`fixed top-24 left-4 z-40 md:left-6 transition-all duration-300 ${isScrolled ? "opacity-100" : "opacity-80 hover:opacity-100"}`}>
      <Link href={parent}>
        <button
          aria-label={`Retour vers ${label}`}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full bg-background/70 backdrop-blur-md border border-primary/20 text-foreground/70 ${colorClass} transition-all duration-300 shadow-md hover:shadow-lg text-xs font-semibold tracking-wide group hover:scale-105 active:scale-95`}
          title={`Retour vers ${label}`}
        >
          <ArrowLeft
            size={14}
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />
          <span className="hidden sm:inline">{label}</span>
        </button>
      </Link>
    </div>
  );
}
