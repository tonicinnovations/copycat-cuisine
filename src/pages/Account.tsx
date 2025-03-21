
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NavBar from '@/components/NavBar';
import CancelSubscriptionButton from '@/components/payment/CancelSubscriptionButton';
import { 
  getPremiumStatus, 
  clearPremiumStatus, 
  cancelSubscription, 
  getSubscriptionDetails, 
  PremiumStatus 
} from '@/utils/storage';
import { toast } from 'sonner';

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
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/')}
          className="mb-6 text-sm border-culinary-beige hover:bg-culinary-cream"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Home
        </Button>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white/90 backdrop-blur-md border border-culinary-beige rounded-xl p-6 shadow-sm mb-8">
            <h1 className="text-2xl font-display font-medium mb-1">Account Settings</h1>
            <p className="text-muted-foreground mb-4">Manage your CopyCat Cuisine account</p>
            
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
            
            {premiumStatus.subscriptionId && (
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
            )}
            
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
          </div>
        </motion.div>
      </main>
      
      <footer className="py-6 border-t border-culinary-beige bg-white">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} CopyCat Cuisine. All rights reserved.</p>
          <p className="mt-1">Not affiliated with any restaurants or brands mentioned.</p>
        </div>
      </footer>
      
      {/* Cancel Subscription Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Your Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your subscription? You'll still have access to premium features until the end of your current billing period.
            </DialogDescription>
          </DialogHeader>
          
          {/* Updated dialog content with PayPal cancellation */}
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
    </div>
  );
};

export default Account;
