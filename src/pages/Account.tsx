
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, CreditCard, LogOut, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import NavBar from '@/components/NavBar';
import { getPremiumStatus, clearPremiumStatus } from '@/utils/storage';
import { toast } from '@/components/ui/sonner';

interface PremiumStatus {
  isPremium: boolean;
  plan?: string;
  expiresAt?: string;
}

const Account = () => {
  const navigate = useNavigate();
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus>({ isPremium: false });
  
  useEffect(() => {
    const status = getPremiumStatus();
    setPremiumStatus(status);
  }, []);
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const handleLogout = () => {
    // In a real app, this would involve authentication
    // For this demo, we'll just clear premium status
    clearPremiumStatus();
    toast.success("You've been signed out");
    navigate('/');
  };
  
  const handleUpgrade = () => {
    navigate('/pricing');
  };
  
  // Simulate user data
  const user = {
    name: "Culinary Explorer",
    email: "chef@example.com",
    searchesRemaining: premiumStatus.isPremium ? "Unlimited" : "3",
    joinDate: "January 15, 2023"
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-culinary-cream to-white">
      <NavBar />
      
      <main className="pt-24 pb-16 px-4 container max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 backdrop-blur-sm border border-culinary-beige rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-culinary-cream rounded-full flex items-center justify-center mr-4">
              <User size={24} className="text-culinary-copper" />
            </div>
            <div>
              <div className="flex items-center">
                <h1 className="text-2xl font-display font-medium mr-2">{user.name}</h1>
                {premiumStatus.isPremium ? (
                  <Badge className="bg-culinary-copper hover:bg-culinary-copper/90">Premium</Badge>
                ) : (
                  <Badge variant="outline" className="border-culinary-beige text-muted-foreground">
                    Free Plan
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
          
          <Separator className="my-6 bg-culinary-beige/50" />
          
          <div className="space-y-6">
            <h2 className="text-lg font-medium">Account Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard
                title="Membership"
                value={premiumStatus.isPremium ? premiumStatus.plan || "Premium" : "Free Plan"}
              />
              <InfoCard
                title="Searches Remaining"
                value={user.searchesRemaining}
              />
              <InfoCard
                title="Member Since"
                value={user.joinDate}
              />
              {premiumStatus.isPremium && (
                <InfoCard
                  title="Premium Expires"
                  value={formatDate(premiumStatus.expiresAt)}
                />
              )}
            </div>
            
            {premiumStatus.isPremium ? (
              <div className="bg-culinary-cream/50 rounded-lg p-4 mt-6">
                <h3 className="font-medium mb-2">Premium Benefits Active</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  You have full access to all premium features including unlimited searches, 
                  printing, sharing, portion adjustments, and dietary substitutions.
                </p>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-culinary-copper text-culinary-copper hover:bg-culinary-cream"
                    onClick={() => navigate('/')}
                  >
                    Start Searching
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-culinary-cream/50 rounded-lg p-4 mt-6">
                <h3 className="font-medium mb-2">Upgrade to Premium</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get unlimited recipe searches and access to all premium features 
                  by upgrading to a premium plan.
                </p>
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    className="bg-culinary-copper hover:bg-culinary-copper/90"
                    onClick={handleUpgrade}
                  >
                    Upgrade Now
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>
              </div>
            )}
            
            <Separator className="my-6 bg-culinary-beige/50" />
            
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div>
                <h2 className="text-lg font-medium mb-1">Account Actions</h2>
                <p className="text-sm text-muted-foreground">Manage your account settings</p>
              </div>
              
              <div className="flex gap-2">
                {premiumStatus.isPremium && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <CreditCard size={16} />
                    <span>Billing</span>
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 border-red-200 text-red-600 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
      
      <footer className="py-6 border-t border-culinary-beige bg-white">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} CopyCat Cuisine. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

interface InfoCardProps {
  title: string;
  value: string;
}

const InfoCard = ({ title, value }: InfoCardProps) => (
  <div className="bg-white border border-culinary-beige rounded-lg p-4">
    <p className="text-sm text-muted-foreground mb-1">{title}</p>
    <p className="font-medium">{value}</p>
  </div>
);

export default Account;
