
import { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { saveRecipe, getFavoriteRecipes, removeSavedRecipe } from '@/utils/storage';
import { scaleIngredient, getSubstitutedIngredient } from '@/utils/substitutions';

// Import new components
import RecipeHeader from './recipe/RecipeHeader';
import RecipeRating from './recipe/RecipeRating';
import RecipeDetails from './recipe/RecipeDetails';
import IngredientsList from './recipe/IngredientsList';
import InstructionsList from './recipe/InstructionsList';
import RecipeNotes from './recipe/RecipeNotes';
import PremiumBanner from './recipe/PremiumBanner';

interface RecipeCardProps {
  recipe: {
    id?: string;
    title: string;
    originalSource: string;
    ingredients: string[];
    instructions: string[];
    prepTime: string;
    cookTime: string;
    servings: number;
    notes?: string;
    sourcesUsed?: string;
    recipeImage?: string;
  };
  isPremium?: boolean;
}

type SubstitutionType = 'vegan' | 'glutenFree' | 'dairyFree' | null;

const RecipeCard = ({ recipe, isPremium = false }: RecipeCardProps) => {
  const [servings, setServings] = useState(recipe.servings);
  const [expanded, setExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [rating, setRating] = useState(0);
  const [showSubstitutions, setShowSubstitutions] = useState(false);
  const [activeSubstitution, setActiveSubstitution] = useState<SubstitutionType>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!recipe.id) {
      recipe.id = `recipe-${recipe.title.toLowerCase().replace(/\s+/g, '-')}`;
    }
    
    // Check if recipe is saved
    const checkIfSaved = async () => {
      const favorites = await getFavoriteRecipes();
      const saved = favorites.find(fav => fav.id === recipe.id);
      if (saved) {
        setIsSaved(true);
        setRating(saved.rating || 0);
      }
    };
    
    checkIfSaved();
  }, [recipe]);
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${recipe.title} Recipe | CopyCat Cuisine`,
          text: `Check out this copycat recipe for ${recipe.title}!`,
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(window.location.href);
        // Using the imported toast from sonner in the actual component
        // toast.success("Link copied to clipboard");
      }
    } catch (error) {
      console.error('Error sharing recipe:', error);
    }
  };
  
  const handleServingChange = (increment: boolean) => {
    if (increment) {
      setServings(prev => prev + 1);
    } else if (servings > 1) {
      setServings(prev => prev - 1);
    }
  };
  
  const handleSaveRecipe = () => {
    if (isSaved) {
      removeSavedRecipe(recipe.id as string);
      setIsSaved(false);
    } else {
      saveRecipe({ ...recipe, rating });
      setIsSaved(true);
    }
  };
  
  const handleRating = (newRating: number) => {
    setRating(newRating);
    if (isSaved) {
      // Update the saved recipe with the new rating
      saveRecipe({ ...recipe, rating: newRating });
    }
  };

  const toggleSubstitutions = () => {
    setShowSubstitutions(!showSubstitutions);
    if (showSubstitutions) {
      setActiveSubstitution(null);
    }
  };

  const selectSubstitution = (type: 'vegan' | 'glutenFree' | 'dairyFree') => {
    setActiveSubstitution(type === activeSubstitution ? null : type);
  };
  
  // Process ingredients - first scale them, then apply substitutions if needed
  const scaledIngredients = recipe.ingredients.map(ingredient => 
    scaleIngredient(ingredient, recipe.servings, servings)
  );

  const displayIngredients = activeSubstitution 
    ? scaledIngredients.map(ingredient => getSubstitutedIngredient(ingredient, activeSubstitution))
    : scaledIngredients;
  
  return (
    <div className={cn(
      "w-full max-w-3xl mx-auto overflow-hidden transition-all",
      "bg-white/90 backdrop-blur-md border border-culinary-beige",
      "shadow-md rounded-2xl print:shadow-none print:border-0"
    )}>
      <div className="p-6 md:p-8">
        <RecipeHeader
          title={recipe.title}
          originalSource={recipe.originalSource}
          isSaved={isSaved}
          isPremium={isPremium}
          onSave={handleSaveRecipe}
          onPrint={handlePrint}
          onShare={handleShare}
          sourcesUsed={recipe.sourcesUsed}
          recipeImage={recipe.recipeImage}
        />
        
        <RecipeRating 
          rating={rating} 
          onRate={handleRating}
          isPremium={isPremium}
        />
        
        <RecipeDetails
          prepTime={recipe.prepTime}
          cookTime={recipe.cookTime}
          servings={servings}
          originalServings={recipe.servings}
          isPremium={isPremium}
          onServingChange={handleServingChange}
        />
        
        <Separator className="my-6 bg-culinary-beige/50" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <IngredientsList
            ingredients={displayIngredients}
            isPremium={isPremium}
            showSubstitutions={showSubstitutions}
            activeSubstitution={activeSubstitution}
            toggleSubstitutions={toggleSubstitutions}
            selectSubstitution={selectSubstitution}
          />
          
          <InstructionsList instructions={recipe.instructions} />
        </div>
        
        <RecipeNotes notes={recipe.notes} />
      </div>
      
      <PremiumBanner isPremium={isPremium} />
    </div>
  );
};

export default RecipeCard;
