
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, ExternalLink, CreditCard } from 'lucide-react';

interface PayPalLoadErrorProps {
  errorMessage: string;
  onRetry: () => void;
}

const PayPalLoadError = ({ errorMessage, onRetry }: PayPalLoadErrorProps) => {
  return (
    <div className="text-center py-4 border border-amber-200 bg-amber-50 rounded-lg p-4">
      <div className="flex items-center justify-center mb-2 text-amber-700">
        <AlertCircle className="mr-2" size={20} />
        <p className="font-medium">{errorMessage}</p>
      </div>
      <p className="text-sm text-muted-foreground mb-3">
        PayPal's checkout integration requires a PayPal Business account. This demo app uses a developer account with limited functionality.
      </p>
      <div className="flex flex-col gap-2">
        <Button 
          onClick={onRetry}
          variant="default"
          className="mt-2"
        >
          <RefreshCw size={16} className="mr-2" />
          Try Again
        </Button>
        
        <Button
          onClick={() => window.open("https://www.paypal.com/business/tools", "_blank")}
          variant="outline"
          size="sm"
          className="mt-1"
        >
          <ExternalLink size={14} className="mr-2" />
          PayPal Business Information
        </Button>
        
        <Button
          onClick={() => window.open("https://www.paypal.com/us/webapps/mpp/account-status", "_blank")}
          variant="outline"
          size="sm"
          className="mt-1 border-amber-200"
        >
          <CreditCard size={14} className="mr-2" />
          Check Your PayPal Account Status
        </Button>
      </div>
    </div>
  );
};

export default PayPalLoadError;
