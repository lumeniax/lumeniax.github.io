import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";

interface Props {
  /** Mode flottant (FAB) ou inline (dans un menu) */
  variant?: "floating" | "inline";
}

export function ThemeToggle({ variant = "floating" }: Props) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [mounted, setMounted] = useState(false);

  // Évite tout flash : monté seulement après hydratation
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const label = isDark ? "Activer le mode jour" : "Activer le mode nuit";

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={label}
        title={label}
        className="relative inline-flex items-center justify-center w-9 h-9 rounded-full border border-border/60 bg-background/60 backdrop-blur hover:border-primary/40 hover:bg-primary/10 transition-all"
      >
        <SunMoonIcon isDark={isDark} />
      </button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, type: "spring", stiffness: 220, damping: 22 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      className="fixed z-[60] bottom-5 right-5 md:bottom-6 md:right-6 group"
    >
      {/* Halo lumineux */}
      <span
        aria-hidden
        className={`absolute inset-0 rounded-full blur-xl opacity-50 transition-opacity duration-500 group-hover:opacity-80 ${
          isDark
            ? "bg-gradient-to-br from-accent/40 to-primary/30"
            : "bg-gradient-to-br from-primary/40 to-accent/30"
        }`}
      />
      {/* Anneau */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-full border border-border/60 group-hover:border-primary/50 transition-colors"
      />
      {/* Surface */}
      <span className="relative flex items-center justify-center w-12 h-12 rounded-full bg-background/80 backdrop-blur-xl shadow-lg shadow-black/30 dark:shadow-black/50">
        <SunMoonIcon isDark={isDark} />
      </span>
    </motion.button>
  );
}

function SunMoonIcon({ isDark }: { isDark: boolean }) {
  return (
    <span className="relative w-5 h-5 inline-block">
      <AnimatePresence initial={false} mode="wait">
        {isDark ? (
          <motion.span
            key="moon"
            initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 flex items-center justify-center text-accent"
          >
            <Moon size={18} strokeWidth={2} />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ opacity: 0, rotate: 90, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -90, scale: 0.6 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 flex items-center justify-center text-primary"
          >
            <Sun size={18} strokeWidth={2} />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
