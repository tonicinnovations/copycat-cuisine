
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface PremiumBannerProps {
  isPremium: boolean;
}

const PremiumBanner = ({ isPremium }: PremiumBannerProps) => {
  const navigate = useNavigate();
  
  if (isPremium) return null;
  
  return (
    <div className="bg-gradient-to-r from-culinary-copper/90 to-culinary-copper px-6 py-4 flex items-center justify-between text-white">
      <div className="flex items-center gap-2">
        <Sparkles size={18} className="animate-pulse" />
        <p className="font-medium">Unlock all premium features</p>
      </div>
      <Button 
        variant="secondary" 
        size="sm"
        className="bg-white text-culinary-copper hover:bg-white/90"
        onClick={() => navigate('/pricing')}
      >
        Upgrade Now
      </Button>
    </div>
  );
};

export default PremiumBanner;
