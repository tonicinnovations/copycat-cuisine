
import { useState, useEffect, useCallback } from 'react';

// PayPal Client ID - replace with your own
const PAYPAL_CLIENT_ID = "YOUR_PAYPAL_CLIENT_ID"; // Replace with your actual client ID

export const usePayPalSdk = () => {
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadPayPalScript = useCallback(() => {
    setIsLoading(true);
    setLoadError(null);
    
    // Clean up any existing PayPal scripts
    const existingScripts = document.querySelectorAll('script[src*="paypal.com/sdk/js"]');
    existingScripts.forEach(script => script.remove());
    
    // Clear any global PayPal objects
    if (window.paypal) {
      delete window.paypal;
    }
    
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`;
    script.async = true;
    
    script.onload = () => {
      console.log("PayPal SDK loaded successfully");
      setPaypalLoaded(true);
      setIsLoading(false);
    };
    
    script.onerror = () => {
      console.error("Error loading PayPal SDK");
      setLoadError("Failed to connect to PayPal. Please check your internet connection and try again.");
      setIsLoading(false);
    };
    
    document.body.appendChild(script);
  }, []);

  // Load the PayPal SDK when the component mounts
  useEffect(() => {
    loadPayPalScript();
    
    // Cleanup function
    return () => {
      const script = document.querySelector('script[src*="paypal.com/sdk/js"]');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, [loadPayPalScript]);

  const retryLoading = () => {
    loadPayPalScript();
  };

  return { 
    paypalLoaded, 
    loadError, 
    isLoading, 
    retryLoading 
  };
};

// Add global type declaration for TypeScript
declare global {
  interface Window {
    paypal?: any;
  }
}
