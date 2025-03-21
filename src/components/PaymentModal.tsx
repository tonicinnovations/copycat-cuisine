
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Loader2, CreditCard, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

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

declare global {
  interface Window {
    paypal?: {
      Buttons: (options: any) => {
        render: (element: string | HTMLElement) => void;
      };
    };
  }
}

// Your PayPal client ID - Replace this with your actual production client ID
const PAYPAL_CLIENT_ID = "YOUR_PRODUCTION_CLIENT_ID";

const PaymentModal = ({ open, onClose, plan, onSuccess }: PaymentModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  
  // Load PayPal SDK when the modal opens and paypal is selected
  useEffect(() => {
    if (open && paymentMethod === 'paypal' && !paypalLoaded && !window.paypal) {
      const script = document.createElement('script');
      // Use production PayPal SDK with your client ID
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`;
      script.addEventListener('load', () => {
        setPaypalLoaded(true);
      });
      document.body.appendChild(script);
      
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [open, paymentMethod, paypalLoaded]);
  
  // Initialize PayPal buttons when the SDK is loaded
  useEffect(() => {
    if (paypalLoaded && window.paypal && plan && paymentMethod === 'paypal') {
      const paypalButtonsContainer = document.getElementById('paypal-button-container');
      if (paypalButtonsContainer) {
        paypalButtonsContainer.innerHTML = '';
        
        window.paypal.Buttons({
          // Create order with the actual amount from the selected plan
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: plan.price.replace('$', '')
                },
                description: `CopyCat Cuisine ${plan.name} Plan`
              }]
            });
          },
          // Handle successful payment
          onApprove: (data: any, actions: any) => {
            setIsProcessing(true);
            
            // Process the actual payment
            return actions.order.capture().then(function(details: any) {
              // Payment is completed - you can now record the transaction in your database
              console.log('Transaction completed by ' + details.payer.name.given_name);
              
              setIsProcessing(false);
              setIsComplete(true);
              
              // After showing success state, close modal and call success callback
              setTimeout(() => {
                onClose();
                onSuccess();
              }, 2000);
            });
          },
          // Handle payment errors
          onError: (err: any) => {
            console.error('PayPal Error:', err);
            toast.error('There was an error processing your payment');
            setIsProcessing(false);
          }
        }).render('#paypal-button-container');
      }
    }
  }, [paypalLoaded, plan, paymentMethod, onClose, onSuccess]);
  
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
  
  if (!plan) return null;
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
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
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="name">Cardholder Name</Label>
                        <Input id="name" placeholder="John Doe" required />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="card">Card Number</Label>
                        <Input id="card" placeholder="4242 4242 4242 4242" required />
                      </div>
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" required />
                      </div>
                      <div>
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" required />
                      </div>
                    </div>
                    
                    <div className="bg-culinary-cream/50 p-3 rounded-lg">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Subtotal</span>
                        <span className="text-sm font-medium">{plan.price}</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Tax</span>
                        <span className="text-sm font-medium">Calculated at checkout</span>
                      </div>
                      <div className="flex justify-between font-medium mt-2 pt-2 border-t border-culinary-beige">
                        <span>Total</span>
                        <span>{plan.price}</span>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-culinary-copper hover:bg-culinary-copper/90"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        `Pay ${plan.price}`
                      )}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="paypal" className="flex flex-col items-center justify-center py-4">
                <div className="bg-culinary-cream/50 p-3 rounded-lg w-full mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Subtotal</span>
                    <span className="text-sm font-medium">{plan.price}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Tax</span>
                    <span className="text-sm font-medium">Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between font-medium mt-2 pt-2 border-t border-culinary-beige">
                    <span>Total</span>
                    <span>{plan.price}</span>
                  </div>
                </div>
                
                {paypalLoaded ? (
                  <div id="paypal-button-container" className="w-full min-h-[150px]"></div>
                ) : (
                  <Button 
                    onClick={handleSubmit}
                    className="w-full bg-[#0070BA] hover:bg-[#005ea6]"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Pay with PayPal"
                    )}
                  </Button>
                )}
                <p className="text-xs text-center text-muted-foreground mt-3">
                  You will be redirected to PayPal to complete your payment.
                </p>
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
