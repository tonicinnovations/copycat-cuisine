
// Generate a fun, whimsical introduction for a recipe
export const generateWhimsicalIntro = (recipeTitle: string): string => {
  const intros = [
    `Holy rolling pins! You've just unlocked the secret to ${recipeTitle}! This recipe is so good, it should be illegal!`,
    `Butter my biscuit! I've got the inside scoop on ${recipeTitle} that'll make your taste buds do a happy dance!`,
    `Great googly moogly! The ${recipeTitle} recipe has been liberated from its vault! Time to cook like a kitchen wizard!`,
    `Sweet sizzling spatulas! This ${recipeTitle} copycat is the real deal - your dinner guests will be asking for your secret!`,
    `Jumpin' jalapeños! I'm thrilled to share this ${recipeTitle} recipe that's hotter than my oven on broil!`
  ];
  
  return intros[Math.floor(Math.random() * intros.length)];
};

// Generate a fun, whimsical message when a recipe is not found
export const generateWhimsicalNotFoundMessage = (query: string): string => {
  const messages = [
    `Oh crumbs! I've whisked through my recipe box but couldn't find a copycat for "${query}". Perhaps we could cook up something else?`,
    `Well butter my biscuit! I don't have a recipe for "${query}" yet. My cookbook is still rising with new recipes!`,
    `Holy guacamole! I've searched high and low but couldn't find a "${query}" recipe. Would you like to try something else from my menu?`,
    `Oops! I seem to have burned the "${query}" recipe. My chef's hat is hanging in shame! Maybe try another dish?`,
    `Great googly moogly! My recipe for "${query}" seems to have been eaten by my digital dog. Can I interest you in another tasty treat?`
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
};
