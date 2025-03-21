
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import PaymentModal from '@/components/PaymentModal';
import { getPremiumStatus, setPremiumStatus } from '@/utils/storage';
import { toast } from 'sonner';

// Import refactored components
import PricingHeader from '@/components/pricing/PricingHeader';
import PricingPlans from '@/components/pricing/PricingPlans';
import FeaturesSection from '@/components/pricing/FeaturesSection';
import PricingFooter from '@/components/pricing/PricingFooter';
import PremiumBenefits from '@/components/pricing/PremiumBenefits';

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
          <PremiumBenefits />
        </main>
        
        <PricingFooter />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-culinary-cream to-white">
      <NavBar />
      
      <main className="pt-24 pb-16 px-4 container max-w-6xl mx-auto">
        <PricingHeader />
        <PricingPlans onSelectPlan={handleSelectPlan} />
        <FeaturesSection />
      </main>
      
      <PricingFooter />
      
      <PaymentModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        plan={selectedPlan}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default Pricing;
