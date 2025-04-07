
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Demo Stripe publishable key - this would be replaced with your actual key in production
const STRIPE_PUBLISHABLE_KEY = "pk_test_TYooMQauvdEDq54NiTphI7jx";

interface StripeButtonProps {
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

const StripeButton = ({ 
  plan, 
  onSuccess, 
  onError, 
  onProcessingChange,
  onComplete
}: StripeButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handlePayment = async () => {
    try {
      setIsLoading(true);
      onProcessingChange(true);
      setError(null);
      
      // In a real implementation, you would:
      // 1. Call your backend to create a Stripe Checkout session
      // 2. Redirect to the Stripe Checkout page
      // 3. Handle the redirect back to your site
      
      console.log(`Processing ${plan.name} payment for ${plan.price}`);
      
      // For demo purposes, simulate a successful payment
      setTimeout(() => {
        // Store subscription info in localStorage (for demo)
        const mockSessionId = `cs_test_${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem('copycat_subscription_id', mockSessionId);
        localStorage.setItem('copycat_subscription_period', plan.period);
        
        setIsLoading(false);
        onProcessingChange(false);
        onComplete();
        
        // After showing success state, call success callback
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }, 2000);
      
    } catch (err) {
      console.error('Stripe payment error:', err);
      setError('Failed to process payment. Please try again.');
      toast.error('Payment processing failed');
      onProcessingChange(false);
      setIsLoading(false);
      if (onError) onError(err);
    }
  };
  
  return (
    <div className="w-full">
      {error ? (
        <div className="text-center py-4 px-3 bg-red-50 border border-red-100 rounded-md mb-4">
          <p className="text-red-600 text-sm">{error}</p>
          <Button 
            onClick={() => setError(null)} 
            variant="outline" 
            size="sm" 
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      ) : (
        <Button
          onClick={handlePayment}
          disabled={isLoading}
          className="w-full bg-[#6772E5] hover:bg-[#556CD6]"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
              >
                <path 
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M16 12H8" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M12 8V16" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              Pay with Stripe
            </>
          )}
        </Button>
      )}
      <p className="text-xs text-center text-muted-foreground mt-3">
        This is a demo - no real payment will be processed.
      </p>
    </div>
  );
};

export default StripeButton;
