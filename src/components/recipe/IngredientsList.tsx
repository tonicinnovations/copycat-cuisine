
import DietarySubstitutions from './DietarySubstitutions';

type SubstitutionType = 'vegan' | 'glutenFree' | 'dairyFree' | null;

interface IngredientsListProps {
  ingredients: string[];
  isPremium: boolean;
  showSubstitutions: boolean;
  activeSubstitution: SubstitutionType;
  toggleSubstitutions: () => void;
  selectSubstitution: (type: 'vegan' | 'glutenFree' | 'dairyFree') => void;
}

const IngredientsList = ({
  ingredients,
  isPremium,
  showSubstitutions,
  activeSubstitution,
  toggleSubstitutions,
  selectSubstitution
}: IngredientsListProps) => {
  return (
    <div className="md:col-span-1">
      <h2 className="text-xl font-display font-medium mb-4">Ingredients</h2>
      
      <DietarySubstitutions 
        isPremium={isPremium}
        showSubstitutions={showSubstitutions}
        activeSubstitution={activeSubstitution}
        toggleSubstitutions={toggleSubstitutions}
        selectSubstitution={selectSubstitution}
      />

      <ul className="space-y-2">
        {ingredients.map((ingredient, index) => (
          <li key={index} className="flex items-baseline gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-culinary-copper flex-shrink-0 mt-1.5"></span>
            <span>{ingredient}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IngredientsList;
