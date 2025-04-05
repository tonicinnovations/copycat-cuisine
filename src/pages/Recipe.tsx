
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NavBar from '@/components/NavBar';
import RecipeCard from '@/components/RecipeCard';
import { getRecipe } from '@/utils/api';
import { getPremiumStatus } from '@/utils/storage';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const Recipe = () => {
  const { query } = useParams<{ query: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [notFoundMessage, setNotFoundMessage] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [whimsicalIntro, setWhimsicalIntro] = useState('');
  const [endingQuestion, setEndingQuestion] = useState('');
  
  const fetchRecipe = async (recipeQuery: string) => {
    if (!recipeQuery) return;
    
    setLoading(true);
    setError(null);
    setNotFound(false);
    setWhimsicalIntro('');
    setEndingQuestion('');
    
    try {
      toast.info(`Searching for ${recipeQuery} recipe...`);
      const result = await getRecipe(recipeQuery);
      
      if (result.notRecipe) {
        setNotFound(true);
        setNotFoundMessage(result.message);
        setEndingQuestion(result.endingQuestion);
        toast.error("That's not a recipe question", { 
          description: "Please ask for a copycat recipe instead" 
        });
      } else if (result.notFound) {
        setNotFound(true);
        setNotFoundMessage(result.message);
        setEndingQuestion(result.endingQuestion);
        toast.error("Recipe not found", { 
          description: "Try searching for another recipe" 
        });
      } else {
        setRecipe(result);
        setWhimsicalIntro(result.whimsicalIntro || '');
        setEndingQuestion(result.endingQuestion || '');
        toast.success("Recipe found!", { 
          description: `Found: ${result.title}` 
        });
      }
    } catch (err) {
      console.error('Error fetching recipe:', err);
      setError('Failed to fetch recipe. Please try again later.');
      toast.error("Error finding recipe", { 
        description: "Please try again" 
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const status = getPremiumStatus();
    setIsPremium(status.isPremium);
    
    if (query) {
      fetchRecipe(query);
    }
  }, [query]);
  
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
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <div className="relative w-16 h-16">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-0 left-0 w-full h-full flex justify-center items-center"
              >
                <div className="relative w-12 h-12 animate-spin">
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-culinary-beige rounded-full"></div>
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-culinary-copper rounded-full"></div>
                </div>
              </motion.div>
            </div>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-muted-foreground"
            >
              Searching for {query ? `"${query}"` : "your recipe"}...
            </motion.p>
          </div>
        ) : error ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="bg-white/90 backdrop-blur-sm border border-red-200 rounded-xl shadow-sm p-8 max-w-md mx-auto">
              <p className="text-lg text-red-500 mb-4">{error}</p>
              <div className="flex justify-center gap-4">
                <Button onClick={handleRetry} variant="outline">
                  <RefreshCw size={16} className="mr-2" />
                  Try Again
                </Button>
                <Button onClick={goBack}>Go Back</Button>
              </div>
            </div>
          </motion.div>
        ) : notFound ? (
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
              <Button onClick={handleRetry} variant="outline">
                <RefreshCw size={16} className="mr-2" />
                Try Again
              </Button>
              <Button onClick={goBack}>Try Another Recipe</Button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {whimsicalIntro && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-culinary-cream/60 border border-culinary-beige rounded-xl p-6 mb-8 text-center shadow-sm"
              >
                <p className="text-lg font-medium text-culinary-copper italic">{whimsicalIntro}</p>
              </motion.div>
            )}
            
            <RecipeCard recipe={recipe} isPremium={isPremium} />
            
            {endingQuestion && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 text-center"
              >
                <p className="text-lg text-culinary-copper font-medium">{endingQuestion}</p>
                <Button 
                  onClick={goBack}
                  className="mt-4"
                  variant="outline"
                >
                  Find Another Recipe
                </Button>
              </motion.div>
            )}
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
