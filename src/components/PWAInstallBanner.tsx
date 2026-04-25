import React, { useState, useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { Button } from '@/components/ui/button';
import { X, Download, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isSubscribed, installApp, subscribeToPush } = usePWA();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show banner after a short delay if installable or not subscribed
    if (isInstallable || !isSubscribed) {
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isSubscribed]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-80 z-[55]"
        >
          <div className="bg-card/95 backdrop-blur-md border border-primary/20 p-4 rounded-xl shadow-2xl flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <img src="/icon-192x192.png" alt="Lumeniax" className="w-8 h-8 rounded-md" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Lumeniax App</h3>
                  <p className="text-xs text-muted-foreground">Installez pour une expérience fluide</p>
                </div>
              </div>
              <button 
                onClick={() => setIsVisible(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="flex gap-2">
              {isInstallable && (
                <Button 
                  size="sm" 
                  className="flex-1 gap-2 bg-primary hover:bg-primary/90 text-white text-xs"
                  onClick={installApp}
                >
                  <Download size={14} />
                  Installer
                </Button>
              )}
              {!isSubscribed && (
                <Button 
                  size="sm" 
                  variant="outline"
                  className="flex-1 gap-2 border-primary/20 hover:bg-primary/5 text-xs"
                  onClick={subscribeToPush}
                >
                  <Bell size={14} />
                  Notifications
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
