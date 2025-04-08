
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

// PayPal Client ID - this should be your sandbox or live client ID
const PAYPAL_CLIENT_ID = "AYDaBq9cvDDV4l3xTgiV1cTh7aPGzK5UQf8AcYNrGFM1nJWZv_Q_i_zZxx9PCyQ0wJgxQaE3daWhWzdi";

interface UsePayPalSdkResult {
  paypalLoaded: boolean;
  loadError: string | null;
  retryLoading: () => void;
}

export const usePayPalSdk = (): UsePayPalSdkResult => {
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Simple function to load the PayPal SDK
  const loadPayPalScript = useCallback(() => {
    console.log("Starting fresh PayPal SDK load...");
    setLoadError(null);
    
    // Clear any existing PayPal scripts
    const existingScripts = document.querySelectorAll('script[src*="paypal.com"]');
    existingScripts.forEach(script => {
      console.log("Removing existing PayPal script");
      script.remove();
    });
    
    // Create a new script element
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`;
    script.async = true;
    
    // Set up event handlers
    script.onload = () => {
      console.log("PayPal SDK loaded successfully");
      setPaypalLoaded(true);
    };
    
    script.onerror = (error) => {
      console.error("Error loading PayPal SDK:", error);
      setLoadError("Failed to load PayPal. Please try again later.");
    };
    
    // Add the script to the document
    document.body.appendChild(script);
    
    // Return a cleanup function
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Load the SDK when the component mounts
  useEffect(() => {
    // Check if PayPal is already loaded
    if (window.paypal) {
      console.log("PayPal already loaded on mount");
      setPaypalLoaded(true);
      return;
    }
    
    const cleanup = loadPayPalScript();
    
    return () => {
      if (cleanup) cleanup();
    };
  }, [loadPayPalScript]);

  // Function to retry loading if it fails
  const retryLoading = useCallback(() => {
    console.log("Retrying PayPal SDK load...");
    setPaypalLoaded(false);
    loadPayPalScript();
  }, [loadPayPalScript]);

  return { paypalLoaded, loadError, retryLoading };
};

// Add global type declaration
declare global {
  interface Window {
    paypal?: any;
  }
}
