
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CancelSubscriptionButton from '@/components/payment/CancelSubscriptionButton';
import { PremiumStatus } from '@/utils/storage';

interface CancellationDialogProps {
  showCancelDialog: boolean;
  setShowCancelDialog: (show: boolean) => void;
  premiumStatus: PremiumStatus;
  handleCancelSubscription: () => void;
}

const CancellationDialog = ({
  showCancelDialog,
  setShowCancelDialog,
  premiumStatus,
  handleCancelSubscription
}: CancellationDialogProps) => {
  return (
    <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Your Subscription</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel your subscription? You'll still have access to premium features until the end of your current billing period.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Your subscription will be canceled through PayPal. You will not be charged for the next billing period.
          </p>
          
          {premiumStatus.subscriptionId && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-800 text-sm mb-4">
              <p className="font-medium">Important</p>
              <p>This will cancel your PayPal subscription. This action cannot be undone.</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
            Keep Subscription
          </Button>
          
          {premiumStatus.subscriptionId ? (
            <CancelSubscriptionButton 
              subscriptionId={premiumStatus.subscriptionId}
              onCancelled={handleCancelSubscription}
            />
          ) : (
            <Button variant="destructive" onClick={handleCancelSubscription}>
              Yes, Cancel
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancellationDialog;
