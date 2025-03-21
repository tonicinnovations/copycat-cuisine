
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Your PayPal client ID - Production client ID
const PAYPAL_CLIENT_ID = "AWlG0jsULIbL7Un-uRUaB88Q_zn8Vu09fpwqI-sm9p9iV0IdgiASJwFUQvX3slmCYAuXRn9UrudgwVx5";

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
      // Use production PayPal SDK with your client ID and include vault=true for subscriptions
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&intent=subscription&vault=true`;
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
          // Create subscription instead of one-time order
          createSubscription: (data: any, actions: any) => {
            // Get the numerical price without the $ sign
            const priceValue = plan.price.replace('$', '');
            
            // For lifetime plan, continue using one-time payment
            if (plan.period === 'lifetime' || plan.period === 'one-time') {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: priceValue
                  },
                  description: `CopyCat Cuisine ${plan.name} Plan (One-time)`
                }]
              });
            }
            
            // Otherwise create a subscription
            return actions.subscription.create({
              plan_id: getPlanIdByPeriod(plan.period),
              custom_id: `CopyCat_${plan.name}_${Date.now()}`, // Unique identifier
              subscriber: {
                name: {
                  given_name: "CopyCat",
                  surname: "Customer"
                }
              }
            });
          },
          // Handle successful payment
          onApprove: (data: any, actions: any) => {
            onProcessingChange(true);
            
            // Store subscription/order ID for later management
            const subscriptionId = data.subscriptionID || data.orderID;
            
            // Verify the subscription or order was created successfully
            const verifyPayment = () => {
              // In a production environment, you would validate this on your server
              console.log('Payment successful. ID:', subscriptionId);
              localStorage.setItem('copycat_subscription_id', subscriptionId);
              localStorage.setItem('copycat_subscription_period', plan.period);
              
              onProcessingChange(false);
              onComplete();
              
              // After showing success state, call success callback
              setTimeout(() => {
                onSuccess();
              }, 2000);
            };
            
            // For one-time payments we need to capture the payment
            if (plan.period === 'lifetime' || plan.period === 'one-time') {
              return actions.order.capture().then(verifyPayment);
            } else {
              // For subscriptions, no need to capture
              verifyPayment();
            }
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
            toast.info('Payment was cancelled');
            onProcessingChange(false);
          }
        }).render('#paypal-button-container');
      }
    }
  }, [paypalLoaded, plan, onSuccess, onProcessingChange, onComplete, onError]);
  
  // Helper function to map period to plan IDs
  const getPlanIdByPeriod = (period: string): string => {
    // Updated with real PayPal plan IDs
    switch (period) {
      case 'month':
        return 'P-3R5088386K011274RM5OOAPQ'; // Real monthly subscription plan ID
      case 'year':
        return 'P-17100272W1733731XM5OOCMI'; // Real annual subscription plan ID
      default:
        return 'P-3R5088386K011274RM5OOAPQ'; // Default to monthly as fallback
    }
  };
  
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
        {plan.period === 'lifetime' || plan.period === 'one-time' 
          ? 'You will be redirected to PayPal to complete your one-time payment.'
          : 'You will be redirected to PayPal to set up your subscription.'}
      </p>
    </div>
  );
};

export default PayPalButton;
