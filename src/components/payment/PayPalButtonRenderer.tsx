import { useEffect, useRef } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const paypalButtonsRendered = useRef(false);
  
  useEffect(() => {
    console.log("PayPalButtonRenderer mounted");
    const renderPayPalButtons = () => {
      if (!window.paypal || !window.paypal.Buttons) {
        console.error("PayPal SDK not fully loaded");
        if (onError) onError(new Error("PayPal SDK not available"));
        return;
      }
      
      if (!containerRef.current) {
        console.error("PayPal container not found");
        return;
      }
      
      if (paypalButtonsRendered.current) {
        console.log("PayPal buttons already rendered");
        return;
      }
      
      try {
        console.log("Rendering PayPal buttons");
        const priceValue = parseFloat(plan.price.replace('$', ''));
        
        const buttons = window.paypal.Buttons({
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: priceValue.toFixed(2),
                  currency_code: 'USD'
                },
                description: `CopyCat Cuisine ${plan.name} Plan (${plan.period})`
              }]
            });
          },
          
          onApprove: (data: any, actions: any) => {
            onProcessingChange(true);
            return actions.order.capture().then(function(details: any) {
              console.log('Payment completed successfully:', details);
              
              // Store subscription info
              localStorage.setItem('copycat_subscription_id', details.id);
              localStorage.setItem('copycat_subscription_period', plan.period);
              
              toast.success('Payment processed successfully');
              onProcessingChange(false);
              onComplete();
              
              setTimeout(() => {
                onSuccess();
              }, 1000);
            });
          },
          
          onError: (err: any) => {
            console.error('PayPal Error:', err);
            toast.error('There was an error processing your payment');
            onProcessingChange(false);
            if (onError) onError(err);
          },
          
          onCancel: () => {
            console.log("Payment cancelled");
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
        
        // Render the PayPal buttons
        buttons.render(containerRef.current);
        paypalButtonsRendered.current = true;
        console.log("PayPal buttons rendered successfully");
      } catch (error) {
        console.error("Error rendering PayPal buttons:", error);
        if (onError) onError(error);
      }
    };
    
    // If PayPal is already loaded, render buttons immediately
    if (window.paypal && window.paypal.Buttons) {
      renderPayPalButtons();
    } else {
      // Otherwise, set up an event listener to render buttons when PayPal loads
      const checkPayPalInterval = setInterval(() => {
        if (window.paypal && window.paypal.Buttons) {
          clearInterval(checkPayPalInterval);
          renderPayPalButtons();
        }
      }, 500);
      
      // Clear interval on cleanup
      return () => clearInterval(checkPayPalInterval);
    }
    
    return () => {
      console.log("PayPalButtonRenderer unmounting");
      paypalButtonsRendered.current = false;
    };
  }, [plan, onSuccess, onError, onProcessingChange, onComplete]);

  return (
    <div className="w-full">
      <div ref={containerRef} className="w-full min-h-[150px] flex items-center justify-center">
        {!paypalButtonsRendered.current && (
          <div className="flex flex-col items-center justify-center py-4">
            <Loader2 className="w-8 h-8 mb-2 animate-spin text-culinary-copper" />
            <p className="text-sm text-muted-foreground">Loading PayPal...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayPalButtonRenderer;
