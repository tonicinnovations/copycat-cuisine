
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Set sandbox client ID for testing purposes
const PAYPAL_CLIENT_ID = "sb";

interface PayPalButtonProps {
  plan: {
    name: string;
    price: string;
    period: string;
  };
  onSuccess: () => void;
  onError?: (error: any) => void;
  onProcessingChange: (isProcessing: boolean) => void;
  onComplete: () => void;
}

declare global {
  interface Window {
    paypal?: {
      Buttons: (options: any) => {
        render: (element: string | HTMLElement) => void;
      };
    };
  }
}

const PayPalButton = ({ 
  plan, 
  onSuccess, 
  onError, 
  onProcessingChange,
  onComplete
}: PayPalButtonProps) => {
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  // Load PayPal SDK
  useEffect(() => {
    if (!paypalLoaded && !window.paypal) {
      console.log("Loading PayPal SDK...");
      const script = document.createElement('script');
      
      // Use PayPal Sandbox for testing - adding currency and intent parameters
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&intent=capture`;
      script.async = true;
      
      script.addEventListener('load', () => {
        console.log("PayPal SDK loaded successfully");
        setPaypalLoaded(true);
      });
      
      script.addEventListener('error', (e) => {
        console.error("Error loading PayPal SDK:", e);
        setLoadError("Failed to load PayPal. Please try again or use a different payment method.");
        toast.error("Failed to load PayPal");
      });
      
      document.body.appendChild(script);
      
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [paypalLoaded]);
  
  // Initialize PayPal buttons when the SDK is loaded
  useEffect(() => {
    if (paypalLoaded && window.paypal && plan) {
      console.log("Initializing PayPal buttons...");
      const paypalButtonsContainer = document.getElementById('paypal-button-container');
      
      if (!paypalButtonsContainer) {
        console.error("PayPal button container not found");
        return;
      }
      
      // Clear the container first
      paypalButtonsContainer.innerHTML = '';
      
      try {
        // Simplified PayPal configuration using the sandbox environment
        const buttons = window.paypal.Buttons({
          // Create order
          createOrder: (data: any, actions: any) => {
            console.log("Creating PayPal order for plan:", plan);
            // Get the numerical price without the $ sign
            const priceValue = plan.price.replace('$', '');
            
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: priceValue,
                  currency_code: 'USD'
                },
                description: `CopyCat Cuisine ${plan.name} Plan (${plan.period})`
              }]
            });
          },
          // Handle successful payment
          onApprove: (data: any, actions: any) => {
            console.log("PayPal payment approved:", data);
            onProcessingChange(true);
            
            // Store order ID for later management
            const orderId = data.orderID;
            
            // For sandbox/demo, we can skip the actual capture and just simulate success
            console.log('Payment successful. Order ID:', orderId);
            localStorage.setItem('copycat_subscription_id', orderId);
            localStorage.setItem('copycat_subscription_period', plan.period);
            
            onProcessingChange(false);
            onComplete();
            
            // After showing success state, call success callback
            setTimeout(() => {
              onSuccess();
            }, 2000);
            
            return Promise.resolve();
          },
          // Handle payment errors
          onError: (err: any) => {
            console.error('PayPal Error:', err);
            toast.error('There was an error processing your payment');
            onProcessingChange(false);
            if (onError) onError(err);
          },
          // Handle cancellation
          onCancel: () => {
            console.log("PayPal payment cancelled");
            toast.info('Payment was cancelled');
            onProcessingChange(false);
          },
          style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal'  // Changed to "paypal" to show both PayPal and card options
          }
        });
        
        if (!buttons) {
          console.error("Failed to create PayPal buttons");
          setLoadError("Failed to initialize PayPal. Please try again later.");
          return;
        }
        
        buttons.render('#paypal-button-container');
        console.log("PayPal buttons rendered");
      } catch (error) {
        console.error("Error rendering PayPal buttons:", error);
        setLoadError("Error initializing PayPal. Please try again later.");
        toast.error("Failed to initialize PayPal");
      }
    }
  }, [paypalLoaded, plan, onSuccess, onProcessingChange, onComplete, onError]);
  
  return (
    <div>
      {loadError ? (
        <div className="text-center py-6 text-red-500">
          <p>{loadError}</p>
          <button 
            onClick={() => {
              setLoadError(null);
              setPaypalLoaded(false);
            }}
            className="mt-2 px-4 py-2 bg-culinary-copper text-white rounded"
          >
            Retry
          </button>
        </div>
      ) : paypalLoaded ? (
        <div>
          <div id="paypal-button-container" className="w-full min-h-[150px]"></div>
          <p className="text-xs text-center text-muted-foreground mt-1">
            No PayPal account required - you can pay with credit/debit card
          </p>
        </div>
      ) : (
        <div className="flex justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-culinary-copper" />
        </div>
      )}
      <p className="text-xs text-center text-muted-foreground mt-3">
        {plan.period === 'lifetime' || plan.period === 'one-time' 
          ? 'This is a demo - no real payment will be processed.'
          : 'This is a demo - no real payment will be processed.'}
      </p>
    </div>
  );
};

export default PayPalButton;
