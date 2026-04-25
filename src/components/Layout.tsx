import { ReactNode, useEffect } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { BackButton } from "./BackButton";
import { ThemeToggle } from "./ThemeToggle";
import { PWAInstallBanner } from "./PWAInstallBanner";
import { ThemeProvider } from "@/lib/theme";
import { useLocation } from "wouter";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <ThemeProvider>
      <div className="min-h-[100dvh] flex flex-col bg-background text-foreground transition-colors duration-300">
        <Navbar />
        <BackButton />
        <main className="flex-1">{children}</main>
        <Footer />
        <ThemeToggle />
        <PWAInstallBanner />
      </div>
    </ThemeProvider>
  );
}
