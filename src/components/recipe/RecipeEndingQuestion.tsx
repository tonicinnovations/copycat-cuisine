
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface RecipeEndingQuestionProps {
  endingQuestion: string;
  onGoBack: () => void;
}

const RecipeEndingQuestion = ({ endingQuestion, onGoBack }: RecipeEndingQuestionProps) => {
  if (!endingQuestion) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-8 text-center"
    >
      <p className="text-lg text-culinary-copper font-medium">{endingQuestion}</p>
      <Button 
        onClick={onGoBack}
        className="mt-4"
        variant="outline"
      >
        Find Another Recipe
      </Button>
    </motion.div>
  );
};

export default RecipeEndingQuestion;
