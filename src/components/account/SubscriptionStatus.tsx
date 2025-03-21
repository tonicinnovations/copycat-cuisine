
import { AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PremiumStatus } from '@/utils/storage';

interface SubscriptionStatusProps {
  premiumStatus: PremiumStatus;
  formatDate: (dateString?: string) => string;
}

const SubscriptionStatus = ({ premiumStatus, formatDate }: SubscriptionStatusProps) => {
  return (
    <div className="flex items-center justify-between py-3 px-4 bg-culinary-cream/50 rounded-lg mb-4">
      <div>
        <h2 className="font-medium">Subscription Status</h2>
        <p className="text-sm text-muted-foreground">
          {premiumStatus.isPremium 
            ? `${premiumStatus.plan} (expires ${formatDate(premiumStatus.expiresAt)})` 
            : 'Free Plan'}
        </p>
        
        {premiumStatus.subscriptionStatus === 'canceled' && (
          <div className="flex items-center gap-1 mt-1 text-sm text-amber-600">
            <AlertCircle size={14} />
            <span>Your subscription is canceled but access continues until expiry</span>
          </div>
        )}
      </div>
      <Badge variant={premiumStatus.isPremium ? "default" : "outline"}>
        {premiumStatus.isPremium ? 'Premium' : 'Free'}
      </Badge>
    </div>
  );
};

export default SubscriptionStatus;
