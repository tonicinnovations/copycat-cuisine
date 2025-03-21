
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

interface PaymentSuccessProps {
  onClose: () => void;
}

const PaymentSuccess = ({ onClose }: PaymentSuccessProps) => {
  return (
    <div className="flex flex-col items-center justify-center px-6 pb-6 py-8">
      <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
        <CheckCircle2 size={28} className="text-green-500" />
      </div>
      <h3 className="text-lg font-medium mb-1">Welcome to Premium!</h3>
      <p className="text-center text-muted-foreground mb-6">
        You now have access to all premium features. Enjoy your culinary adventures!
      </p>
      <Button onClick={onClose} className="w-full">
        Start Exploring
      </Button>
    </div>
  );
};

export default PaymentSuccess;
