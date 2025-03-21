
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Your PayPal client ID - Replace this with your actual production client ID
const PAYPAL_CLIENT_ID = "YOUR_PRODUCTION_CLIENT_ID";

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
  
  // Load PayPal SDK
  useEffect(() => {
    if (!paypalLoaded && !window.paypal) {
      const script = document.createElement('script');
      // Use production PayPal SDK with your client ID
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`;
      script.addEventListener('load', () => {
        setPaypalLoaded(true);
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
      const paypalButtonsContainer = document.getElementById('paypal-button-container');
      if (paypalButtonsContainer) {
        paypalButtonsContainer.innerHTML = '';
        
        window.paypal.Buttons({
          // Create order with the actual amount from the selected plan
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: plan.price.replace('$', '')
                },
                description: `CopyCat Cuisine ${plan.name} Plan`
              }]
            });
          },
          // Handle successful payment
          onApprove: (data: any, actions: any) => {
            onProcessingChange(true);
            
            // Process the actual payment
            return actions.order.capture().then(function(details: any) {
              // Payment is completed - you can now record the transaction in your database
              console.log('Transaction completed by ' + details.payer.name.given_name);
              
              onProcessingChange(false);
              onComplete();
              
              // After showing success state, call success callback
              setTimeout(() => {
                onSuccess();
              }, 2000);
            });
          },
          // Handle payment errors
          onError: (err: any) => {
            console.error('PayPal Error:', err);
            toast.error('There was an error processing your payment');
            onProcessingChange(false);
            if (onError) onError(err);
          }
        }).render('#paypal-button-container');
      }
    }
  }, [paypalLoaded, plan, onSuccess, onProcessingChange, onComplete, onError]);
  
  return (
    <div>
      {paypalLoaded ? (
        <div id="paypal-button-container" className="w-full min-h-[150px]"></div>
      ) : (
        <div className="flex justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-culinary-copper" />
        </div>
      )}
      <p className="text-xs text-center text-muted-foreground mt-3">
        You will be redirected to PayPal to complete your payment.
      </p>
    </div>
  );
};

export default PayPalButton;
