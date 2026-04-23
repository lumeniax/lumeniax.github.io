import { motion } from "framer-motion";

interface AuthorSignatureProps {
  authorName?: string;
  date?: string;
  category?: string;
}

export function AuthorSignature({ 
  authorName = "Messan Salem ADIGUIDI", 
  date, 
  category 
}: AuthorSignatureProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="py-8 px-6 rounded-xl bg-gradient-to-r from-accent/10 to-primary/10 border border-primary/20 mt-12"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-lg">M</span>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-serif text-lg font-semibold text-foreground">
              {authorName}
            </h4>
            <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary font-medium">
              Auteur
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">
            Penseur visionnaire et expert en transformation digitale, innovation et développement personnel.
          </p>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {date && (
              <span className="flex items-center gap-1">
                📅 {date}
              </span>
            )}
            {category && (
              <span className="flex items-center gap-1">
                🏷️ {category}
              </span>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-primary/10">
            <p className="text-xs text-muted-foreground italic">
              "La transformation commence par la conscience. Chaque article est une invitation à évoluer."
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
