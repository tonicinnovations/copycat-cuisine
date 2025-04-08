
import { Loader2 } from 'lucide-react';
import { usePayPalSdk } from '@/hooks/usePayPalSdk';
import PayPalButtonRenderer from './PayPalButtonRenderer';
import PayPalLoadError from './PayPalLoadError';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect } from 'react';

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
  const [loadProgress, setLoadProgress] = useState(0);
  
  // Simulate loading progress for better UX
  useEffect(() => {
    if (!paypalLoaded && !loadError) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress > 90) {
          progress = 90; // Cap at 90% until actual loading completes
        }
        setLoadProgress(progress);
      }, 400);
      
      return () => clearInterval(interval);
    } else {
      // Either loaded or error state
      setLoadProgress(loadError ? 0 : 100);
    }
  }, [paypalLoaded, loadError]);

  return (
    <div>
      {loadError ? (
        <PayPalLoadError 
          errorMessage={loadError} 
          onRetry={retryLoading} 
        />
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
        <div className="flex flex-col items-center justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-culinary-copper mb-2" />
          <p className="text-sm text-center text-muted-foreground">
            Connecting to PayPal...
          </p>
          <div className="w-full mt-4 px-4">
            <Progress value={loadProgress} className="h-2" />
            <p className="text-xs text-center text-muted-foreground mt-1">
              Please wait while we initialize PayPal
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayPalButton;
