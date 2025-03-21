import { Heart, Printer, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PremiumFeature from '@/components/PremiumFeature';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface RecipeHeaderProps {
  title: string;
  originalSource: string;
  isSaved: boolean;
  isPremium: boolean;
  onSave: () => void;
  onPrint: () => void;
  onShare: () => void;
}

const RecipeHeader = ({
  title,
  originalSource,
  isSaved,
  isPremium,
  onSave,
  onPrint,
  onShare
}: RecipeHeaderProps) => {
  const handleShare = () => {
    try {
      // Use clipboard API as the primary method since it's more widely supported
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
      
      // Optionally try Web Share API, but don't rely on it
      if (navigator.share) {
        navigator.share({
          title: `${title} Recipe | CopyCat Cuisine`,
          text: `Check out this copycat recipe for ${title}!`,
          url: window.location.href,
        }).catch((error) => {
          // Silently catch errors from share API since we already used clipboard
          console.log("Web Share API not available: ", error);
          // No need for a toast here since we already showed one for clipboard
        });
      }
    } catch (error) {
      console.error('Error sharing recipe:', error);
      toast.error("Failed to copy link to clipboard");
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-display font-medium text-culinary-charcoal mb-2 leading-tight">
          {title}
        </h1>
        <p className="text-muted-foreground">
          Inspired by {originalSource}
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
            onClick={onSave}
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
            onClick={onPrint}
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
  );
};

export default RecipeHeader;
