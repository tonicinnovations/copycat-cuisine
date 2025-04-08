
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

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
  const [isRendering, setIsRendering] = useState(true);
  const [renderError, setRenderError] = useState<string | null>(null);
  
  useEffect(() => {
    let mounted = true;
    const containerId = "paypal-button-container";
    console.log("PayPalButtonRenderer mounted - checking if PayPal is available");
    
    if (!window.paypal) {
      console.error("PayPal SDK not available in PayPalButtonRenderer");
      if (mounted) {
        setRenderError("PayPal SDK not available");
        setIsRendering(false);
      }
      return;
    }
    
    const paypalButtonsContainer = document.getElementById(containerId);
    
    if (!paypalButtonsContainer) {
      console.error("PayPal button container not found");
      if (mounted) {
        setRenderError("Button container not found");
        setIsRendering(false);
      }
      return;
    }
    
    // Clear the container first
    paypalButtonsContainer.innerHTML = '';
    console.log("Cleared PayPal button container, initializing buttons");
    
    try {
      console.log("Creating PayPal buttons configuration for plan:", plan);
      // Get the numerical price without the $ sign
      const priceValue = plan.price.replace('$', '');
      
      // Create proper PayPal buttons configuration
      const buttons = window.paypal.Buttons({
        // Create order
        createOrder: (data: any, actions: any) => {
          console.log("Creating PayPal order");
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
          
          // Capture the funds from the transaction
          return actions.order.capture().then(function(details: any) {
            console.log('Payment completed successfully:', details);
            
            // Store order ID for later management
            const orderId = details.id;
            localStorage.setItem('copycat_subscription_id', orderId);
            localStorage.setItem('copycat_subscription_period', plan.period);
            
            toast.success('Payment processed successfully');
            onProcessingChange(false);
            onComplete();
            
            // After showing success state, call success callback
            setTimeout(() => {
              onSuccess();
            }, 1000);
          });
        },
        // Handle payment errors
        onError: (err: any) => {
          console.error('PayPal Error:', err);
          toast.error('There was an error processing your payment');
          onProcessingChange(false);
          if (mounted) {
            setRenderError("Payment processing error");
          }
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
        if (mounted) {
          setRenderError("Failed to create buttons");
          setIsRendering(false);
        }
        return;
      }
      
      // Fix: The render method returns void, not a Promise
      buttons.render(`#${containerId}`);
      console.log("PayPal buttons render initiated");
      
      // Set rendering complete after a short delay
      setTimeout(() => {
        if (mounted) {
          console.log("PayPal buttons render timeout completed");
          setIsRendering(false);
        }
      }, 2000);
      
    } catch (error) {
      console.error("Error creating PayPal buttons:", error);
      toast.error("Failed to initialize PayPal");
      if (mounted) {
        setRenderError("Button initialization failed: " + (error instanceof Error ? error.message : String(error)));
        setIsRendering(false);
      }
      if (onError) onError(error);
    }
    
    return () => {
      mounted = false;
      console.log("PayPalButtonRenderer unmounting");
    };
  }, [plan, onSuccess, onProcessingChange, onComplete, onError]);

  return (
    <div className="w-full">
      <div id="paypal-button-container" className="w-full min-h-[150px]">
        {isRendering && (
          <div className="flex flex-col items-center justify-center py-4">
            <Loader2 className="w-8 h-8 mb-2 animate-spin text-culinary-copper" />
            <p className="text-sm text-muted-foreground">Initializing PayPal...</p>
          </div>
        )}
      </div>
      {renderError && (
        <div className="text-center py-4 text-red-500">
          <p>Error: {renderError}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Please try reloading the page.
          </p>
        </div>
      )}
    </div>
  );
};

export default PayPalButtonRenderer;
