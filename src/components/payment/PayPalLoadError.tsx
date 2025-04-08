
import { Button } from '@/components/ui/button';
import { AlertCircle, CreditCard } from 'lucide-react';

interface PayPalLoadErrorProps {
  errorMessage: string;
  onRetry: () => void;
}

const PayPalLoadError = ({ errorMessage, onRetry }: PayPalLoadErrorProps) => {
  return (
    <div className="text-center py-6">
      <div className="flex items-center justify-center mb-2 text-red-500">
        <AlertCircle className="mr-2" size={20} />
        <p className="font-medium">{errorMessage}</p>
      </div>
      <p className="text-sm text-muted-foreground mb-3">
        This could be due to a network issue, browser settings, or ad-blockers.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <Button 
          onClick={onRetry}
          variant="default"
          className="mt-2"
        >
          Try Again
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-4">
        If the problem persists, try using a different browser or network connection.
      </p>
    </div>
  );
};

export default PayPalLoadError;
