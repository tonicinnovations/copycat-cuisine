
import { Loader2, CreditCard, AlertCircle } from 'lucide-react';
import { usePayPalSdk } from '@/hooks/usePayPalSdk';
import PayPalButtonRenderer from './PayPalButtonRenderer';
import PayPalLoadError from './PayPalLoadError';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PayPalButtonProps {
  plan: {
    name: string;
    price: string;
    period: string;
  };
  onSuccess: () => void;
}

const PayPalButton = ({ plan, onSuccess }: PayPalButtonProps) => {
  const { paypalLoaded, loadError, isLoading, retryLoading } = usePayPalSdk();

  const handleDemoPayment = () => {
    // Simulate successful payment for testing
    console.log("Processing demo payment for:", plan);
    localStorage.setItem('copycat_subscription_id', 'demo-subscription-' + Date.now());
    localStorage.setItem('copycat_subscription_period', plan.period);
    
    toast.success('Demo payment processed successfully!');
    setTimeout(() => onSuccess(), 1000);
  };

  return (
    <div className="w-full">
      {loadError ? (
        <div className="space-y-6">
          <PayPalLoadError 
            errorMessage={loadError} 
            onRetry={retryLoading} 
          />
          
          <div className="border-t border-dashed border-amber-200 pt-6">
            <div className="text-center mb-4">
              <h3 className="text-base font-medium">Use Demo Payment Instead</h3>
              <p className="text-sm text-muted-foreground mb-4">
                For this demonstration, you can use our simulated payment option
              </p>
              
              <Button
                onClick={handleDemoPayment}
                className="bg-gradient-to-r from-culinary-copper to-amber-600 hover:from-culinary-copper/90 hover:to-amber-700 w-full"
                size="lg"
              >
                <CreditCard className="mr-2" size={18} />
                Complete Demo Purchase
              </Button>
              
              <p className="text-xs text-muted-foreground mt-3">
                This simulates a successful payment for demonstration purposes
              </p>
            </div>
          </div>
        </div>
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-culinary-copper mb-2" />
          <p className="text-sm text-center text-muted-foreground">
            Connecting to PayPal...
          </p>
        </div>
      ) : paypalLoaded ? (
        <div>
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <div className="flex items-start">
              <AlertCircle className="text-amber-600 mr-2 mt-0.5" size={16} />
              <p className="text-xs">
                <span className="font-medium">Note:</span> PayPal integration requires a business account. This demo uses a developer account which cannot process real payments.
              </p>
            </div>
          </div>
          
          <PayPalButtonRenderer
            plan={plan}
            onSuccess={onSuccess}
          />
          <p className="text-xs text-center text-muted-foreground mt-2">
            No PayPal account required - you can pay with credit/debit card
          </p>
          
          <div className="mt-4 pt-4 border-t border-dashed">
            <Button
              onClick={handleDemoPayment}
              className="w-full bg-culinary-copper hover:bg-culinary-copper/90"
            >
              <CreditCard className="mr-2" size={18} />
              Complete Demo Purchase Instead
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <Button
            onClick={handleDemoPayment}
            className="bg-culinary-copper hover:bg-culinary-copper/90"
          >
            <CreditCard className="mr-2" size={18} />
            Complete Demo Purchase
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            This simulates a successful payment for demonstration purposes
          </p>
        </div>
      )}
    </div>
  );
};

export default PayPalButton;
