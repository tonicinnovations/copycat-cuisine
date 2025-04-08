
import { Loader2 } from 'lucide-react';
import { usePayPalSdk } from '@/hooks/usePayPalSdk';
import PayPalButtonRenderer from './PayPalButtonRenderer';
import PayPalLoadError from './PayPalLoadError';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

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

const PayPalButton = ({ 
  plan, 
  onSuccess, 
  onError, 
  onProcessingChange,
  onComplete
}: PayPalButtonProps) => {
  const { paypalLoaded, loadError, retryLoading } = usePayPalSdk();
  const [simulatingDemo, setSimulatingDemo] = useState(false);
  
  // For demo purposes, simulate a successful payment
  const handleDemoSuccess = () => {
    setSimulatingDemo(true);
    onProcessingChange(true);
    
    // Simulate a delay before completing
    setTimeout(() => {
      console.log('Demo payment successful');
      // Generate a simulated order ID for demo purposes
      const demoOrderId = 'DEMO-' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('copycat_subscription_id', demoOrderId);
      localStorage.setItem('copycat_subscription_period', plan.period);
      
      toast.success('Demo payment processed successfully');
      onProcessingChange(false);
      onComplete();
      
      // After showing success state, call success callback
      setTimeout(() => {
        onSuccess();
        setSimulatingDemo(false);
      }, 1000);
    }, 2000);
  };
  
  return (
    <div>
      {loadError ? (
        <div>
          <PayPalLoadError 
            errorMessage={loadError} 
            onRetry={retryLoading} 
          />
          <div className="mt-4 flex justify-center">
            <Button
              onClick={handleDemoSuccess}
              disabled={simulatingDemo}
              className="bg-culinary-copper hover:bg-culinary-copper/90"
            >
              {simulatingDemo ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Demo Payment...
                </>
              ) : (
                "Continue with Demo Payment"
              )}
            </Button>
          </div>
        </div>
      ) : paypalLoaded ? (
        <div>
          <PayPalButtonRenderer
            plan={plan}
            onSuccess={onSuccess}
            onError={onError}
            onProcessingChange={onProcessingChange}
            onComplete={onComplete}
          />
          <p className="text-xs text-center text-muted-foreground mt-1">
            No PayPal account required - you can pay with credit/debit card
          </p>
        </div>
      ) : (
        <div className="flex justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-culinary-copper" />
        </div>
      )}
      <p className="text-xs text-center text-muted-foreground mt-3">
        {plan.period === 'lifetime' || plan.period === 'one-time' 
          ? 'This is a demo - no real payment will be processed.'
          : 'This is a demo - no real payment will be processed.'}
      </p>
    </div>
  );
};

export default PayPalButton;
