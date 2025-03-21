import { useState, useEffect } from 'react';
import { Printer, Share2, Plus, Minus, Utensils, ArrowDown, Sparkles, Heart, Star, LeafIcon, WheatOff, Milk, Egg } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import PremiumFeature from './PremiumFeature';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { saveRecipe, getFavoriteRecipes, removeSavedRecipe } from '@/utils/storage';

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
  };
  isPremium?: boolean;
}

interface SubstitutionMap {
  [key: string]: { 
    vegan: string;
    glutenFree: string;
    dairyFree: string;
  };
}

const RecipeCard = ({ recipe, isPremium = false }: RecipeCardProps) => {
  const [servings, setServings] = useState(recipe.servings);
  const [expanded, setExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [rating, setRating] = useState(0);
  const [showSubstitutions, setShowSubstitutions] = useState(false);
  const [activeSubstitution, setActiveSubstitution] = useState<'vegan' | 'glutenFree' | 'dairyFree' | null>(null);
  const navigate = useNavigate();
  
  // Common ingredient substitutions
  const substitutions: SubstitutionMap = {
    "butter": {
      vegan: "plant-based butter or coconut oil",
      glutenFree: "butter (naturally gluten-free)",
      dairyFree: "plant-based butter or coconut oil"
    },
    "milk": {
      vegan: "almond milk, soy milk, or oat milk",
      glutenFree: "milk (naturally gluten-free)",
      dairyFree: "almond milk, soy milk, or oat milk"
    },
    "cream": {
      vegan: "coconut cream or cashew cream",
      glutenFree: "cream (naturally gluten-free)",
      dairyFree: "coconut cream or cashew cream"
    },
    "cheese": {
      vegan: "plant-based cheese alternative",
      glutenFree: "cheese (naturally gluten-free)",
      dairyFree: "plant-based cheese alternative"
    },
    "flour": {
      vegan: "all-purpose flour (naturally vegan)",
      glutenFree: "gluten-free flour blend or almond flour",
      dairyFree: "all-purpose flour (naturally dairy-free)"
    },
    "bread": {
      vegan: "vegan bread (check ingredients)",
      glutenFree: "gluten-free bread",
      dairyFree: "dairy-free bread (check ingredients)"
    },
    "egg": {
      vegan: "flax egg (1 tbsp ground flax + 3 tbsp water) or commercial egg replacer",
      glutenFree: "egg (naturally gluten-free)",
      dairyFree: "egg (naturally dairy-free)"
    },
    "chicken": {
      vegan: "tofu, tempeh, or seitan",
      glutenFree: "chicken (naturally gluten-free)",
      dairyFree: "chicken (naturally dairy-free)"
    },
    "beef": {
      vegan: "plant-based beef alternative, mushrooms, or lentils",
      glutenFree: "beef (naturally gluten-free)",
      dairyFree: "beef (naturally dairy-free)"
    },
    "yogurt": {
      vegan: "plant-based yogurt (coconut, almond, or soy)",
      glutenFree: "yogurt (naturally gluten-free, check flavors)",
      dairyFree: "plant-based yogurt (coconut, almond, or soy)"
    },
    "cream cheese": {
      vegan: "plant-based cream cheese alternative",
      glutenFree: "cream cheese (naturally gluten-free)",
      dairyFree: "plant-based cream cheese alternative"
    },
    "mayonnaise": {
      vegan: "vegan mayonnaise",
      glutenFree: "mayonnaise (naturally gluten-free)",
      dairyFree: "mayonnaise (naturally dairy-free, check ingredients)"
    },
    "sour cream": {
      vegan: "plant-based sour cream or coconut cream with lemon juice",
      glutenFree: "sour cream (naturally gluten-free)",
      dairyFree: "plant-based sour cream or coconut cream with lemon juice"
    },
    "honey": {
      vegan: "maple syrup or agave nectar",
      glutenFree: "honey (naturally gluten-free)",
      dairyFree: "honey (naturally dairy-free)"
    }
  };

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

  // Function to find substitutions in an ingredient string
  const getSubstitutedIngredient = (ingredient: string): string => {
    if (!activeSubstitution) return ingredient;
    
    // Check for exact matches or matches containing the ingredient name
    for (const [key, subs] of Object.entries(substitutions)) {
      const regex = new RegExp(`\\b${key}\\b`, 'i');
      if (regex.test(ingredient.toLowerCase())) {
        return ingredient.replace(regex, subs[activeSubstitution]);
      }
    }
    
    return ingredient;
  };
  
  const scaledIngredients = recipe.ingredients.map(ingredient => {
    // Basic scaling logic for ingredients based on servings
    const ratio = servings / recipe.servings;
    
    // Match quantity patterns like "1", "1.5", "1 1/2", etc.
    return ingredient.replace(/(\d+(\.\d+)?|\d+\/\d+|\d+ \d+\/\d+)/g, match => {
      // Handle fractions
      if (match.includes('/')) {
        if (match.includes(' ')) {
          // Mixed number like "1 1/2"
          const [whole, fraction] = match.split(' ');
          const [num, denom] = fraction.split('/').map(Number);
          const decimal = Number(whole) + (num / denom);
          const scaled = decimal * ratio;
          return scaled.toFixed(1);
        } else {
          // Simple fraction like "1/2"
          const [num, denom] = match.split('/').map(Number);
          const decimal = num / denom;
          const scaled = decimal * ratio;
          return scaled.toFixed(1);
        }
      } else {
        // Simple number
        return (parseFloat(match) * ratio).toFixed(match.includes('.') ? 1 : 0);
      }
    });
  });

  const displayIngredients = activeSubstitution 
    ? scaledIngredients.map(getSubstitutedIngredient)
    : scaledIngredients;
  
  return (
    <div className={cn(
      "w-full max-w-3xl mx-auto overflow-hidden transition-all",
      "bg-white/90 backdrop-blur-md border border-culinary-beige",
      "shadow-md rounded-2xl print:shadow-none print:border-0"
    )}>
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-medium text-culinary-charcoal mb-2 leading-tight">
              {recipe.title}
            </h1>
            <p className="text-muted-foreground">
              Inspired by {recipe.originalSource}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 print:hidden">
            <PremiumFeature 
              isPremium={isPremium} 
              featureName="Save Recipe"
              className="inline-block"
            >
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "flex items-center gap-1 border-culinary-beige",
                  isSaved 
                    ? "bg-culinary-copper/10 text-culinary-copper border-culinary-copper" 
                    : "hover:bg-culinary-beige/30"
                )}
                onClick={handleSaveRecipe}
                disabled={!isPremium}
              >
                <Heart size={16} fill={isSaved ? "currentColor" : "none"} />
                <span className="hidden sm:inline">{isSaved ? "Saved" : "Save"}</span>
              </Button>
            </PremiumFeature>
            
            <PremiumFeature 
              isPremium={isPremium} 
              featureName="Print Recipe"
              className="inline-block"
            >
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 border-culinary-beige hover:bg-culinary-beige/30"
                onClick={handlePrint}
                disabled={!isPremium}
              >
                <Printer size={16} />
                <span className="hidden sm:inline">Print</span>
              </Button>
            </PremiumFeature>
            
            <PremiumFeature 
              isPremium={isPremium} 
              featureName="Share Recipe"
              className="inline-block"
            >
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 border-culinary-beige hover:bg-culinary-beige/30"
                onClick={handleShare}
                disabled={!isPremium}
              >
                <Share2 size={16} />
                <span className="hidden sm:inline">Share</span>
              </Button>
            </PremiumFeature>
          </div>
        </div>
        
        {isPremium && (
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">Rate this recipe:</p>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRating(star)}
                    className="p-1 focus:outline-none"
                  >
                    <Star
                      size={20}
                      className={cn(
                        "text-gray-300 transition-colors",
                        star <= rating ? "text-yellow-400 fill-yellow-400" : ""
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center p-3 bg-culinary-cream rounded-lg">
            <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full mr-3">
              <Utensils size={16} className="text-culinary-copper" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Prep Time</p>
              <p className="font-medium">{recipe.prepTime}</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-culinary-cream rounded-lg">
            <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full mr-3">
              <Utensils size={16} className="text-culinary-copper" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Cook Time</p>
              <p className="font-medium">{recipe.cookTime}</p>
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
                    onClick={() => handleServingChange(false)}
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
                    onClick={() => handleServingChange(true)}
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
        
        <Separator className="my-6 bg-culinary-beige/50" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h2 className="text-xl font-display font-medium mb-4">Ingredients</h2>
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
                {showSubstitutions ? (
                  <ArrowDown size={14} className="mr-1" />
                ) : (
                  <ArrowDown size={14} className="mr-1" />
                )}
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

            <ul className="space-y-2">
              {displayIngredients.map((ingredient, index) => (
                <li key={index} className="flex items-baseline gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-culinary-copper flex-shrink-0 mt-1.5"></span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="md:col-span-2">
            <h2 className="text-xl font-display font-medium mb-4">Instructions</h2>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-culinary-cream rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-culinary-charcoal">{index + 1}</span>
                  </div>
                  <p className="flex-1">{instruction}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
        
        {recipe.notes && (
          <div className="mt-8 p-4 bg-culinary-cream rounded-lg">
            <h3 className="font-medium mb-2">Chef's Notes</h3>
            <p className="text-muted-foreground">{recipe.notes}</p>
          </div>
        )}
      </div>
      
      {!isPremium && (
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
      )}
    </div>
  );
};

export default RecipeCard;
