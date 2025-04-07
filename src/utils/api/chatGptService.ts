
import { generateWhimsicalIntro, generateWhimsicalNotFoundMessage } from "./whimsicalMessages";

// Function to fetch a recipe from ChatGPT with whimsical responses
export const fetchRecipeFromChatGPT = async (query: string, apiKey: string): Promise<any> => {
  try {
    const cleanQuery = query.trim();
    
    // Enhanced prompt with whimsical, fun response style and more explicit instructions
    // to always return a recipe if possible, now mentioning topsecretrecipes.com only if recipe is found
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
        "endingQuestion": "Would you like to find more copycat recipes? I've got a chef's hat full of them!",
        "sourcesUsed": "[IMPORTANT: ONLY include topsecretrecipes.com here if you actually found and used information from this site for this specific recipe. Otherwise, leave this field empty.]",
        "recipeImage": "[IMPORTANT: ONLY if you found this recipe on topsecretrecipes.com, provide a suitable generic food image URL that represents this dish. Otherwise, leave this field empty.]"
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
        
        // Only add the topsecretrecipes.com attribution if it was explicitly mentioned as a source
        if (recipeData.sourcesUsed && recipeData.sourcesUsed.toLowerCase().includes('topsecretrecipes.com')) {
          recipeData.sourcesUsed = "Our search includes recipe sources like topsecretrecipes.com to find the best copycat versions!";
          
          // If no recipeImage was provided but topsecretrecipes.com was used, set a default food image
          if (!recipeData.recipeImage) {
            // Set a placeholder recipe image based on the dish type
            const title = recipeData.title.toLowerCase();
            if (title.includes('chicken')) {
              recipeData.recipeImage = "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800";
            } else if (title.includes('pasta') || title.includes('alfredo') || title.includes('spaghetti')) {
              recipeData.recipeImage = "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800";
            } else if (title.includes('burger') || title.includes('sandwich')) {
              recipeData.recipeImage = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800";
            } else if (title.includes('pizza')) {
              recipeData.recipeImage = "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800";
            } else if (title.includes('dessert') || title.includes('cake') || title.includes('cookie') || title.includes('brownie')) {
              recipeData.recipeImage = "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800";
            } else if (title.includes('soup') || title.includes('stew') || title.includes('chili')) {
              recipeData.recipeImage = "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?auto=format&fit=crop&w=800";
            } else if (title.includes('salad')) {
              recipeData.recipeImage = "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800";
            } else if (title.includes('bread') || title.includes('biscuit')) {
              recipeData.recipeImage = "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800";
            } else {
              recipeData.recipeImage = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800";
            }
          }
        } else {
          // Otherwise, don't mention topsecretrecipes.com
          recipeData.sourcesUsed = "";
          recipeData.recipeImage = ""; // No image if not from topsecretrecipes.com
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
