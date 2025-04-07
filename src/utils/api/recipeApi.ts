
import { toast } from "sonner";
import { getPremiumStatus } from "../storage";
import { generateWhimsicalIntro, generateWhimsicalNotFoundMessage } from "./whimsicalMessages";

// Hardcoded OpenAI API key
const OPENAI_API_KEY = "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"; // Real API key

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

// Helper function to simplify queries by removing restaurant names or specific context
const simplifyQuery = (query: string): string => {
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

// Function to fetch a recipe from ChatGPT with whimsical responses
const fetchRecipeFromChatGPT = async (query: string, apiKey: string): Promise<any> => {
  try {
    const cleanQuery = query.trim();
    
    // Enhanced prompt with whimsical, fun response style and more explicit instructions
    // to always return a recipe if possible, now including topsecretrecipes.com as a resource
    const prompt = `
      As a fun, whimsical culinary expert, your task is to provide a copycat recipe for "${cleanQuery}" with personality and flair.
      
      Research this recipe thoroughly. If this is a chain restaurant dish (like Olive Garden, Red Lobster, Cheesecake Factory, etc.) or a classic restaurant dish, please be extra diligent in providing the most authentic recipe.
      
      IMPORTANT: Make sure to check topsecretrecipes.com as one of your research sources for copycat recipes, but this should NOT be your only source.
      
      IMPORTANT: If you cannot find the exact recipe, you should provide a SIMILAR recipe that would be a close substitute. NEVER say you can't find a recipe unless you've exhaustively searched and confirmed nothing similar exists.
      
      Your response MUST have two parts:
      
      PART 1: A whimsical, entertaining introduction that shows excitement about sharing this recipe. Be fun without being corny. Examples:
      - "Do I?! I have the wicked good recipe that compliments any Chowda heads appetite!"
      - "Holy guacamole! You've just unlocked the secret recipe vault! This Chipotle copycat will have your taste buds doing the salsa dance!"
      - "Butter my biscuit! The Colonel's secret is out, and I've got the 11 herbs and spices right here!"
      
      PART 2: The recipe in this exact JSON format:
      {
        "title": "Copycat [Restaurant/Store] [Recipe Name]",
        "originalSource": "[Restaurant/Store Name]",
        "ingredients": ["ingredient 1", "ingredient 2", ...],
        "instructions": ["step 1", "step 2", ...],
        "prepTime": "[prep time in minutes]",
        "cookTime": "[cook time in minutes]",
        "servings": [number of servings],
        "notes": "[any special notes or tips]",
        "whimsicalIntro": "[your fun introduction from Part 1]",
        "endingQuestion": "Would you like to find more copycat recipes? I've got a chef's hat full of them!"
      }
      
      If you genuinely cannot find a specific copycat recipe after extensive research, respond with a fun message like:
      {
        "notFound": true,
        "query": "${cleanQuery}",
        "message": "[a fun, whimsical message about not finding the recipe]",
        "endingQuestion": "Would you like to try another recipe? My cookbook is overflowing with other tasty secrets!"
      }
      
      DO YOUR BEST to find the recipe or a suitable alternative - most restaurant dishes have copycat versions!
      
      If the user asks for available recipes from a specific restaurant, list 4-6 popular items from that restaurant that you can provide recipes for.
      
      If the user asks a non-recipe question, respond with:
      {
        "notRecipe": true,
        "message": "I'm sorry, that is out of the scope of my expertise. But if you want a copycat recipe, I am your man! Umm your chef! Well... I can get it for you!",
        "endingQuestion": "Would you like to find a copycat recipe instead?"
      }
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4', // Using GPT-4 as specifically requested
        messages: [
          {
            role: 'system',
            content: 'You are a fun, entertaining culinary expert with extensive knowledge of restaurant copycat recipes. You have access to recipes from all major restaurant chains and cooking techniques. You ALWAYS provide recipes for restaurant dishes when asked, even if you need to create a plausible copycat version based on known ingredients. Be creative and helpful - users expect you to have all recipes. Only say you cannot find a recipe as an absolute last resort.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7, // Higher temperature for more creative responses
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('ChatGPT API error:', error);
      throw new Error(error.error?.message || 'Failed to fetch recipe from ChatGPT');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      // Extract the JSON object from the response
      // (ChatGPT might wrap the JSON in markdown code blocks)
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                        content.match(/```\n([\s\S]*?)\n```/) || 
                        [null, content];
      const jsonStr = jsonMatch[1] || content;
      const recipeData = JSON.parse(jsonStr);
      
      // Format the recipe with whimsical elements if it's a found recipe
      if (!recipeData.notFound && !recipeData.notRecipe) {
        // Make sure we have the whimsical intro and ending question
        if (!recipeData.whimsicalIntro) {
          recipeData.whimsicalIntro = generateWhimsicalIntro(recipeData.title);
        }
        if (!recipeData.endingQuestion) {
          recipeData.endingQuestion = "Would you like to find more copycat recipes? I've got a chef's hat full of them!";
        }
      }
      
      console.log("Recipe data found:", recipeData.title || "Not found");
      return recipeData;
    } catch (parseError) {
      console.error('Error parsing ChatGPT response:', parseError);
      console.log('Raw response:', content);
      throw new Error('Failed to parse ChatGPT response');
    }
  } catch (error) {
    console.error('Error fetching recipe from ChatGPT:', error);
    
    // Fallback to whimsical not found message
    return {
      notFound: true,
      query,
      message: generateWhimsicalNotFoundMessage(query),
      endingQuestion: "Would you like to try another recipe? My cookbook is overflowing with other tasty secrets!"
    };
  }
};

// Function to simulate processing a payment
export const processPayment = async (plan: string, paymentDetails: any): Promise<boolean> => {
  return new Promise((resolve) => {
    // Simulate payment processing delay
    setTimeout(() => {
      // Always succeed for demo purposes
      const success = true;
      
      if (success) {
        toast.success(`Successfully upgraded to ${plan} plan!`);
      } else {
        toast.error("Payment processing failed. Please try again.");
      }
      
      resolve(success);
    }, 2000);
  });
};
