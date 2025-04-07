
// Helper function to simplify queries by removing restaurant names or specific context
export const simplifyQuery = (query: string): string => {
  // Remove "from [restaurant]" patterns
  let simplified = query.replace(/ from .+$/i, '').trim();
  
  // Remove possessive forms
  simplified = simplified.replace(/'s\s+/g, ' ').trim();
  
  // Remove common words that might confuse the search
  const wordsToRemove = ['copycat', 'recipe', 'restaurant', 'style', 'homemade'];
  for (const word of wordsToRemove) {
    simplified = simplified.replace(new RegExp(`\\b${word}\\b`, 'gi'), '').trim();
  }
  
  // Replace multiple spaces with a single space
  simplified = simplified.replace(/\s+/g, ' ').trim();
  
  return simplified;
};
