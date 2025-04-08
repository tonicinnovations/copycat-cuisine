
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

// Use a real client ID from PayPal - this should be your own client ID
// For security in production, this should be in an environment variable
const PAYPAL_CLIENT_ID = "AYDaBq9cvDDV4l3xTgiV1cTh7aPGzK5UQf8AcYNrGFM1nJWZv_Q_i_zZxx9PCyQ0wJgxQaE3daWhWzdi";

interface UsePayPalSdkResult {
  paypalLoaded: boolean;
  loadError: string | null;
  retryLoading: () => void;
}

export const usePayPalSdk = (): UsePayPalSdkResult => {
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);

  // Check if PayPal is already loaded when the component mounts
  useEffect(() => {
    if (window.paypal) {
      setPaypalLoaded(true);
    }
  }, []);

  const loadPayPalSdk = useCallback(() => {
    // Clear any previous errors
    setLoadError(null);
    
    // If PayPal is already available globally, set as loaded
    if (window.paypal) {
      console.log("PayPal SDK already loaded");
      setPaypalLoaded(true);
      return;
    }
    
    // Don't attempt to load if currently loading
    if (isLoading) {
      return;
    }
    
    setIsLoading(true);
    console.log("Loading PayPal SDK (attempt #" + (loadAttempts + 1) + ")...");
    
    // Remove any existing PayPal scripts to prevent conflicts
    const existingScript = document.querySelector('script[src*="paypal.com/sdk/js"]');
    if (existingScript) {
      document.body.removeChild(existingScript);
    }
    
    // Create script element
    const script = document.createElement('script');
    
    // Use a simpler PayPal SDK URL with fewer parameters to reduce load errors
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`;
    script.async = true;
    script.defer = true;
    script.id = "paypal-sdk-script";
    
    const handleLoad = () => {
      console.log("PayPal SDK loaded successfully!");
      setIsLoading(false);
      setPaypalLoaded(true);
      setLoadAttempts(0); // Reset attempts on success
    };
    
    const handleError = (e: Event) => {
      console.error("Error loading PayPal SDK:", e);
      setIsLoading(false);
      setLoadError("Failed to load PayPal. Please try again or disable ad blockers if you have any.");
      setLoadAttempts(prev => prev + 1);
      
      // Only show toast on first error
      if (loadAttempts < 1) {
        toast.error("Failed to load PayPal");
      }
    };
    
    script.addEventListener('load', handleLoad);
    script.addEventListener('error', handleError);
    
    document.body.appendChild(script);
    
    // Add a timeout fallback in case the script gets stuck loading
    const timeoutId = setTimeout(() => {
      if (!window.paypal && !loadError) {
        console.log("PayPal SDK load timeout - forcing retry");
        script.removeEventListener('load', handleLoad);
        script.removeEventListener('error', handleError);
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
        setIsLoading(false);
        setLoadError("PayPal loading timed out. Please try again.");
        
        // Don't retry automatically to avoid infinite loops
      }
    }, 10000); // 10 second timeout
    
    return () => {
      clearTimeout(timeoutId);
      script.removeEventListener('load', handleLoad);
      script.removeEventListener('error', handleError);
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      setIsLoading(false);
    };
  }, [isLoading, loadAttempts, loadError]);

  // Load PayPal SDK on component mount
  useEffect(() => {
    const cleanup = loadPayPalSdk();
    
    // Handle component unmount
    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [loadPayPalSdk]);

  const retryLoading = useCallback(() => {
    setLoadError(null);
    setPaypalLoaded(false);
    
    // Add a small delay before retrying to give browser time to clean up
    setTimeout(() => {
      setLoadAttempts(0); // Reset attempts on manual retry
      loadPayPalSdk();
    }, 500);
  }, [loadPayPalSdk]);

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
