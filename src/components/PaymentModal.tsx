
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CreditCard } from 'lucide-react';

// Import payment components
import PayPalButton from './payment/PayPalButton';
import PaymentSuccess from './payment/PaymentSuccess';
import PriceSummary from './payment/PriceSummary';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  plan: {
    name: string;
    price: string;
    period: string;
  } | null;
  onSuccess: () => void;
}

const PaymentModal = ({ open, onClose, plan, onSuccess }: PaymentModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const handleClose = () => {
    // Reset state when modal is closed
    if (!isProcessing) {
      setIsComplete(false);
      onClose();
    }
  };
  
  if (!plan) return null;
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-white p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-xl font-display font-medium">
            {isComplete ? 'Payment Successful' : 'Complete Your Purchase'}
          </DialogTitle>
          <DialogDescription>
            {isComplete 
              ? 'Thank you for upgrading to CopyCat Cuisine Premium!'
              : `You're subscribing to the ${plan.name} plan at ${plan.price}/${plan.period}.`
            }
          </DialogDescription>
        </DialogHeader>
        
        {isComplete ? (
          <PaymentSuccess onClose={onClose} />
        ) : (
          <>
            <div className="px-6 py-4">
              <PriceSummary price={plan.price} />
              
              <div className="mb-4 text-center text-sm text-muted-foreground">
                Pay securely with PayPal or any credit/debit card without a PayPal account
              </div>
              
              <PayPalButton 
                plan={plan}
                onProcessingChange={setIsProcessing}
                onComplete={() => setIsComplete(true)}
                onSuccess={onSuccess}
              />
            </div>
            
            <div className="px-6 pb-6 pt-2 text-xs text-center text-muted-foreground">
              By completing your purchase you agree to our{" "}
              <a href="#" className="underline hover:text-foreground">Terms of Service</a> and{" "}
              <a href="#" className="underline hover:text-foreground">Privacy Policy</a>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
