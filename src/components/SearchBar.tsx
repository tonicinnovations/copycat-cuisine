
import { useState, useRef, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { getSearchCount, incrementSearchCount } from '@/utils/storage';

interface SearchBarProps {
  isPremium?: boolean;
}

const SearchBar = ({ isPremium = false }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Auto-focus effect
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
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
      if (searchCount >= 3) {
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
      // In a real implementation, this would be an API call to ChatGPT
      // For now, we'll simulate a delay and then navigate to a recipe page
      setTimeout(() => {
        if (!isPremium) {
          incrementSearchCount();
        }
        navigate(`/recipe/${encodeURIComponent(query)}`);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Search error:', error);
      toast.error("Couldn't find that recipe", {
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
              {3 - getSearchCount()} of 3 free searches left today
            </span>
          </span>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
