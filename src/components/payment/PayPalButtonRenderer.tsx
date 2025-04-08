
import { useEffect } from 'react';
import { toast } from 'sonner';

interface PlanDetails {
  name: string;
  price: string;
  period: string;
}

interface PayPalButtonRendererProps {
  plan: PlanDetails;
  onSuccess: () => void;
  onError?: (error: any) => void;
  onProcessingChange: (isProcessing: boolean) => void;
  onComplete: () => void;
}

const PayPalButtonRenderer = ({
  plan,
  onSuccess,
  onError,
  onProcessingChange,
  onComplete
}: PayPalButtonRendererProps) => {
  
  useEffect(() => {
    if (window.paypal && plan) {
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
            label: 'paypal'
          }
        });
        
        if (!buttons) {
          console.error("Failed to create PayPal buttons");
          return;
        }
        
        buttons.render('#paypal-button-container');
        console.log("PayPal buttons rendered");
      } catch (error) {
        console.error("Error rendering PayPal buttons:", error);
        toast.error("Failed to initialize PayPal");
        if (onError) onError(error);
      }
    }
  }, [plan, onSuccess, onProcessingChange, onComplete, onError]);

  return (
    <div id="paypal-button-container" className="w-full min-h-[150px]"></div>
  );
};

export default PayPalButtonRenderer;
