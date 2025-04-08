
import { Button } from '@/components/ui/button';

interface PayPalLoadErrorProps {
  errorMessage: string;
  onRetry: () => void;
}

const PayPalLoadError = ({ errorMessage, onRetry }: PayPalLoadErrorProps) => {
  return (
    <div className="text-center py-6 text-red-500">
      <p>{errorMessage}</p>
      <Button 
        onClick={onRetry}
        className="mt-2 px-4 py-2 bg-culinary-copper text-white rounded"
      >
        Retry
      </Button>
    </div>
  );
};

export default PayPalLoadError;
