
import { Loader2 } from 'lucide-react';
import { usePayPalSdk } from '@/hooks/usePayPalSdk';
import PayPalButtonRenderer from './PayPalButtonRenderer';
import PayPalLoadError from './PayPalLoadError';

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
        </div>
      )}
    </div>
  );
};

export default PayPalButton;
