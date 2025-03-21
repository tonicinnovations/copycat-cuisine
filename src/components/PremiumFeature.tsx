
import { Lock, Info } from 'lucide-react';
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
              "relative overflow-hidden filter blur-[1px] cursor-pointer transition-all",
              "hover:blur-none group",
              className
            )}
          >
            <div className="absolute inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="bg-white/80 backdrop-blur-sm p-2 rounded-full">
                <Lock size={16} className="text-culinary-copper" />
              </div>
            </div>
            <div className="opacity-50 pointer-events-none">
              {children}
            </div>
            <div className="absolute bottom-0 left-0 right-0 py-1 px-2 bg-culinary-copper/90 text-white text-xs font-medium
                          transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              Premium Feature
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-white border border-culinary-beige">
          <div className="flex items-start space-x-2 p-1">
            <Info size={14} className="text-culinary-copper mt-0.5" />
            <div>
              <p className="font-medium text-sm">{featureName}</p>
              <p className="text-xs text-muted-foreground">Upgrade to Premium to unlock</p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PremiumFeature;
