
import { useState, useEffect, useCallback } from 'react';

// PayPal Client ID
const PAYPAL_CLIENT_ID = "AWlG0jsULIbL7Un-uRUaB88Q_zn8Vu09fpwqI-sm9p9iV0IdgiASJwFUQvX3slmCYAuXRn9UrudgwVx5";

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
    // Use the simplest configuration first - only request essential components
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&intent=capture`;
    script.async = true;
    
    script.onload = () => {
      console.log("PayPal SDK loaded successfully");
      setPaypalLoaded(true);
      setIsLoading(false);
    };
    
    script.onerror = () => {
      console.error("Error loading PayPal SDK");
      setLoadError("There was an issue connecting to PayPal. This may be due to developer account limitations or configuration issues.");
      setIsLoading(false);
    };
    
    document.body.appendChild(script);
  }, []);

  // Load the PayPal SDK when the component mounts
  useEffect(() => {
    // Slight delay before loading to ensure DOM is ready
    const timer = setTimeout(() => {
      loadPayPalScript();
    }, 300);
    
    // Cleanup function
    return () => {
      clearTimeout(timer);
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
