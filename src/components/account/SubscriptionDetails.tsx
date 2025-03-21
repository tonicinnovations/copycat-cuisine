
import { PremiumStatus } from '@/utils/storage';

interface SubscriptionDetailsProps {
  premiumStatus: PremiumStatus;
  formatDate: (dateString?: string) => string;
}

const SubscriptionDetails = ({ premiumStatus, formatDate }: SubscriptionDetailsProps) => {
  if (!premiumStatus.subscriptionId) return null;
  
  return (
    <div className="bg-white/80 border border-culinary-beige rounded-lg p-4 mb-4">
      <h3 className="font-medium mb-2">Subscription Details</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="text-muted-foreground">Subscription ID:</div>
        <div>{premiumStatus.subscriptionId.substring(0, 12)}...</div>
        
        <div className="text-muted-foreground">Status:</div>
        <div className="capitalize">{premiumStatus.subscriptionStatus || 'active'}</div>
        
        <div className="text-muted-foreground">Plan:</div>
        <div>{premiumStatus.plan}</div>
        
        <div className="text-muted-foreground">Next billing date:</div>
        <div>{formatDate(premiumStatus.expiresAt)}</div>
      </div>
    </div>
  );
};

export default SubscriptionDetails;
