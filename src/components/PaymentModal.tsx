
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CreditCard } from 'lucide-react';

// Import payment components
import CreditCardForm from './payment/CreditCardForm';
import StripeButton from './payment/StripeButton';
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
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('paypal');
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
              defaultValue="paypal" 
              className="px-6"
              onValueChange={(value) => setPaymentMethod(value as 'card' | 'paypal')}
              value={paymentMethod}
            >
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="paypal" className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.1 6.35c.2.94.1 1.8-.1 2.96-.7 3.8-3.2 5.8-7.1 5.8h-.5c-.4 0-.7.3-.8.7l-.1.4-.8 5.1c-.1.4-.4.6-.8.6H6.5c-.4 0-.7-.4-.6-.8l1.3-8.1c0-.2.2-.3.4-.3h1.5c4.8 0 8.5-1.9 9.5-7.3.1-.3.1-.5.2-.8.1-.2.3-.1.3-.1z" />
                    <path d="M8.9 6.85c.2-1.3 1.3-2.3 2.7-2.3h3.6c.4 0 .8.1 1.2.1-1.1 5.1-4.9 7.8-10.2 7.8H4.5c-.4 0-.7.4-.6.8l1.9 12c.1.3.4.6.7.6h3.4c.4 0 .7-.3.8-.7l.6-3.8c.1-.4.4-.7.8-.7h.5c3.9 0 6.9-1.9 7.8-6 .3-1.5.1-2.8-.6-3.7.1-.4 0-.8-.1-1.2.1-1 0-2-1.2-2.9-.9-.7-2.2-1-3.8-1H8.9v.9z" />
                  </svg>
                  <span>PayPal or Card</span>
                </TabsTrigger>
                <TabsTrigger value="card" className="flex items-center gap-2">
                  <CreditCard size={16} />
                  <span>Direct Card</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="paypal" className="flex flex-col items-center justify-center py-4">
                <PriceSummary price={plan.price} />
                
                <div className="mb-3 text-center text-sm text-muted-foreground">
                  Pay securely with PayPal or any credit/debit card without a PayPal account
                </div>
                
                <PayPalButton 
                  plan={plan}
                  onProcessingChange={setIsProcessing}
                  onComplete={() => setIsComplete(true)}
                  onSuccess={onSuccess}
                />
              </TabsContent>
              
              <TabsContent value="card" className="space-y-4">
                <CreditCardForm 
                  plan={plan} 
                  isProcessing={isProcessing} 
                  onSubmit={handleSubmit} 
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
