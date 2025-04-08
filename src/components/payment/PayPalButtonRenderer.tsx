
import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

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
  const [loadProgress, setLoadProgress] = useState(0);
  const timerRef = useRef<number | null>(null);
  const mountedRef = useRef(true);
  
  // Simulate progress for user feedback
  useEffect(() => {
    if (isRendering) {
      let progress = 0;
      // Clear any existing timer
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      
      // Set up progress simulation
      timerRef.current = window.setInterval(() => {
        if (mountedRef.current) {
          progress += Math.random() * 15;
          if (progress > 95) {
            progress = 95; // Cap at 95% until complete
          }
          setLoadProgress(progress);
        }
      }, 300);
      
      return () => {
        if (timerRef.current) {
          window.clearInterval(timerRef.current);
        }
      };
    } else {
      // Finished rendering
      setLoadProgress(100);
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isRendering]);
  
  useEffect(() => {
    mountedRef.current = true;
    const containerId = "paypal-button-container";
    console.log("PayPalButtonRenderer mounted - checking if PayPal is available");
    
    if (!window.paypal) {
      console.error("PayPal SDK not available in PayPalButtonRenderer");
      if (mountedRef.current) {
        setRenderError("PayPal SDK not available. Please try reloading the page.");
        setIsRendering(false);
      }
      return;
    }
    
    const paypalButtonsContainer = document.getElementById(containerId);
    
    if (!paypalButtonsContainer) {
      console.error("PayPal button container not found");
      if (mountedRef.current) {
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
      
      // Check if window.paypal.Buttons exists
      if (typeof window.paypal?.Buttons !== 'function') {
        console.error("PayPal Buttons function not available");
        if (mountedRef.current) {
          setRenderError("PayPal integration not available. Please try reloading the page.");
          setIsRendering(false);
        }
        return;
      }
      
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
              if (mountedRef.current) {
                onSuccess();
              }
            }, 1000);
          });
        },
        // Handle payment errors
        onError: (err: any) => {
          console.error('PayPal Error:', err);
          toast.error('There was an error processing your payment');
          onProcessingChange(false);
          if (mountedRef.current) {
            setRenderError("Payment processing error: " + (err.message || "Unknown error"));
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
        if (mountedRef.current) {
          setRenderError("Failed to create buttons");
          setIsRendering(false);
        }
        return;
      }
      
      try {
        // The render method returns void, not a Promise
        buttons.render(`#${containerId}`);
        console.log("PayPal buttons render initiated");
        
        // Set rendering complete after a short delay to allow for DOM updates
        setTimeout(() => {
          if (mountedRef.current) {
            console.log("PayPal buttons render timeout completed");
            setIsRendering(false);
          }
        }, 2000);
      } catch (renderError) {
        console.error("Error rendering PayPal buttons:", renderError);
        if (mountedRef.current) {
          setRenderError("Failed to render PayPal buttons: " + 
            (renderError instanceof Error ? renderError.message : String(renderError)));
          setIsRendering(false);
        }
      }
      
    } catch (error) {
      console.error("Error creating PayPal buttons:", error);
      toast.error("Failed to initialize PayPal");
      if (mountedRef.current) {
        setRenderError("Button initialization failed: " + (error instanceof Error ? error.message : String(error)));
        setIsRendering(false);
      }
      if (onError) onError(error);
    }
    
    return () => {
      mountedRef.current = false;
      console.log("PayPalButtonRenderer unmounting");
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [plan, onSuccess, onProcessingChange, onComplete, onError]);

  return (
    <div className="w-full">
      <div id="paypal-button-container" className="w-full min-h-[150px]">
        {isRendering && (
          <div className="flex flex-col items-center justify-center py-4">
            <Loader2 className="w-8 h-8 mb-2 animate-spin text-culinary-copper" />
            <p className="text-sm text-muted-foreground">Initializing PayPal...</p>
            <div className="w-full mt-4">
              <Progress value={loadProgress} className="h-2" />
              <p className="text-xs text-center text-muted-foreground mt-1">
                {loadProgress < 100 ? "Loading..." : "Almost ready..."}
              </p>
            </div>
          </div>
        )}
      </div>
      {renderError && (
        <div className="text-center py-4 text-red-500">
          <p>Error: {renderError}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Please try reloading the page or using a different payment method.
          </p>
        </div>
      )}
    </div>
  );
};

export default PayPalButtonRenderer;
