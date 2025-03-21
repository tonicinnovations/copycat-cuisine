
import { Minus, Plus, Utensils } from 'lucide-react';
import PremiumFeature from '@/components/PremiumFeature';
import { cn } from '@/lib/utils';

interface RecipeDetailsProps {
  prepTime: string;
  cookTime: string;
  servings: number;
  originalServings: number;
  isPremium: boolean;
  onServingChange: (increment: boolean) => void;
}

const RecipeDetails = ({
  prepTime,
  cookTime,
  servings,
  originalServings,
  isPremium,
  onServingChange
}: RecipeDetailsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="flex items-center p-3 bg-culinary-cream rounded-lg">
        <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full mr-3">
          <Utensils size={16} className="text-culinary-copper" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Prep Time</p>
          <p className="font-medium">{prepTime}</p>
        </div>
      </div>
      
      <div className="flex items-center p-3 bg-culinary-cream rounded-lg">
        <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full mr-3">
          <Utensils size={16} className="text-culinary-copper" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Cook Time</p>
          <p className="font-medium">{cookTime}</p>
        </div>
      </div>
      
      <div className="flex items-center p-3 bg-culinary-cream rounded-lg">
        <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full mr-3">
          <Utensils size={16} className="text-culinary-copper" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Servings</p>
          <div className="flex items-center gap-2">
            <PremiumFeature
              isPremium={isPremium}
              featureName="Adjust Portion Size"
              className="flex items-center gap-2"
            >
              <button
                onClick={() => onServingChange(false)}
                disabled={!isPremium || servings <= 1}
                className={cn(
                  "w-5 h-5 flex items-center justify-center rounded",
                  "bg-white text-culinary-charcoal border border-culinary-beige",
                  "hover:bg-culinary-beige/50 transition-colors",
                  (!isPremium || servings <= 1) && "opacity-50 cursor-not-allowed"
                )}
              >
                <Minus size={12} />
              </button>
              <span className="font-medium">{servings}</span>
              <button
                onClick={() => onServingChange(true)}
                disabled={!isPremium}
                className={cn(
                  "w-5 h-5 flex items-center justify-center rounded",
                  "bg-white text-culinary-charcoal border border-culinary-beige",
                  "hover:bg-culinary-beige/50 transition-colors",
                  !isPremium && "opacity-50 cursor-not-allowed"
                )}
              >
                <Plus size={12} />
              </button>
            </PremiumFeature>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
