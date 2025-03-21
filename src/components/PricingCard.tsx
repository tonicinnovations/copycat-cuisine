
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  ctaText: string;
  onSelect: () => void;
}

const PricingCard = ({
  title,
  price,
  period,
  description,
  features,
  isPopular = false,
  ctaText,
  onSelect
}: PricingCardProps) => {
  return (
    <div 
      className={cn(
        "relative flex flex-col h-full",
        "backdrop-blur-sm border rounded-xl overflow-hidden transition-all",
        "hover:translate-y-[-4px] hover:shadow-lg",
        isPopular 
          ? "bg-white/90 border-culinary-copper shadow-md" 
          : "bg-white/75 border-culinary-beige shadow-sm"
      )}
    >
      {isPopular && (
        <div className="absolute top-0 right-0 w-40 h-20 overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-1/4 rotate-45 bg-culinary-copper text-white text-xs font-medium py-1 px-10 shadow-md">
            Most Popular
          </div>
        </div>
      )}
      
      <div className="p-6 flex-1">
        <h3 className="text-xl font-display font-medium mb-1">{title}</h3>
        <p className="text-muted-foreground mb-4 text-sm">{description}</p>
        
        <div className="mb-6">
          <div className="flex items-end">
            <span className="text-3xl font-display font-medium">{price}</span>
            <span className="text-muted-foreground ml-1">/{period}</span>
          </div>
        </div>
        
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex">
              <Check 
                size={18} 
                className={isPopular ? "text-culinary-copper mr-2" : "text-green-500 mr-2"} 
              />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="p-6 pt-0 mt-auto">
        <Button 
          onClick={onSelect}
          className={cn(
            "w-full", 
            isPopular 
              ? "bg-culinary-copper hover:bg-culinary-copper/90" 
              : "bg-culinary-charcoal hover:bg-culinary-charcoal/90"
          )}
        >
          {ctaText}
        </Button>
      </div>
    </div>
  );
};

export default PricingCard;
