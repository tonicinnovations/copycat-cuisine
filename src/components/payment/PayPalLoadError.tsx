
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface PayPalLoadErrorProps {
  errorMessage: string;
  onRetry: () => void;
}

const PayPalLoadError = ({ errorMessage, onRetry }: PayPalLoadErrorProps) => {
  return (
    <div className="text-center py-4 border border-red-100 bg-red-50 rounded-lg p-4">
      <div className="flex items-center justify-center mb-2 text-red-500">
        <AlertCircle className="mr-2" size={20} />
        <p className="font-medium">{errorMessage}</p>
      </div>
      <p className="text-sm text-muted-foreground mb-3">
        Please check your internet connection and try again.
      </p>
      <Button 
        onClick={onRetry}
        variant="default"
        className="mt-2"
      >
        <RefreshCw size={16} className="mr-2" />
        Try Again
      </Button>
    </div>
  );
};

export default PayPalLoadError;
