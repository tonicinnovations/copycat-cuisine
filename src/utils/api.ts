import { toast } from "sonner";
import { getPremiumStatus } from "./storage";

// Replace this with your actual OpenAI API key
const OPENAI_API_KEY = "your-api-key-here";

// Simulated sample responses for recipes
const sampleResponses: Record<string, any> = {
  "olive garden breadsticks": {
    title: "Copycat Olive Garden Breadsticks",
    originalSource: "Olive Garden",
    ingredients: [
      "1 package active dry yeast",
      "1 cup warm water (110°F)",
      "2 tablespoons sugar",
      "3 tablespoons unsalted butter, melted",
      "1 3/4 teaspoons salt",
      "3 to 3 1/2 cups all-purpose flour",
      "1/4 cup unsalted butter, melted (for brushing)",
      "2 teaspoons garlic salt",
    ],
    instructions: [
      "In a large bowl, combine yeast, warm water, and sugar. Let stand for 5 minutes until foamy.",
      "Add the melted butter, salt, and 2 cups of flour. Mix until smooth.",
      "Gradually add remaining flour until a soft dough forms.",
      "Turn dough onto a floured surface and knead for 6-8 minutes until smooth and elastic.",
      "Place dough in a greased bowl, cover, and let rise for 1 hour or until doubled in size.",
      "Punch down the dough and divide into 12-16 equal pieces.",
      "Roll each piece into a 6-inch rope and place on greased baking sheets.",
      "Cover and let rise for 45 minutes or until doubled.",
      "Preheat oven to 400°F (200°C).",
      "Bake for 10-12 minutes until golden brown.",
      "Brush immediately with melted butter and sprinkle with garlic salt.",
      "Serve warm and enjoy your homemade Olive Garden breadsticks!"
    ],
    prepTime: "25 minutes",
    cookTime: "12 minutes",
    servings: 12,
    notes: "For the authentic Olive Garden experience, serve these breadsticks with a side of marinara sauce. They're best enjoyed fresh, but can be stored in an airtight container for up to 2 days and reheated in the oven.",
    videoUrl: "https://www.youtube.com/embed/Y9WXeB6cGrI"
  },
  "starbucks pumpkin spice latte": {
    title: "Copycat Starbucks Pumpkin Spice Latte",
    originalSource: "Starbucks",
    ingredients: [
      "2 tablespoons pumpkin puree",
      "1/2 teaspoon pumpkin pie spice, plus more for garnish",
      "Freshly ground black pepper",
      "2 tablespoons sugar",
      "2 tablespoons vanilla extract",
      "2 cups whole milk",
      "1/4 cup strong hot espresso or coffee",
      "Whipped cream, for garnish"
    ],
    instructions: [
      "In a small saucepan over medium heat, cook the pumpkin with the pumpkin pie spice and a generous helping of black pepper for 2 minutes.",
      "Add the sugar and stir until the mixture looks like a bubbly, thick syrup.",
      "Whisk in the milk and vanilla extract. Warm gently over medium heat, watching carefully to make sure it doesn't boil over.",
      "Remove from the heat and blend the mixture with an immersion blender, regular blender, or whisk until frothy and smooth.",
      "Divide the espresso or coffee between two mugs and add the pumpkin-milk mixture on top.",
      "Top with whipped cream and a sprinkle of pumpkin pie spice, cinnamon, or nutmeg if desired.",
    ],
    prepTime: "5 minutes",
    cookTime: "10 minutes",
    servings: 2,
    notes: "For a more authentic coffee shop experience, use freshly pulled espresso shots. You can adjust the sweetness to your preference and substitute alternative milks like almond or oat milk.",
    videoUrl: "https://www.youtube.com/embed/wKHBJGwhYrU"
  },
  "chipotle guacamole": {
    title: "Copycat Chipotle Guacamole",
    originalSource: "Chipotle Mexican Grill",
    ingredients: [
      "2 ripe Hass avocados",
      "2 teaspoons lime juice",
      "2 tablespoons cilantro, chopped",
      "1/4 cup red onion, finely chopped",
      "1/2 jalapeño, seeds removed and finely chopped",
      "1/4 teaspoon kosher salt"
    ],
    instructions: [
      "Cut the avocados in half and remove the pits.",
      "Scoop the avocados into a bowl.",
      "Add the lime juice and salt, then mash until smooth but still slightly chunky.",
      "Fold in the chopped cilantro, red onion, and jalapeño.",
      "Taste and adjust seasoning with additional salt and lime juice if needed.",
      "Serve immediately or cover with plastic wrap pressed directly onto the surface of the guacamole to prevent browning."
    ],
    prepTime: "10 minutes",
    cookTime: "0 minutes",
    servings: 4,
    notes: "Chipotle's secret to perfect guacamole is using perfectly ripe avocados and the right balance of lime juice. Their restaurant recipe also calls for adding a pinch of fresh citrus zest for extra brightness.",
  },
  "cheesecake factory cheesecake": {
    title: "Copycat Cheesecake Factory Original Cheesecake",
    originalSource: "The Cheesecake Factory",
    ingredients: [
      "1 1/2 cups graham cracker crumbs",
      "5 tablespoons unsalted butter, melted",
      "4 (8-ounce) packages cream cheese, room temperature",
      "1 1/4 cups granulated sugar",
      "1/2 cup sour cream, room temperature",
      "2 teaspoons vanilla extract",
      "5 large eggs, room temperature",
      "1/2 cup heavy cream"
    ],
    instructions: [
      "Preheat oven to 325°F (165°C). Wrap the outside of a 9-inch springform pan with aluminum foil.",
      "In a medium bowl, combine graham cracker crumbs and melted butter. Press the mixture into the bottom of the springform pan.",
      "Bake the crust for 10 minutes, then allow to cool while preparing the filling.",
      "In a large bowl, beat the cream cheese and sugar until smooth and creamy, about 2-3 minutes.",
      "Add the sour cream and vanilla extract, mixing until combined.",
      "Add eggs, one at a time, mixing on low speed after each addition until just combined. Do not overmix.",
      "Add the heavy cream and mix until smooth.",
      "Pour the filling over the crust and place the springform pan in a large roasting pan.",
      "Fill the roasting pan with enough hot water to come about 1 inch up the sides of the springform pan.",
      "Bake for 1 hour and 30 minutes, or until the center is almost set but still slightly jiggly.",
      "Turn off the oven, crack the door open, and let the cheesecake cool in the oven for 1 hour.",
      "Remove the cheesecake from the water bath and refrigerate for at least 4 hours or overnight."
    ],
    prepTime: "30 minutes",
    cookTime: "1 hour 30 minutes",
    servings: 12,
    notes: "For that signature Cheesecake Factory look, top with a thin layer of sweetened sour cream (mix 1 cup sour cream with 2 tablespoons sugar and 1 teaspoon vanilla). The secret to avoiding cracks is the water bath and allowing the cheesecake to cool slowly.",
    videoUrl: "https://www.youtube.com/embed/uKR9yW6SDck"
  }
};

// Function to get recipes - uses real ChatGPT API, falls back to simulation
export const getRecipe = async (query: string): Promise<any> => {
  const isPremium = getPremiumStatus().isPremium;
  
  // If API key is set, use the real ChatGPT API
  if (OPENAI_API_KEY && OPENAI_API_KEY !== "your-api-key-here") {
    return fetchRecipeFromChatGPT(query);
  }
  
  // Otherwise, use the simulated responses
  return new Promise((resolve, reject) => {
    // Simulate API delay
    setTimeout(() => {
      // Check for exact match first
      const exactMatch = sampleResponses[query.toLowerCase()];
      
      if (exactMatch) {
        resolve(exactMatch);
        return;
      }
      
      // Look for partial matches
      const queryWords = query.toLowerCase().split(' ');
      
      for (const [key, recipe] of Object.entries(sampleResponses)) {
        if (queryWords.some(word => key.includes(word))) {
          resolve(recipe);
          return;
        }
      }
      
      // If no match found, generate a whimsical "not found" response
      resolve({
        notFound: true,
        query,
        message: generateWhimsicalNotFoundMessage(query)
      });
    }, 1500);
  });
};

// Function to fetch a recipe from ChatGPT
const fetchRecipeFromChatGPT = async (query: string): Promise<any> => {
  try {
    const prompt = `
      Create a copycat recipe for "${query}" that would be found at a restaurant or store.
      
      The response should be in JSON format with the following structure:
      {
        "title": "Copycat [Restaurant/Store] [Recipe Name]",
        "originalSource": "[Restaurant/Store Name]",
        "ingredients": ["ingredient 1", "ingredient 2", ...],
        "instructions": ["step 1", "step 2", ...],
        "prepTime": "[prep time in minutes]",
        "cookTime": "[cook time in minutes]",
        "servings": [number of servings],
        "notes": "[any special notes or tips]",
        "videoUrl": "[optional YouTube embed URL for a similar recipe]"
      }
      
      If you don't know a copycat recipe for this query, respond with a JSON object containing:
      {
        "notFound": true,
        "query": "${query}",
        "message": "[a whimsical and fun message about not finding the recipe]"
      }
      
      Be whimsical, fun, and helpful in the response. Use a conversational tone if writing notes or a not found message.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
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
      
      return recipeData;
    } catch (parseError) {
      console.error('Error parsing ChatGPT response:', parseError);
      console.log('Raw response:', content);
      throw new Error('Failed to parse ChatGPT response');
    }
  } catch (error) {
    console.error('Error fetching recipe from ChatGPT:', error);
    
    // Fallback to simulated not found
    return {
      notFound: true,
      query,
      message: `I tried to ask ChatGPT for this recipe, but encountered an error: ${error.message}. Please check the API key or try again later.`
    };
  }
};

// Generate a fun, whimsical message when a recipe is not found
const generateWhimsicalNotFoundMessage = (query: string): string => {
  const messages = [
    `Oh crumbs! I've whisked through my recipe box but couldn't find a copycat for "${query}". Perhaps we could cook up something else?`,
    `Well butter my biscuit! I don't have a recipe for "${query}" yet. My cookbook is still rising with new recipes!`,
    `Holy guacamole! I've searched high and low but couldn't find a "${query}" recipe. Would you like to try something else from my menu?`,
    `Oops! I seem to have burned the "${query}" recipe. My chef's hat is hanging in shame! Maybe try another dish?`,
    `Great googly moogly! My recipe for "${query}" seems to have been eaten by my digital dog. Can I interest you in another tasty treat?`
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
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
