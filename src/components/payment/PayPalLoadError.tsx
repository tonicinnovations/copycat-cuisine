
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';

interface PayPalLoadErrorProps {
  errorMessage: string;
  onRetry: () => void;
}

const PayPalLoadError = ({ errorMessage, onRetry }: PayPalLoadErrorProps) => {
  return (
    <div className="text-center py-6 border border-red-100 bg-red-50 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-center mb-2 text-red-500">
        <AlertCircle className="mr-2" size={20} />
        <p className="font-medium">{errorMessage}</p>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Possible issues that may prevent PayPal from loading:
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li>Temporary network connection issues</li>
          <li>PayPal service disruption</li>
          <li>Browser cookie, cache, or security settings</li>
          <li>Browser extensions or privacy/security settings</li>
        </ul>
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <Button 
          onClick={onRetry}
          variant="default"
          className="mt-2 gap-2"
        >
          <RefreshCw size={16} className="animate-spin-once" />
          Try Again
        </Button>
        
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="mt-2"
        >
          Reload Page
        </Button>
        
        <Button 
          onClick={() => window.open('https://www.paypal.com/us/smarthelp/article/troubleshoot-paypal-checkout-ts2173', '_blank')}
          variant="outline"
          className="mt-2 gap-2"
        >
          <ExternalLink size={16} />
          PayPal Help
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-4">
        If this issue persists, please try using a different browser or device, 
        or clearing your browser cache and cookies.
      </p>
    </div>
  );
};

export default PayPalLoadError;
