
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
  const [isLoading, setIsLoading] = useState(false);

  const loadPayPalSdk = () => {
    // Clear any previous errors
    setLoadError(null);
    
    // Don't attempt to load if already loaded or currently loading
    if (window.paypal || isLoading) {
      if (window.paypal) {
        setPaypalLoaded(true);
      }
      return;
    }
    
    setIsLoading(true);
    console.log("Loading PayPal SDK...");
    
    // Create script element
    const script = document.createElement('script');
    
    // Use a simpler URL for the sandbox environment
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`;
    script.async = true;
    
    const handleLoad = () => {
      console.log("PayPal SDK loaded successfully");
      setIsLoading(false);
      setPaypalLoaded(true);
    };
    
    const handleError = (e: Event) => {
      console.error("Error loading PayPal SDK:", e);
      setIsLoading(false);
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
      setIsLoading(false);
    };
  };

  // Load PayPal SDK on component mount
  useEffect(() => {
    const cleanup = loadPayPalSdk();
    
    // Handle component unmount
    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, []);

  const retryLoading = () => {
    setLoadError(null);
    setPaypalLoaded(false);
    
    // Add a small delay before retrying
    setTimeout(loadPayPalSdk, 500);
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
