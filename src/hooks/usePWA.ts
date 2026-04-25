import { useState, useEffect } from 'react';

export const usePWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then((registration) => {
            console.log('SW registered:', registration);
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
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
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
    }
    setDeferredPrompt(null);
  };

  const subscribeToPush = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push notifications not supported');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        // In a real scenario, you'd get the public VAPID key from your backend
        // For now, we just show the permission was granted
        console.log('Notification permission granted');
        
        // Example subscription logic (requires VAPID key)
        /*
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: 'YOUR_PUBLIC_VAPID_KEY'
        });
        console.log('Push subscription:', subscription);
        setIsSubscribed(true);
        */
        
        // Local test notification
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

  return { isInstallable, isSubscribed, installApp, subscribeToPush };
};
