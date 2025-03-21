
// Constants
const SEARCH_COUNT_KEY = 'copycat_search_count';
const SEARCH_COUNT_DATE_KEY = 'copycat_search_count_date';
const PREMIUM_STATUS_KEY = 'copycat_premium_status';
const FAVORITE_RECIPES_KEY = 'copycat_favorite_recipes';
const SUBSCRIPTION_ID_KEY = 'copycat_subscription_id';
const SUBSCRIPTION_PERIOD_KEY = 'copycat_subscription_period';
const FREE_SEARCH_LIMIT = 10; // Increased from 3 to 10 for testing

// Daily search count management
export const getSearchCount = (): number => {
  // Check if this is a new day and reset if needed
  const lastDate = localStorage.getItem(SEARCH_COUNT_DATE_KEY);
  const today = new Date().toDateString();
  
  if (lastDate !== today) {
    // Reset count for new day
    localStorage.setItem(SEARCH_COUNT_KEY, '0');
    localStorage.setItem(SEARCH_COUNT_DATE_KEY, today);
    return 0;
  }
  
  // Return current count
  return parseInt(localStorage.getItem(SEARCH_COUNT_KEY) || '0', 10);
};

export const incrementSearchCount = (): void => {
  const currentCount = getSearchCount();
  const today = new Date().toDateString();
  
  localStorage.setItem(SEARCH_COUNT_KEY, (currentCount + 1).toString());
  localStorage.setItem(SEARCH_COUNT_DATE_KEY, today);
};

export const getFreeSearchLimit = (): number => {
  return FREE_SEARCH_LIMIT;
};

// Premium status management
export interface PremiumStatus {
  isPremium: boolean;
  plan?: string;
  expiresAt?: string;
  subscriptionId?: string; // Added for subscription management
  subscriptionStatus?: 'active' | 'canceled' | 'expired';
}

export const getPremiumStatus = (): PremiumStatus => {
  const status = localStorage.getItem(PREMIUM_STATUS_KEY);
  const subscriptionId = localStorage.getItem(SUBSCRIPTION_ID_KEY);
  
  if (!status) {
    return { isPremium: false };
  }
  
  try {
    const parsedStatus = JSON.parse(status) as PremiumStatus;
    
    // Add subscription ID if it exists
    if (subscriptionId) {
      parsedStatus.subscriptionId = subscriptionId;
    }
    
    // Check if premium status has expired
    if (parsedStatus.expiresAt && new Date(parsedStatus.expiresAt) < new Date()) {
      // Premium has expired, reset status but maintain subscription info for history
      if (parsedStatus.subscriptionId) {
        // Only mark as expired if we had a subscription
        parsedStatus.isPremium = false;
        parsedStatus.subscriptionStatus = 'expired';
        localStorage.setItem(PREMIUM_STATUS_KEY, JSON.stringify(parsedStatus));
        return parsedStatus;
      } else {
        // No subscription, just clear it
        localStorage.removeItem(PREMIUM_STATUS_KEY);
        return { isPremium: false };
      }
    }
    
    return parsedStatus;
  } catch (error) {
    console.error('Error parsing premium status:', error);
    return { isPremium: false };
  }
};

export const setPremiumStatus = (status: PremiumStatus): void => {
  // Save subscription ID separately if provided
  if (status.subscriptionId) {
    localStorage.setItem(SUBSCRIPTION_ID_KEY, status.subscriptionId);
  }
  
  // Save subscription period if available in status
  if (status.plan) {
    const period = status.plan.toLowerCase();
    if (period.includes('month') || period.includes('year') || period.includes('life')) {
      localStorage.setItem(SUBSCRIPTION_PERIOD_KEY, period);
    }
  }
  
  localStorage.setItem(PREMIUM_STATUS_KEY, JSON.stringify(status));
};

export const getSubscriptionDetails = () => {
  return {
    id: localStorage.getItem(SUBSCRIPTION_ID_KEY) || null,
    period: localStorage.getItem(SUBSCRIPTION_PERIOD_KEY) || null
  };
};

export const cancelSubscription = (): void => {
  const status = getPremiumStatus();
  
  // Update status to canceled but maintain premium access until expiry
  if (status.isPremium && status.subscriptionId) {
    status.subscriptionStatus = 'canceled';
    localStorage.setItem(PREMIUM_STATUS_KEY, JSON.stringify(status));
  }
};

export const clearPremiumStatus = (): void => {
  localStorage.removeItem(PREMIUM_STATUS_KEY);
  localStorage.removeItem(SUBSCRIPTION_ID_KEY);
  localStorage.removeItem(SUBSCRIPTION_PERIOD_KEY);
};

// Favorite recipes management
export interface SavedRecipe {
  id: string;
  title: string;
  originalSource: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  cookTime: string;
  servings: number;
  notes?: string;
  rating?: number;
  savedAt: string;
}

export const getFavoriteRecipes = (): SavedRecipe[] => {
  const favorites = localStorage.getItem(FAVORITE_RECIPES_KEY);
  
  if (!favorites) {
    return [];
  }
  
  try {
    return JSON.parse(favorites) as SavedRecipe[];
  } catch (error) {
    console.error('Error parsing favorite recipes:', error);
    return [];
  }
};

export const saveRecipe = (recipe: SavedRecipe | any): void => {
  const favorites = getFavoriteRecipes();
  
  // Check if recipe is already saved
  const existingIndex = favorites.findIndex(fav => fav.id === recipe.id);
  
  if (existingIndex !== -1) {
    // Update existing recipe
    favorites[existingIndex] = {
      ...recipe,
      savedAt: favorites[existingIndex].savedAt
    };
  } else {
    // Add new recipe with timestamp
    favorites.push({
      ...recipe,
      savedAt: new Date().toISOString()
    });
  }
  
  localStorage.setItem(FAVORITE_RECIPES_KEY, JSON.stringify(favorites));
};

export const removeSavedRecipe = (recipeId: string): void => {
  const favorites = getFavoriteRecipes();
  const updatedFavorites = favorites.filter(recipe => recipe.id !== recipeId);
  localStorage.setItem(FAVORITE_RECIPES_KEY, JSON.stringify(updatedFavorites));
};
