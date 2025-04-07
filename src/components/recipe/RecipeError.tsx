
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface RecipeErrorProps {
  error: string;
  onRetry: () => void;
  onGoBack: () => void;
}

const RecipeError = ({ error, onRetry, onGoBack }: RecipeErrorProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="bg-white/90 backdrop-blur-sm border border-red-200 rounded-xl shadow-sm p-8 max-w-md mx-auto">
        <p className="text-lg text-red-500 mb-4">{error}</p>
        <div className="flex justify-center gap-4">
          <Button onClick={onRetry} variant="outline">
            <RefreshCw size={16} className="mr-2" />
            Try Again
          </Button>
          <Button onClick={onGoBack}>Go Back</Button>
        </div>
      </div>
    </motion.div>
  );
};

export default RecipeError;
