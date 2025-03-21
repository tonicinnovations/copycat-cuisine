
export interface SubstitutionMap {
  [key: string]: { 
    vegan: string;
    glutenFree: string;
    dairyFree: string;
  };
}

export const substitutions: SubstitutionMap = {
  "butter": {
    vegan: "plant-based butter or coconut oil",
    glutenFree: "butter (naturally gluten-free)",
    dairyFree: "plant-based butter or coconut oil"
  },
  "milk": {
    vegan: "almond milk, soy milk, or oat milk",
    glutenFree: "milk (naturally gluten-free)",
    dairyFree: "almond milk, soy milk, or oat milk"
  },
  "cream": {
    vegan: "coconut cream or cashew cream",
    glutenFree: "cream (naturally gluten-free)",
    dairyFree: "coconut cream or cashew cream"
  },
  "cheese": {
    vegan: "plant-based cheese alternative",
    glutenFree: "cheese (naturally gluten-free)",
    dairyFree: "plant-based cheese alternative"
  },
  "flour": {
    vegan: "all-purpose flour (naturally vegan)",
    glutenFree: "gluten-free flour blend or almond flour",
    dairyFree: "all-purpose flour (naturally dairy-free)"
  },
  "bread": {
    vegan: "vegan bread (check ingredients)",
    glutenFree: "gluten-free bread",
    dairyFree: "dairy-free bread (check ingredients)"
  },
  "egg": {
    vegan: "flax egg (1 tbsp ground flax + 3 tbsp water) or commercial egg replacer",
    glutenFree: "egg (naturally gluten-free)",
    dairyFree: "egg (naturally dairy-free)"
  },
  "chicken": {
    vegan: "tofu, tempeh, or seitan",
    glutenFree: "chicken (naturally gluten-free)",
    dairyFree: "chicken (naturally dairy-free)"
  },
  "beef": {
    vegan: "plant-based beef alternative, mushrooms, or lentils",
    glutenFree: "beef (naturally gluten-free)",
    dairyFree: "beef (naturally dairy-free)"
  },
  "yogurt": {
    vegan: "plant-based yogurt (coconut, almond, or soy)",
    glutenFree: "yogurt (naturally gluten-free, check flavors)",
    dairyFree: "plant-based yogurt (coconut, almond, or soy)"
  },
  "cream cheese": {
    vegan: "plant-based cream cheese alternative",
    glutenFree: "cream cheese (naturally gluten-free)",
    dairyFree: "plant-based cream cheese alternative"
  },
  "mayonnaise": {
    vegan: "vegan mayonnaise",
    glutenFree: "mayonnaise (naturally gluten-free)",
    dairyFree: "mayonnaise (naturally dairy-free, check ingredients)"
  },
  "sour cream": {
    vegan: "plant-based sour cream or coconut cream with lemon juice",
    glutenFree: "sour cream (naturally gluten-free)",
    dairyFree: "plant-based sour cream or coconut cream with lemon juice"
  },
  "honey": {
    vegan: "maple syrup or agave nectar",
    glutenFree: "honey (naturally gluten-free)",
    dairyFree: "honey (naturally dairy-free)"
  }
};

// Function to find substitutions in an ingredient string
export const getSubstitutedIngredient = (
  ingredient: string, 
  activeSubstitution: 'vegan' | 'glutenFree' | 'dairyFree' | null
): string => {
  if (!activeSubstitution) return ingredient;
  
  // Check for exact matches or matches containing the ingredient name
  for (const [key, subs] of Object.entries(substitutions)) {
    const regex = new RegExp(`\\b${key}\\b`, 'i');
    if (regex.test(ingredient.toLowerCase())) {
      return ingredient.replace(regex, subs[activeSubstitution]);
    }
  }
  
  return ingredient;
};

// Function to scale ingredients based on serving size
export const scaleIngredient = (ingredient: string, originalServings: number, currentServings: number): string => {
  // Basic scaling logic for ingredients based on servings
  const ratio = currentServings / originalServings;
  
  // Match quantity patterns like "1", "1.5", "1 1/2", etc.
  return ingredient.replace(/(\d+(\.\d+)?|\d+\/\d+|\d+ \d+\/\d+)/g, match => {
    // Handle fractions
    if (match.includes('/')) {
      if (match.includes(' ')) {
        // Mixed number like "1 1/2"
        const [whole, fraction] = match.split(' ');
        const [num, denom] = fraction.split('/').map(Number);
        const decimal = Number(whole) + (num / denom);
        const scaled = decimal * ratio;
        return scaled.toFixed(1);
      } else {
        // Simple fraction like "1/2"
        const [num, denom] = match.split('/').map(Number);
        const decimal = num / denom;
        const scaled = decimal * ratio;
        return scaled.toFixed(1);
      }
    } else {
      // Simple number
      return (parseFloat(match) * ratio).toFixed(match.includes('.') ? 1 : 0);
    }
  });
};
