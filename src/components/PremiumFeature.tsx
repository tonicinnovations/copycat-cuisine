
import { Lock, Sparkles } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface PremiumFeatureProps {
  children: React.ReactNode;
  isPremium?: boolean;
  featureName: string;
  className?: string;
}

const PremiumFeature = ({
  children,
  isPremium = false,
  featureName,
  className
}: PremiumFeatureProps) => {
  const navigate = useNavigate();
  
  if (isPremium) {
    return <div className={className}>{children}</div>;
  }
  
  const handleClick = () => {
    navigate('/pricing');
  };
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div
            onClick={handleClick}
            className={cn(
              "relative overflow-hidden cursor-pointer transition-all group",
              className
            )}
          >
            {/* Premium content overlay with improved styling */}
            <div className="absolute inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-10 transition-all">
              <div className="bg-culinary-copper text-white p-3 rounded-full shadow-lg transform transition-transform group-hover:scale-110">
                <Lock size={20} className="text-white" />
              </div>
            </div>
            
            {/* The actual premium content (blurred) */}
            <div className="opacity-60 filter blur-[2px] pointer-events-none">
              {children}
            </div>
            
            {/* Premium badge with animation */}
            <div className="absolute bottom-0 left-0 right-0 py-2 px-3 bg-gradient-to-r from-culinary-copper to-culinary-copper/80 text-white 
                        flex items-center justify-center gap-2 font-medium
                        transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <Sparkles size={16} className="animate-pulse-slow" />
              <span>Premium Feature</span>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="center" className="bg-white border border-culinary-beige shadow-lg p-2">
          <div className="flex items-start space-x-3 p-2">
            <div className="bg-culinary-copper/10 p-2 rounded-full">
              <Sparkles size={16} className="text-culinary-copper" />
            </div>
            <div>
              <p className="font-medium text-base text-culinary-charcoal">{featureName}</p>
              <p className="text-sm text-muted-foreground">Upgrade to Premium to unlock</p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PremiumFeature;
