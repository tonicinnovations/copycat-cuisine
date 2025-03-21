
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import NavBar from '@/components/NavBar';
import { getPremiumStatus, clearPremiumStatus } from '@/utils/storage';
import { toast } from 'sonner';
import { getApiKey, setApiKey } from '@/utils/api';

interface PremiumStatus {
  isPremium: boolean;
  plan?: string;
  expiresAt?: string;
}

const Account = () => {
  const navigate = useNavigate();
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus>({ isPremium: false });
  const [apiKey, setApiKeyState] = useState<string>('');
  const [showApiKey, setShowApiKey] = useState(false);
  
  useEffect(() => {
    const status = getPremiumStatus();
    setPremiumStatus(status);
    
    const savedApiKey = getApiKey();
    if (savedApiKey) {
      setApiKeyState(savedApiKey);
    }
  }, []);
  
  const handleLogout = () => {
    clearPremiumStatus();
    toast.success("Logged out successfully");
    navigate('/');
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
  
  const handleApiKeySave = () => {
    if (apiKey.trim()) {
      setApiKey(apiKey.trim());
      toast.success("API key saved successfully");
    } else {
      toast.error("Please enter a valid API key");
    }
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
              </div>
              <Badge variant={premiumStatus.isPremium ? "default" : "outline"}>
                {premiumStatus.isPremium ? 'Premium' : 'Free'}
              </Badge>
            </div>
            
            <div className="flex gap-2 justify-end">
              {premiumStatus.isPremium ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/pricing')}
                  className="border-culinary-beige hover:bg-culinary-beige/30"
                >
                  Manage Subscription
                </Button>
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
          
          <div className="bg-white/90 backdrop-blur-md border border-culinary-beige rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-display font-medium mb-4">OpenAI API Key</h2>
            <p className="text-muted-foreground mb-6">
              Enter your OpenAI API key to enable real recipe generation.
            </p>
            
            <div className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="apiKey">API Key</Label>
                <div className="flex">
                  <Input
                    id="apiKey"
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKeyState(e.target.value)}
                    placeholder="sk-..."
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="ml-2"
                    type="button"
                  >
                    {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>
              
              <Button 
                onClick={handleApiKeySave}
                className="mt-2"
              >
                Save API Key
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
    </div>
  );
};

export default Account;
