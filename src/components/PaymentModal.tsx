
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

// Import payment components
import PaymentSuccess from './payment/PaymentSuccess';
import PriceSummary from './payment/PriceSummary';
import StripeButton from './payment/StripeButton';

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
  const [isComplete, setIsComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleClose = () => {
    // Only allow closing if payment is not in progress
    if (!isProcessing) {
      setIsComplete(false);
      onClose();
    }
  };
  
  const handlePaymentSuccess = () => {
    setIsComplete(true);
    setTimeout(() => {
      onSuccess();
    }, 1500);
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
                Pay securely with your credit/debit card
              </div>
              
              <StripeButton 
                plan={plan}
                onSuccess={handlePaymentSuccess}
                onProcessingChange={setIsProcessing}
                onComplete={() => {}}
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
