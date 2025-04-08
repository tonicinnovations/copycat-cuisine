
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
      console.log("PayPal SDK already loaded on mount");
      setPaypalLoaded(true);
    } else {
      console.log("PayPal SDK not found on mount");
    }
  }, []);

  const loadPayPalSdk = useCallback(() => {
    // Clear any previous errors
    setLoadError(null);
    
    // If PayPal is already available globally, set as loaded
    if (window.paypal) {
      console.log("PayPal SDK already loaded in loadPayPalSdk");
      setPaypalLoaded(true);
      return;
    }
    
    // Don't attempt to load if currently loading
    if (isLoading) {
      console.log("Already loading PayPal SDK, skipping duplicate load");
      return;
    }
    
    setIsLoading(true);
    console.log("Loading PayPal SDK (attempt #" + (loadAttempts + 1) + ")...");
    
    // Remove any existing PayPal scripts to prevent conflicts
    const existingScripts = document.querySelectorAll('script[src*="paypal.com/sdk/js"]');
    existingScripts.forEach(script => {
      console.log("Removing existing PayPal script");
      document.body.removeChild(script);
    });
    
    // Create script element
    const script = document.createElement('script');
    
    // Use the basic SDK URL with minimal parameters
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}`;
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
      setLoadError("Failed to load PayPal. Please check your network connection or try again later.");
      setLoadAttempts(prev => prev + 1);
      
      // Only show toast on first error
      if (loadAttempts < 1) {
        toast.error("Failed to load PayPal");
      }
    };
    
    script.addEventListener('load', handleLoad);
    script.addEventListener('error', handleError);
    
    document.body.appendChild(script);
    console.log("PayPal script added to the document body");
    
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
      }
    }, 10000); // 10 second timeout
    
    return () => {
      clearTimeout(timeoutId);
      script.removeEventListener('load', handleLoad);
      script.removeEventListener('error', handleError);
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
    console.log("Manual retry of PayPal SDK loading initiated");
    setLoadError(null);
    setPaypalLoaded(false);
    
    // Remove any existing PayPal scripts
    const existingScripts = document.querySelectorAll('script[src*="paypal.com/sdk/js"]');
    existingScripts.forEach(script => {
      console.log("Removing existing PayPal script during retry");
      document.body.removeChild(script);
    });
    
    // Also check if the global paypal object exists and attempt to clean it
    if (window.paypal) {
      console.log("PayPal global object exists but loading failed - attempting cleanup");
      try {
        // @ts-ignore - for cleanup purposes
        delete window.paypal;
        console.log("Cleaned up global PayPal object");
      } catch (e) {
        console.warn("Could not clean up global PayPal object:", e);
      }
    }
    
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
