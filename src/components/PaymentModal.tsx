
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CreditCard } from 'lucide-react';

// Import refactored components
import CreditCardForm from './payment/CreditCardForm';
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
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
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
              onValueChange={(value) => setPaymentMethod(value as 'card' | 'paypal')}
              value={paymentMethod}
            >
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="card" className="flex items-center gap-2">
                  <CreditCard size={16} />
                  <span>Card</span>
                </TabsTrigger>
                <TabsTrigger value="paypal" className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.554 9.488c.121.563.106 1.246-.04 2.051-.582 2.978-2.477 4.466-5.683 4.466h-.442a.666.666 0 0 0-.641.547l-.743 3.642a.54.54 0 0 1-.524.422H7.904a.444.444 0 0 1-.431-.543l.099-.384.789-3.878.449-2.432.475-2.422a.475.475 0 0 1 .462-.371h2.073c.981 0 1.747.143 2.298.428.551.286.91.7 1.077 1.244.088.322.133.572.11.812a.858.858 0 0 1 0 .262l.021.128c.092.594.141.974.2 1.154a1.714 1.714 0 0 0 .437.727z" />
                    <path d="M7.904 18.626h3.566a.67.67 0 0 0 .642-.546l.741-3.647a.54.54 0 0 1 .524-.423h1.441c3.206 0 5.106-1.489 5.683-4.466.146-.805.161-1.488.04-2.051-.121-.574-.38-1.047-.769-1.418-.774-.78-2.143-1.177-4.108-1.177h-6.421c-.36 0-.668.259-.724.613l-2.58 12.715c-.43.255.131.508.387.508h1.578" fill="none" />
                  </svg>
                  <span>PayPal</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="card" className="space-y-4">
                <CreditCardForm 
                  plan={plan} 
                  isProcessing={isProcessing} 
                  onSubmit={handleSubmit} 
                />
              </TabsContent>
              
              <TabsContent value="paypal" className="flex flex-col items-center justify-center py-4">
                <PriceSummary price={plan.price} />
                
                <PayPalButton 
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
