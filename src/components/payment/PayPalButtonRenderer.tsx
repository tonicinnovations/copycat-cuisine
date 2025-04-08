
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface PayPalButtonRendererProps {
  plan: {
    name: string;
    price: string;
    period: string;
  };
  onSuccess: () => void;
  onError?: (error: any) => void;
}

const PayPalButtonRenderer = ({
  plan,
  onSuccess,
  onError
}: PayPalButtonRendererProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRendered = useRef(false);
  const [renderError, setRenderError] = useState(false);
  
  useEffect(() => {
    if (!window.paypal) {
      console.error("PayPal SDK not loaded");
      setRenderError(true);
      return;
    }
    
    if (!containerRef.current || buttonRendered.current) {
      return;
    }
    
    try {
      console.log("Rendering PayPal buttons with plan:", plan);
      
      // Check if window.paypal.Buttons exists
      if (!window.paypal.Buttons) {
        console.error("PayPal Buttons API not available");
        setRenderError(true);
        return;
      }
      
      const priceValue = parseFloat(plan.price.replace('$', ''));
      
      const buttons = window.paypal.Buttons({
        // Create order
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
        
        // Handle approval
        onApprove: (data: any, actions: any) => {
          return actions.order.capture().then(function(details: any) {
            console.log('Transaction completed by ' + details.payer.name.given_name);
            
            // Store subscription info in localStorage
            localStorage.setItem('copycat_subscription_id', details.id);
            localStorage.setItem('copycat_subscription_period', plan.period);
            
            toast.success('Payment successful!');
            onSuccess();
          });
        },
        
        // Handle errors
        onError: (err: any) => {
          console.error('PayPal Error:', err);
          toast.error('Payment failed. Please try again.');
          if (onError) onError(err);
        },
        
        // Handle cancellation
        onCancel: () => {
          console.log("Payment canceled");
          toast.info('Payment was cancelled');
        },
        
        // Style the button
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal'
        }
      });
      
      // Render the PayPal buttons
      buttons.render(containerRef.current).catch((err: any) => {
        console.error("Error rendering PayPal buttons:", err);
        setRenderError(true);
      });
      
      buttonRendered.current = true;
    } catch (error) {
      console.error("Error rendering PayPal buttons:", error);
      setRenderError(true);
      if (onError) onError(error);
    }
    
    return () => {
      buttonRendered.current = false;
    };
  }, [plan, onSuccess, onError]);

  if (renderError) {
    return (
      <div className="text-center p-4">
        <p className="text-amber-700 mb-3">
          We're experiencing issues connecting to PayPal. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div ref={containerRef} className="w-full min-h-[150px]">
        {!buttonRendered.current && !renderError && (
          <div className="flex justify-center items-center h-[150px]">
            <Loader2 className="w-6 h-6 animate-spin text-culinary-copper" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PayPalButtonRenderer;
