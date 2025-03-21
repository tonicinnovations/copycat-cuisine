
import { useState } from 'react';
import { Printer, Share2, Plus, Minus, Utensils, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import PremiumFeature from './PremiumFeature';
import { cn } from '@/lib/utils';

interface RecipeCardProps {
  recipe: {
    title: string;
    originalSource: string;
    ingredients: string[];
    instructions: string[];
    prepTime: string;
    cookTime: string;
    servings: number;
    notes?: string;
    videoUrl?: string;
  };
  isPremium?: boolean;
}

const RecipeCard = ({ recipe, isPremium = false }: RecipeCardProps) => {
  const [servings, setServings] = useState(recipe.servings);
  const [expanded, setExpanded] = useState(false);
  
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
          
          <div className="flex gap-2 print:hidden">
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
        
        {recipe.videoUrl && (
          <PremiumFeature 
            isPremium={isPremium} 
            featureName="Video Tutorial"
            className="mb-6"
          >
            <div className="relative aspect-video w-full bg-culinary-cream rounded-lg overflow-hidden">
              <iframe 
                src={isPremium ? recipe.videoUrl : ''}
                title={`${recipe.title} Video Tutorial`}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
              />
            </div>
          </PremiumFeature>
        )}
        
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
                variant="outline" 
                size="sm"
                className="w-full mb-4 text-sm border-culinary-beige"
                disabled={!isPremium}
              >
                <ArrowDown size={14} className="mr-1" />
                Dietary Substitutions
              </Button>
            </PremiumFeature>
            <ul className="space-y-2">
              {(isPremium ? scaledIngredients : recipe.ingredients).map((ingredient, index) => (
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
    </div>
  );
};

export default RecipeCard;
