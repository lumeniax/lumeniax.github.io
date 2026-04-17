import { useLocation, Link } from "wouter";
import { ArrowLeft } from "lucide-react";

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
  if (parentPath === "/academy") return "Academy";
  if (parentPath === "/academy/articles") return "Articles";
  if (parentPath === "/academy/formations") return "Formations";
  if (parentPath === "/academy/videos") return "Vidéos";
  if (parentPath === "/academy/communaute") return "Communauté";
  if (parentPath === "/about") return "À propos";
  if (parentPath === "/contact") return "Contact";
  return "Retour";
}

export function BackButton() {
  const [location] = useLocation();
  const parent = getParentPath(location);

  if (!parent) return null;

  const label = getLabel(parent);

  return (
    <div className="fixed top-24 left-4 z-40 md:left-6">
      <Link href={parent}>
        <button
          aria-label={`Retour vers ${label}`}
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-background/70 backdrop-blur-md border border-primary/20 text-foreground/70 hover:text-primary hover:border-primary/50 hover:bg-background/90 transition-all duration-300 shadow-md hover:shadow-primary/20 text-xs font-semibold tracking-wide group"
        >
          <ArrowLeft
            size={14}
            className="transition-transform duration-300 group-hover:-translate-x-0.5"
          />
          <span className="hidden sm:inline">{label}</span>
        </button>
      </Link>
    </div>
  );
}
