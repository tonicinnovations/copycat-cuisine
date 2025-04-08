
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

// Use the PayPal Sandbox client ID (this is a valid sandbox client ID for demos)
const PAYPAL_CLIENT_ID = "sb";

interface UsePayPalSdkResult {
  paypalLoaded: boolean;
  loadError: string | null;
  retryLoading: () => void;
}

export const usePayPalSdk = (): UsePayPalSdkResult => {
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadPayPalSdk = () => {
    if (!window.paypal) {
      console.log("Loading PayPal SDK...");
      const script = document.createElement('script');
      
      // Use PayPal Sandbox with minimal parameters to reduce errors
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}`;
      script.async = true;
      
      const handleLoad = () => {
        console.log("PayPal SDK loaded successfully");
        setPaypalLoaded(true);
      };
      
      const handleError = (e: Event) => {
        console.error("Error loading PayPal SDK:", e);
        setLoadError("Failed to load PayPal. Please try again or use a different payment method.");
        toast.error("Failed to load PayPal");
      };
      
      script.addEventListener('load', handleLoad);
      script.addEventListener('error', handleError);
      
      document.body.appendChild(script);
      
      return () => {
        script.removeEventListener('load', handleLoad);
        script.removeEventListener('error', handleError);
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    } else {
      setPaypalLoaded(true);
      return undefined;
    }
  };

  // Load PayPal SDK
  useEffect(() => {
    if (!paypalLoaded) {
      const cleanup = loadPayPalSdk();
      return cleanup;
    }
  }, [paypalLoaded]);

  const retryLoading = () => {
    setLoadError(null);
    setPaypalLoaded(false);
  };

  return { paypalLoaded, loadError, retryLoading };
};

// Add global type declaration
declare global {
  interface Window {
    paypal?: {
      Buttons: (options: any) => {
        render: (element: string | HTMLElement) => void;
      };
    };
  }
}
