
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

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
        Common issues that can block PayPal:
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li>Ad blockers or privacy extensions</li>
          <li>Network firewalls or restrictions</li>
          <li>Browser cookie/privacy settings</li>
          <li>Temporary PayPal service disruption</li>
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
      </div>
      <p className="text-xs text-muted-foreground mt-4">
        Try disabling ad blockers, using a different browser, or connecting to a different network if the problem persists.
      </p>
    </div>
  );
};

export default PayPalLoadError;
