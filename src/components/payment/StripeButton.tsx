
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { createStripeCheckoutSession } from '@/utils/api/stripeService';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
      
      console.log(`Processing ${plan.name} payment for ${plan.price}`);
      
      // Create a Stripe Checkout session and redirect
      const result = await createStripeCheckoutSession(plan);
      
      if (!result) {
        throw new Error("Failed to create checkout session");
      }
      
      // Note: The redirect will happen in the createStripeCheckoutSession function,
      // so we don't need to handle success/error callbacks here
      
    } catch (err: any) {
      console.error('Stripe payment error:', err);
      setError(err.message || 'Failed to process payment. Please try again.');
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
        For testing, use card number 4242 4242 4242 4242
      </p>
    </div>
  );
};

export default StripeButton;
