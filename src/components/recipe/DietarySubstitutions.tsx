
import { ArrowDown, LeafIcon, Milk, WheatOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PremiumFeature from '@/components/PremiumFeature';
import { cn } from '@/lib/utils';

type SubstitutionType = 'vegan' | 'glutenFree' | 'dairyFree' | null;

interface DietarySubstitutionsProps {
  isPremium: boolean;
  showSubstitutions: boolean;
  activeSubstitution: SubstitutionType;
  toggleSubstitutions: () => void;
  selectSubstitution: (type: 'vegan' | 'glutenFree' | 'dairyFree') => void;
}

const DietarySubstitutions = ({
  isPremium,
  showSubstitutions,
  activeSubstitution,
  toggleSubstitutions,
  selectSubstitution
}: DietarySubstitutionsProps) => {
  return (
    <>
      <PremiumFeature
        isPremium={isPremium}
        featureName="Dietary Substitutions"
        className="mb-3"
      >
        <Button 
          variant={showSubstitutions ? "secondary" : "outline"}
          size="sm"
          className={cn(
            "w-full mb-4 text-sm border-culinary-beige flex items-center justify-center gap-2",
            showSubstitutions && "bg-culinary-beige text-culinary-charcoal"
          )}
          onClick={toggleSubstitutions}
          disabled={!isPremium}
        >
          <ArrowDown size={14} className="mr-1" />
          Dietary Substitutions
        </Button>
      </PremiumFeature>

      {/* Substitution options */}
      {isPremium && showSubstitutions && (
        <div className="mb-4 flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={activeSubstitution === 'vegan' ? 'default' : 'outline'}
            className={cn(
              "text-xs",
              activeSubstitution === 'vegan' ? "bg-green-600 hover:bg-green-700" : "border-green-600 text-green-600 hover:bg-green-50"
            )}
            onClick={() => selectSubstitution('vegan')}
          >
            <LeafIcon size={14} className="mr-1" />
            Vegan
          </Button>
          <Button
            size="sm"
            variant={activeSubstitution === 'glutenFree' ? 'default' : 'outline'}
            className={cn(
              "text-xs",
              activeSubstitution === 'glutenFree' ? "bg-amber-600 hover:bg-amber-700" : "border-amber-600 text-amber-600 hover:bg-amber-50"
            )}
            onClick={() => selectSubstitution('glutenFree')}
          >
            <WheatOff size={14} className="mr-1" />
            Gluten-Free
          </Button>
          <Button
            size="sm"
            variant={activeSubstitution === 'dairyFree' ? 'default' : 'outline'}
            className={cn(
              "text-xs",
              activeSubstitution === 'dairyFree' ? "bg-blue-600 hover:bg-blue-700" : "border-blue-600 text-blue-600 hover:bg-blue-50"
            )}
            onClick={() => selectSubstitution('dairyFree')}
          >
            <Milk size={14} className="mr-1" />
            Dairy-Free
          </Button>
        </div>
      )}
    </>
  );
};

export default DietarySubstitutions;
