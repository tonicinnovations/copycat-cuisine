
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NavBar from '@/components/NavBar';
import RecipeCard from '@/components/RecipeCard';
import { getRecipe } from '@/utils/api';
import { getPremiumStatus } from '@/utils/storage';
import { motion } from 'framer-motion';

const Recipe = () => {
  const { query } = useParams<{ query: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [notFoundMessage, setNotFoundMessage] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  
  useEffect(() => {
    const status = getPremiumStatus();
    setIsPremium(status.isPremium);
    
    const fetchRecipe = async () => {
      if (!query) return;
      
      setLoading(true);
      try {
        const result = await getRecipe(query);
        
        if (result.notFound) {
          setNotFound(true);
          setNotFoundMessage(result.message);
        } else {
          setRecipe(result);
        }
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError('Failed to fetch recipe. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecipe();
  }, [query]);
  
  const goBack = () => navigate('/');
  
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
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <div className="relative w-16 h-16">
              <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                <div className="relative w-12 h-12 animate-spin">
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-culinary-beige rounded-full"></div>
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-culinary-copper rounded-full"></div>
                </div>
              </div>
            </div>
            <p className="mt-4 text-muted-foreground">Cooking up your recipe...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-lg text-red-500 mb-4">{error}</p>
            <Button onClick={goBack}>Try Again</Button>
          </div>
        ) : notFound ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-10 px-4 bg-white/90 backdrop-blur-sm border border-culinary-beige rounded-xl shadow-sm max-w-2xl mx-auto"
          >
            <div className="w-16 h-16 bg-culinary-cream rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h2 className="text-2xl font-display font-medium mb-3">Recipe Not Found</h2>
            <p className="text-lg text-muted-foreground mb-6">{notFoundMessage}</p>
            <Button onClick={goBack}>Try Another Recipe</Button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <RecipeCard recipe={recipe} isPremium={isPremium} />
          </motion.div>
        )}
      </main>
      
      <footer className="py-6 border-t border-culinary-beige bg-white print:hidden">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} CopyCat Cuisine. All rights reserved.</p>
          <p className="mt-1">Not affiliated with any restaurants or brands mentioned.</p>
        </div>
      </footer>
    </div>
  );
};

export default Recipe;
