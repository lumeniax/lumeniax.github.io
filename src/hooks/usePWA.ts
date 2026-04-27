import { useState, useEffect } from 'react';

export const usePWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    const checkInstalled = () => {
      // Check display-mode
      if (window.matchMedia('(display-mode: standalone)').matches || 
          (window.navigator as any).standalone === true) {
        setIsInstalled(true);
        return true;
      }
      return false;
    };

    checkInstalled();

    // Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then((registration) => {
            checkSubscription(registration);
          })
          .catch((error) => {
            console.error('SW registration failed:', error);
          });
      });
    }

    // Handle Install Prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      // Only set as installable if not already detected as installed
      if (!checkInstalled()) {
        setDeferredPrompt(e);
        setIsInstallable(true);
      }
    };

    // Detect when app is installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      localStorage.setItem('pwa-installed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check localStorage as fallback
    if (localStorage.getItem('pwa-installed') === 'true') {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const checkSubscription = async (registration: ServiceWorkerRegistration) => {
    if ('pushManager' in registration) {
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    }
  };

  const installApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const subscribeToPush = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        registration.showNotification('Lumeniax', {
          body: 'Les notifications sont activées !',
          icon: '/icon-192x192.png'
        });
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error('Push subscription failed:', error);
    }
  };

  return { isInstallable, isSubscribed, isInstalled, installApp, subscribeToPush };
};
