
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { 
  getPremiumStatus, 
  clearPremiumStatus, 
  cancelSubscription, 
  getSubscriptionDetails, 
  PremiumStatus 
} from '@/utils/storage';
import { toast } from 'sonner';

// Import refactored components
import AccountHeader from '@/components/account/AccountHeader';
import SubscriptionStatus from '@/components/account/SubscriptionStatus';
import SubscriptionDetails from '@/components/account/SubscriptionDetails';
import AccountActions from '@/components/account/AccountActions';
import CancellationDialog from '@/components/account/CancellationDialog';
import AccountFooter from '@/components/account/AccountFooter';

const Account = () => {
  const navigate = useNavigate();
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus>({ isPremium: false });
  const [subscriptionDetails, setSubscriptionDetails] = useState<{id: string | null, period: string | null}>({
    id: null,
    period: null
  });
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  
  useEffect(() => {
    const status = getPremiumStatus();
    setPremiumStatus(status);
    
    const details = getSubscriptionDetails();
    setSubscriptionDetails(details);
  }, []);
  
  const handleLogout = () => {
    clearPremiumStatus();
    toast.success("Logged out successfully");
    navigate('/');
  };
  
  const handleCancelSubscription = () => {
    cancelSubscription();
    
    // Update local state
    const updatedStatus = getPremiumStatus();
    setPremiumStatus(updatedStatus);
    
    setShowCancelDialog(false);
    
    // If the user canceled through PayPal directly, this will update our local state
    toast.success("Your subscription has been canceled. You will have access until your current billing period ends.");
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  // Determine if the subscription can be canceled (only for monthly/yearly)
  const canCancelSubscription = () => {
    if (!premiumStatus.isPremium) return false;
    
    // Can only cancel recurring subscriptions, not lifetime
    const isRecurring = subscriptionDetails.period === 'month' || 
                        subscriptionDetails.period === 'year' || 
                        (premiumStatus.plan && 
                         (premiumStatus.plan.toLowerCase().includes('month') || 
                          premiumStatus.plan.toLowerCase().includes('annual')));
                          
    // Can't cancel if already canceled
    const notCanceled = premiumStatus.subscriptionStatus !== 'canceled';
    
    return isRecurring && notCanceled && premiumStatus.subscriptionId;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-culinary-cream to-white">
      <NavBar />
      
      <main className="pt-24 pb-16 px-4 container max-w-4xl mx-auto">
        <AccountHeader />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white/90 backdrop-blur-md border border-culinary-beige rounded-xl p-6 shadow-sm mb-8">
            <h1 className="text-2xl font-display font-medium mb-1">Account Settings</h1>
            <p className="text-muted-foreground mb-4">Manage your CopyCat Cuisine account</p>
            
            <SubscriptionStatus 
              premiumStatus={premiumStatus} 
              formatDate={formatDate} 
            />
            
            <SubscriptionDetails 
              premiumStatus={premiumStatus} 
              formatDate={formatDate}
            />
            
            <AccountActions 
              premiumStatus={premiumStatus}
              canCancelSubscription={canCancelSubscription}
              handleLogout={handleLogout}
              setShowCancelDialog={setShowCancelDialog}
            />
          </div>
        </motion.div>
      </main>
      
      <AccountFooter />
      
      <CancellationDialog 
        showCancelDialog={showCancelDialog}
        setShowCancelDialog={setShowCancelDialog}
        premiumStatus={premiumStatus}
        handleCancelSubscription={handleCancelSubscription}
      />
    </div>
  );
};

export default Account;
