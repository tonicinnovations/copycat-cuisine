import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import NavBar from '@/components/NavBar';
import PricingCard from '@/components/PricingCard';
import PaymentModal from '@/components/PaymentModal';
import { getPremiumStatus, setPremiumStatus } from '@/utils/storage';
import { toast } from 'sonner';

const Pricing = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<{
    name: string;
    price: string;
    period: string;
  } | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  
  useEffect(() => {
    const status = getPremiumStatus();
    setIsPremium(status.isPremium);
  }, []);
  
  const handleSelectPlan = (name: string, price: string, period: string) => {
    setSelectedPlan({ name, price, period });
    setShowPaymentModal(true);
  };
  
  const handlePaymentSuccess = () => {
    // Set premium status with expiry date based on selected plan
    const now = new Date();
    let expiryDate = new Date();
    
    if (selectedPlan?.period === 'month') {
      expiryDate.setMonth(now.getMonth() + 1);
    } else if (selectedPlan?.period === 'year') {
      expiryDate.setFullYear(now.getFullYear() + 1);
    } else {
      // Lifetime plan - set to a far future date
      expiryDate.setFullYear(now.getFullYear() + 100);
    }
    
    setPremiumStatus({
      isPremium: true,
      plan: selectedPlan?.name,
      expiresAt: expiryDate.toISOString()
    });
    
    setIsPremium(true);
    
    // Wait a bit before redirecting to allow toast to be seen
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };
  
  if (isPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-culinary-cream to-white">
        <NavBar />
        
        <main className="pt-24 pb-16 px-4 container max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-culinary-copper rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={32} className="text-white" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-display font-medium mb-4">
              You're Premium!
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8">
              Thank you for your support. You now have access to all premium features.
            </p>
            
            <div className="bg-white/80 backdrop-blur-sm border border-culinary-beige rounded-xl p-6 shadow-sm mb-8">
              <h2 className="text-xl font-medium mb-4">Your Premium Benefits</h2>
              
              <ul className="space-y-3 text-left">
                <PremiumFeature>Unlimited recipe searches</PremiumFeature>
                <PremiumFeature>Print recipes</PremiumFeature>
                <PremiumFeature>Share recipes</PremiumFeature>
                <PremiumFeature>Adjust portion sizes</PremiumFeature>
                <PremiumFeature>Access to video tutorials</PremiumFeature>
                <PremiumFeature>Dietary substitutions</PremiumFeature>
              </ul>
            </div>
            
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-culinary-copper text-white rounded-full hover:bg-culinary-copper/90 transition-colors"
            >
              Start Exploring
            </button>
          </motion.div>
        </main>
        
        <footer className="py-6 border-t border-culinary-beige bg-white">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} CopyCat Cuisine. All rights reserved.</p>
          </div>
        </footer>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-culinary-cream to-white">
      <NavBar />
      
      <main className="pt-24 pb-16 px-4 container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium mb-4">
            Upgrade to Premium
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Unlock all features and enjoy unlimited recipe searches with a premium subscription.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <PricingCard
              title="Monthly"
              price="$2.99"
              period="month"
              description="Perfect for short-term culinary adventures"
              features={[
                "Unlimited recipe searches",
                "Print recipes",
                "Share recipes", 
                "Adjust portion sizes",
                "Access to video tutorials",
                "Dietary substitutions"
              ]}
              ctaText="Subscribe Monthly"
              onSelect={() => handleSelectPlan("Monthly", "$2.99", "month")}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <PricingCard
              title="Annual"
              price="$29.99"
              period="year"
              description="Our most popular plan - save over 15%"
              features={[
                "Unlimited recipe searches",
                "Print recipes",
                "Share recipes", 
                "Adjust portion sizes",
                "Access to video tutorials",
                "Dietary substitutions",
                "Priority customer support"
              ]}
              isPopular
              ctaText="Subscribe Annually"
              onSelect={() => handleSelectPlan("Annual", "$29.99", "year")}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <PricingCard
              title="Lifetime"
              price="$99.99"
              period="one-time"
              description="One payment, unlimited access forever"
              features={[
                "Unlimited recipe searches",
                "Print recipes",
                "Share recipes", 
                "Adjust portion sizes",
                "Access to video tutorials",
                "Dietary substitutions",
                "Priority customer support",
                "Free future updates"
              ]}
              ctaText="Get Lifetime Access"
              onSelect={() => handleSelectPlan("Lifetime", "$99.99", "lifetime")}
            />
          </motion.div>
        </div>
        
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-display font-medium mb-6 text-center">
            What's Included in Premium?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Feature 
              title="Unlimited Recipe Searches" 
              description="Search for as many restaurant and store copycat recipes as you want, whenever you want."
            />
            <Feature 
              title="Print & Share Recipes" 
              description="Easily print recipes for your kitchen or share them with friends and family."
            />
            <Feature 
              title="Adjust Portion Sizes" 
              description="Scale recipes up or down to get the perfect amount for your needs."
            />
            <Feature 
              title="Video Tutorials" 
              description="Access video guides that show you exactly how to make each recipe."
            />
            <Feature 
              title="Dietary Substitutions" 
              description="Get suggestions for ingredient alternatives to match your dietary preferences."
            />
            <Feature 
              title="Premium Support" 
              description="Get priority assistance if you ever need help with the app."
            />
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            All plans include a 30-day money-back guarantee. No questions asked.
          </p>
        </div>
      </main>
      
      <footer className="py-6 border-t border-culinary-beige bg-white">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} CopyCat Cuisine. All rights reserved.</p>
          <p className="mt-1">Have questions? Contact us at support@copycatcuisine.com</p>
        </div>
      </footer>
      
      <PaymentModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        plan={selectedPlan}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

const PremiumFeature = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start">
    <Check size={18} className="text-culinary-copper mt-0.5 mr-2 flex-shrink-0" />
    <span>{children}</span>
  </li>
);

interface FeatureProps {
  title: string;
  description: string;
}

const Feature = ({ title, description }: FeatureProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white/60 backdrop-blur-sm border border-culinary-beige rounded-lg p-5 shadow-sm"
  >
    <h3 className="text-lg font-medium mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </motion.div>
);

export default Pricing;
