
import { useState, useEffect } from 'react';
import { getRecipe } from '@/utils/api';
import { getPremiumStatus, incrementSearchCount } from '@/utils/storage';
import { toast } from 'sonner';

export const useRecipe = (query?: string) => {
  const [recipe, setRecipe] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [notFoundMessage, setNotFoundMessage] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [whimsicalIntro, setWhimsicalIntro] = useState('');
  const [endingQuestion, setEndingQuestion] = useState('');
  const [searchCounted, setSearchCounted] = useState(false);
  const [sourcesUsed, setSourcesUsed] = useState('');
  
  const fetchRecipe = async (recipeQuery: string) => {
    if (!recipeQuery) return;
    
    setLoading(true);
    setError(null);
    setNotFound(false);
    setWhimsicalIntro('');
    setEndingQuestion('');
    setSearchCounted(false);
    setSourcesUsed('');
    
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
        // Only increment search count when a recipe is successfully found
        if (!isPremium && !searchCounted) {
          incrementSearchCount();
          setSearchCounted(true);
        }
        
        setRecipe(result);
        setWhimsicalIntro(result.whimsicalIntro || '');
        setEndingQuestion(result.endingQuestion || '');
        if (result.sourcesUsed) {
          setSourcesUsed(result.sourcesUsed);
        }
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

  return {
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
  };
};
