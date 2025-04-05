
import { useState, useRef, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { getSearchCount, incrementSearchCount, getFreeSearchLimit } from '@/utils/storage';

interface SearchBarProps {
  isPremium?: boolean;
}

// Popular restaurant examples for suggestions
const POPULAR_SEARCHES = [
  "Olive Garden Breadsticks",
  "Cheesecake Factory Avocado Egg Rolls",
  "Texas Roadhouse Rolls",
  "Red Lobster Cheddar Bay Biscuits",
  "Chipotle Burrito Bowl",
  "Panera Broccoli Cheddar Soup"
];

const SearchBar = ({ isPremium = false }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [searchesLeft, setSearchesLeft] = useState(getFreeSearchLimit() - getSearchCount());
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const freeSearchLimit = getFreeSearchLimit();

  // Get random suggestion
  useEffect(() => {
    const randomSuggestion = POPULAR_SEARCHES[Math.floor(Math.random() * POPULAR_SEARCHES.length)];
    setSuggestion(randomSuggestion);
  }, []);

  // Auto-focus effect
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Update searches left when component mounts or when search count changes
  useEffect(() => {
    setSearchesLeft(getFreeSearchLimit() - getSearchCount());
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Validation
    if (!query.trim()) {
      toast.warning("Please enter a recipe to search for");
      return;
    }
    
    // Search limit check for free users
    if (!isPremium) {
      const searchCount = getSearchCount();
      if (searchCount >= freeSearchLimit) {
        toast.error(
          "You've reached your daily search limit", 
          {
            description: "Upgrade to Premium for unlimited searches",
            action: {
              label: "Upgrade",
              onClick: () => navigate('/pricing')
            }
          }
        );
        return;
      }
    }
    
    setIsLoading(true);
    
    try {
      // Format query to improve search success
      let formattedQuery = query.trim();
      
      // If it looks like they're searching for a restaurant's menu items
      const lowerQuery = formattedQuery.toLowerCase();
      if (lowerQuery.includes("recipes from") || lowerQuery.includes("dishes from") || lowerQuery.includes("menu items from") || lowerQuery.includes("menu from")) {
        // Extract restaurant name - not complex, but works for basic queries
        const restaurant = lowerQuery.replace(/recipes from|dishes from|menu items from|menu from/gi, "").trim();
        if (restaurant) {
          toast.info(`Looking for ${restaurant} recipes...`, {
            description: "You can also search for specific dishes!"
          });
        }
      } 
      // If they're just searching for a recipe without specifying where it's from
      else if (!lowerQuery.includes(" from ")) {
        // Check if it might be a restaurant dish but missing the restaurant name
        const commonRestaurantDishes = [
          "bloomin onion", "egg rolls", "biscuits", "breadsticks", "fettuccine", 
          "burrito bowl", "chicken sandwich", "burger", "pasta"
        ];
        
        const mightBeRestaurantDish = commonRestaurantDishes.some(dish => lowerQuery.includes(dish));
        
        if (mightBeRestaurantDish) {
          toast.info("Searching for your recipe...", {
            description: "For better results, try adding the restaurant name (e.g., 'from Olive Garden')"
          });
        }
      }
      
      setTimeout(() => {
        if (!isPremium) {
          // We'll increment the search count here, but the actual count will be handled in Recipe.tsx
          navigate(`/recipe/${encodeURIComponent(formattedQuery)}`);
        } else {
          navigate(`/recipe/${encodeURIComponent(formattedQuery)}`);
        }
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Search error:', error);
      toast.error("Couldn't process that search", {
        description: "Please try a different search term"
      });
      setIsLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSearch}
      className={`w-full max-w-2xl mx-auto transition-all duration-500 ${
        isFocused ? 'scale-105' : 'scale-100'
      }`}
    >
      <div 
        className={`
          relative flex items-center overflow-hidden transition-all duration-300
          bg-white/60 backdrop-blur-md border 
          ${isFocused ? 'shadow-lg border-culinary-copper/40' : 'shadow-sm border-culinary-beige'}
          rounded-xl px-4 py-2
        `}
      >
        <Search 
          size={20} 
          className={`text-muted-foreground mr-2 transition-colors duration-300 ${
            isFocused ? 'text-culinary-copper' : ''
          }`}
        />
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search for a restaurant copycat recipe..."
          className="flex-1 bg-transparent border-none outline-none py-2 px-0 placeholder:text-muted-foreground/70"
          disabled={isLoading}
        />
        
        <Button 
          type="submit"
          disabled={isLoading || !query.trim()}
          className={`
            ml-2 transition-all duration-300 px-4 py-2 h-auto
            ${isLoading ? 'opacity-80' : 'opacity-100'}
          `}
        >
          {isLoading ? (
            <Loader2 className="animate-spin mr-1" size={18} />
          ) : (
            "Find Recipe"
          )}
        </Button>
      </div>
      
      <div className="text-center mt-3 text-sm text-muted-foreground">
        {!isPremium && (
          <span className="inline-flex items-center">
            <span className="relative px-2 py-1 bg-muted rounded-full text-xs font-medium">
              {searchesLeft} of 3 searches left today
            </span>
          </span>
        )}
      </div>
      
      <div className="text-center mt-4 text-sm text-muted-foreground">
        <p>Try: "{suggestion}" or "recipes from Chipotle"</p>
      </div>
    </form>
  );
};

export default SearchBar;
