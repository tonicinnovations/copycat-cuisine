
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface CreditCardFormProps {
  plan: {
    name: string;
    price: string;
    period: string;
  };
  isProcessing: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const CreditCardForm = ({ plan, isProcessing, onSubmit }: CreditCardFormProps) => {
  return (
    <form onSubmit={onSubmit}>
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
  );
};

export default CreditCardForm;
