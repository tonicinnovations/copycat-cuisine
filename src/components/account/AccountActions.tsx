
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PremiumStatus } from '@/utils/storage';
import { toast } from 'sonner';

interface AccountActionsProps {
  premiumStatus: PremiumStatus;
  canCancelSubscription: () => boolean;
  handleLogout: () => void;
  setShowCancelDialog: (show: boolean) => void;
}

const AccountActions = ({ 
  premiumStatus, 
  canCancelSubscription, 
  handleLogout, 
  setShowCancelDialog 
}: AccountActionsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex gap-2 justify-end">
      {premiumStatus.isPremium ? (
        <>
          {canCancelSubscription() && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowCancelDialog(true)}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              Cancel Subscription
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/pricing')}
            className="border-culinary-beige hover:bg-culinary-beige/30"
          >
            Manage Subscription
          </Button>
        </>
      ) : (
        <Button 
          variant="default" 
          size="sm" 
          onClick={() => navigate('/pricing')}
        >
          Upgrade to Premium
        </Button>
      )}
      
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={handleLogout}
      >
        Log Out
      </Button>
    </div>
  );
};

export default AccountActions;
