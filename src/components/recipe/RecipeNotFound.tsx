
import { RefreshCw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface RecipeNotFoundProps {
  notFoundMessage: string;
  endingQuestion: string;
  onRetry: () => void;
  onGoBack: () => void;
}

const RecipeNotFound = ({ notFoundMessage, endingQuestion, onRetry, onGoBack }: RecipeNotFoundProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-10 px-4 bg-white/90 backdrop-blur-sm border border-culinary-beige rounded-xl shadow-sm max-w-2xl mx-auto"
    >
      <div className="w-16 h-16 bg-culinary-cream rounded-full flex items-center justify-center mx-auto mb-4">
        <Search className="text-culinary-copper" size={24} />
      </div>
      <h2 className="text-2xl font-display font-medium mb-3">Recipe Not Found</h2>
      <p className="text-lg text-muted-foreground mb-4">{notFoundMessage}</p>
      <p className="text-md text-culinary-copper mb-6">{endingQuestion}</p>
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <Button onClick={onRetry} variant="outline">
          <RefreshCw size={16} className="mr-2" />
          Try Again
        </Button>
        <Button onClick={onGoBack}>Try Another Recipe</Button>
      </div>
    </motion.div>
  );
};

export default RecipeNotFound;
