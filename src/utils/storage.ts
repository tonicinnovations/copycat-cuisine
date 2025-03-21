
// Constants
const SEARCH_COUNT_KEY = 'copycat_search_count';
const SEARCH_COUNT_DATE_KEY = 'copycat_search_count_date';
const PREMIUM_STATUS_KEY = 'copycat_premium_status';

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

// Premium status management
export interface PremiumStatus {
  isPremium: boolean;
  plan?: string;
  expiresAt?: string;
}

export const getPremiumStatus = (): PremiumStatus => {
  const status = localStorage.getItem(PREMIUM_STATUS_KEY);
  
  if (!status) {
    return { isPremium: false };
  }
  
  try {
    const parsedStatus = JSON.parse(status) as PremiumStatus;
    
    // Check if premium status has expired
    if (parsedStatus.expiresAt && new Date(parsedStatus.expiresAt) < new Date()) {
      // Premium has expired, reset status
      localStorage.removeItem(PREMIUM_STATUS_KEY);
      return { isPremium: false };
    }
    
    return parsedStatus;
  } catch (error) {
    console.error('Error parsing premium status:', error);
    return { isPremium: false };
  }
};

export const setPremiumStatus = (status: PremiumStatus): void => {
  localStorage.setItem(PREMIUM_STATUS_KEY, JSON.stringify(status));
};

export const clearPremiumStatus = (): void => {
  localStorage.removeItem(PREMIUM_STATUS_KEY);
};
