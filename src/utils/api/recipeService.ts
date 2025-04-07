
import { toast } from "sonner";
import { getPremiumStatus } from "../storage";
import { generateWhimsicalNotFoundMessage } from "./whimsicalMessages";
import { fetchRecipeFromChatGPT } from "./chatGptService";
import { simplifyQuery } from "./queryUtils";
import { OPENAI_API_KEY } from "./config";

// Function to get recipes - uses real ChatGPT API, falls back to simulation
export const getRecipe = async (query: string): Promise<any> => {
  const isPremium = getPremiumStatus().isPremium;
  
  try {
    // Always use the real ChatGPT API with the hardcoded key
    const result = await fetchRecipeFromChatGPT(query, OPENAI_API_KEY);
    
    // If recipe was not found, try again with a more generalized query
    if (result.notFound) {
      // Extract the main dish name without restaurant specifics if possible
      const simplifiedQuery = simplifyQuery(query);
      
      // Only try the simplified query if it's different from the original
      if (simplifiedQuery !== query) {
        console.log(`Recipe not found. Trying simplified query: ${simplifiedQuery}`);
        const secondAttempt = await fetchRecipeFromChatGPT(simplifiedQuery, OPENAI_API_KEY);
        
        // If second attempt succeeded, add a note about the adaptation
        if (!secondAttempt.notFound) {
          secondAttempt.notes = (secondAttempt.notes || "") + 
            " This recipe has been adapted as a copycat version of the restaurant dish you requested.";
          return secondAttempt;
        }
      }
    }
    
    return result;
  } catch (error) {
    console.error("Error in getRecipe:", error);
    // Always return something, don't let errors bubble up
    return {
      notFound: true,
      query,
      message: generateWhimsicalNotFoundMessage(query),
      endingQuestion: "Would you like to try another recipe? My cookbook is overflowing with other tasty secrets!"
    };
  }
};
