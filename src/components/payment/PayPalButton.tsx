
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
}

const PayPalButton = ({ plan, onSuccess }: PayPalButtonProps) => {
  const { paypalLoaded, loadError, isLoading, retryLoading } = usePayPalSdk();

  return (
    <div className="w-full">
      {loadError ? (
        <PayPalLoadError 
          errorMessage={loadError} 
          onRetry={retryLoading} 
        />
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-culinary-copper mb-2" />
          <p className="text-sm text-center text-muted-foreground">
            Connecting to PayPal...
          </p>
        </div>
      ) : paypalLoaded ? (
        <div>
          <PayPalButtonRenderer
            plan={plan}
            onSuccess={onSuccess}
          />
          <p className="text-xs text-center text-muted-foreground mt-2">
            No PayPal account required - you can pay with credit/debit card
          </p>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">
            Unable to load payment options. Please refresh and try again.
          </p>
        </div>
      )}
    </div>
  );
};

export default PayPalButton;
