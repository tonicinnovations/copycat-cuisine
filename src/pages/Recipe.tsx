
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NavBar from '@/components/NavBar';
import RecipeCard from '@/components/RecipeCard';
import { motion } from 'framer-motion';

// Import our new components
import RecipeLoading from '@/components/recipe/RecipeLoading';
import RecipeError from '@/components/recipe/RecipeError';
import RecipeNotFound from '@/components/recipe/RecipeNotFound';
import WhimsicalIntro from '@/components/recipe/WhimsicalIntro';
import RecipeEndingQuestion from '@/components/recipe/RecipeEndingQuestion';
import RecipeFooter from '@/components/recipe/RecipeFooter';
import { useRecipe } from '@/hooks/useRecipe';

const Recipe = () => {
  const { query } = useParams<{ query: string }>();
  const navigate = useNavigate();
  
  const { 
    recipe, 
    loading, 
    error, 
    notFound, 
    notFoundMessage, 
    isPremium, 
    whimsicalIntro, 
    endingQuestion, 
    sourcesUsed,
    fetchRecipe 
  } = useRecipe(query);
  
  const goBack = () => navigate('/');
  
  const handleRetry = () => {
    if (query) {
      fetchRecipe(query);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-culinary-cream to-white">
      <NavBar />
      
      <main className="pt-24 pb-16 px-4 container max-w-6xl mx-auto">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={goBack}
          className="mb-6 text-sm border-culinary-beige hover:bg-culinary-cream print:hidden"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Search
        </Button>
        
        {loading ? (
          <RecipeLoading query={query} />
        ) : error ? (
          <RecipeError 
            error={error} 
            onRetry={handleRetry} 
            onGoBack={goBack} 
          />
        ) : notFound ? (
          <RecipeNotFound 
            notFoundMessage={notFoundMessage} 
            endingQuestion={endingQuestion} 
            onRetry={handleRetry} 
            onGoBack={goBack} 
          />
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <WhimsicalIntro intro={whimsicalIntro} />
            
            <RecipeCard recipe={{...recipe, sourcesUsed: sourcesUsed}} isPremium={isPremium} />
            
            <RecipeEndingQuestion 
              endingQuestion={endingQuestion} 
              onGoBack={goBack} 
            />
          </motion.div>
        )}
      </main>
      
      <RecipeFooter />
    </div>
  );
};

export default Recipe;
