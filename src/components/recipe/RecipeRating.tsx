
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecipeRatingProps {
  rating: number;
  onRate: (rating: number) => void;
  isPremium: boolean;
}

const RecipeRating = ({ rating, onRate, isPremium }: RecipeRatingProps) => {
  if (!isPremium) return null;
  
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground">Rate this recipe:</p>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onRate(star)}
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
  );
};

export default RecipeRating;
