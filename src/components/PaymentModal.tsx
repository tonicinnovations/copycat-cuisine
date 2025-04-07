
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CreditCard } from 'lucide-react';

// Import payment components
import CreditCardForm from './payment/CreditCardForm';
import StripeButton from './payment/StripeButton';
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
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'stripe'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      
      // After showing success state, close modal and call success callback
      setTimeout(() => {
        onClose();
        onSuccess();
      }, 2000);
    }, 1500);
  };
  
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
            <Tabs 
              defaultValue="card" 
              className="px-6"
              onValueChange={(value) => setPaymentMethod(value as 'card' | 'stripe')}
              value={paymentMethod}
            >
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="card" className="flex items-center gap-2">
                  <CreditCard size={16} />
                  <span>Card</span>
                </TabsTrigger>
                <TabsTrigger value="stripe" className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 21 21" fill="currentColor">
                    <path d="M19.4 4.8c0-1.2-0.9-2.1-2.1-2.1H3.7c-1.2 0-2.1 0.9-2.1 2.1v11.4c0 1.2 0.9 2.1 2.1 2.1h13.6c1.2 0 2.1-0.9 2.1-2.1V4.8zM3.7 3.6h13.6c0.7 0 1.2 0.5 1.2 1.2v2H2.5v-2c0-0.7 0.5-1.2 1.2-1.2zm13.6 13.8H3.7c-0.7 0-1.2-0.5-1.2-1.2V7.7h15.9v8.5c0 0.7-0.5 1.2-1.1 1.2z" />
                    <path d="M6.5 11.3h-2c-0.3 0-0.5-0.2-0.5-0.5s0.2-0.5 0.5-0.5h2c0.3 0 0.5 0.2 0.5 0.5s-0.2 0.5-0.5 0.5z" />
                  </svg>
                  <span>Stripe</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="card" className="space-y-4">
                <CreditCardForm 
                  plan={plan} 
                  isProcessing={isProcessing} 
                  onSubmit={handleSubmit} 
                />
              </TabsContent>
              
              <TabsContent value="stripe" className="flex flex-col items-center justify-center py-4">
                <PriceSummary price={plan.price} />
                
                <StripeButton 
                  plan={plan}
                  onProcessingChange={setIsProcessing}
                  onComplete={() => setIsComplete(true)}
                  onSuccess={onSuccess}
                />
              </TabsContent>
            </Tabs>
            
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
