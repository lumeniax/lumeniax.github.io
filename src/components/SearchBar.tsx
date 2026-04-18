import { useState, useEffect, useRef } from "react";
import { Search, X, FileText, Layout, Zap, ArrowRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { getSearchIndex, SearchResult } from "@/lib/search-index";

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchIndex, setSearchIndex] = useState<SearchResult[]>([]);
  const [location] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadIndex = async () => {
      const index = await getSearchIndex();
      setSearchIndex(index);
    };
    loadIndex();
  }, []);

  useEffect(() => {
    if (query.trim().length > 1) {
      const filtered = searchIndex.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6);
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query, searchIndex]);

  // Fermer la recherche lors du changement de page
  useEffect(() => {
    setIsOpen(false);
    setQuery("");
  }, [location]);

  // Focus input quand ouvert
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return <FileText size={14} className="text-primary" />;
      case 'service': return <Zap size={14} className="text-accent" />;
      default: return <Layout size={14} className="text-secondary" />;
    }
  };

  return (
    <div className="relative">
      {/* Bouton Loupe */}
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-foreground/70 hover:text-primary transition-colors duration-300"
        aria-label="Rechercher"
      >
        <Search size={20} />
      </button>

      {/* Overlay de recherche */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-md z-[100]"
            />
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-[101]"
            >
              <div className="bg-card border border-primary/30 rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-4 flex items-center gap-4 border-b border-primary/10">
                  <Search size={20} className="text-primary" />
                  <input 
                    ref={inputRef}
                    type="text"
                    placeholder="Rechercher un article, un service, une page..."
                    className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-lg"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                    <X size={20} />
                  </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-2">
                  {query.length > 1 ? (
                    results.length > 0 ? (
                      <div className="space-y-1">
                        {results.map((result, index) => (
                          <Link key={index} href={result.url}>
                            <div className="p-4 rounded-xl hover:bg-primary/10 transition-all duration-300 cursor-pointer group flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-background border border-primary/10 flex items-center justify-center">
                                  {getTypeIcon(result.type)}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{result.title}</h4>
                                  <p className="text-xs text-muted-foreground line-clamp-1">{result.description}</p>
                                </div>
                              </div>
                              <ArrowRight size={16} className="text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="p-12 text-center">
                        <p className="text-muted-foreground">Aucun résultat pour "<span className="text-foreground font-medium">{query}</span>"</p>
                      </div>
                    )
                  ) : (
                    <div className="p-8">
                      <h5 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Suggestions</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {GLOBAL_PAGES.slice(1, 5).map((page, index) => (
                          <Link key={index} href={page.url}>
                            <div className="p-3 rounded-lg border border-primary/10 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer flex items-center gap-3">
                              <Layout size={14} className="text-secondary" />
                              <span className="text-sm font-medium">{page.title}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-3 bg-primary/5 border-t border-primary/10 flex justify-between items-center">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">Appuyez sur ESC pour fermer</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-background border border-primary/20 text-primary font-bold">LUMENIAX SEARCH</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
