
/// <reference types="chrome"/>

console.log('CopyCat Cuisine content script initialized');

// Configuration for popular restaurant sites
const RESTAURANT_CONFIGS = [
  {
    // Generic selectors that work on many restaurant sites
    nameSelector: '.restaurant-name, .brand-logo, header h1, .logo, .site-title',
    itemSelectors: '.menu-item, .dish-name, .item-name, .food-item, .product-name'
  },
  // Site-specific configurations
  {
    domain: 'mcdonalds.com',
    nameSelector: '.brand-logo, .site-header',
    itemSelectors: '.item-title, .product-name'
  },
  {
    domain: 'olivegarden.com',
    nameSelector: '.logo',
    itemSelectors: '.menu-item-title, .item-name'
  },
  {
    domain: 'chickfila.com',
    nameSelector: '.brand-logo, .restaurant-name',
    itemSelectors: '.menu-item-title, .product-name'
  }
];

// Function to get the restaurant name from the page
function getRestaurantName(): string {
  // Try to find the restaurant name using the configured selectors
  for (const config of RESTAURANT_CONFIGS) {
    const selectors = config.nameSelector.split(', ');
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent) {
        return element.textContent.trim();
      }
    }
  }

  // If no specific selector matched, try to extract from the domain
  const domain = window.location.hostname;
  const domainParts = domain.split('.');
  if (domainParts.length >= 2) {
    // Convert something like "olivegarden.com" to "Olive Garden"
    return domainParts[domainParts.length - 2]
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return 'Restaurant';
}

// Function to inject the copycat recipe button
function injectCopycatButtons() {
  const restaurantName = getRestaurantName();
  
  // Find the current site in our configs or use generic selectors
  let itemSelectors = RESTAURANT_CONFIGS[0].itemSelectors;
  const currentDomain = window.location.hostname;
  
  for (const config of RESTAURANT_CONFIGS) {
    if (config.domain && currentDomain.includes(config.domain)) {
      itemSelectors = config.itemSelectors;
      break;
    }
  }
  
  // Try each selector to find menu items
  const selectors = itemSelectors.split(', ');
  let menuItemsFound = false;
  
  for (const selector of selectors) {
    const menuItems = document.querySelectorAll(selector);
    
    if (menuItems.length > 0) {
      menuItemsFound = true;
      
      menuItems.forEach(menuItem => {
        // Only add button if it hasn't been added already
        if (!menuItem.querySelector('.copycat-button')) {
          const dishName = menuItem.textContent?.trim() || '';
          
          // Create button
          const recipeButton = document.createElement('button');
          recipeButton.textContent = 'Get Copycat Recipe';
          recipeButton.className = 'copycat-button';
          recipeButton.style.cssText = `
            background-color: #e67e22;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            margin: 5px;
            cursor: pointer;
            font-size: 12px;
            transition: background-color 0.3s;
          `;
          
          // Hover effect
          recipeButton.addEventListener('mouseover', () => {
            recipeButton.style.backgroundColor = '#d35400';
          });
          
          recipeButton.addEventListener('mouseout', () => {
            recipeButton.style.backgroundColor = '#e67e22';
          });
          
          // Click handler
          recipeButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            chrome.runtime.sendMessage({
              action: 'findRecipe',
              dish: dishName,
              restaurant: restaurantName
            });
          });
          
          // Add button to menu item
          menuItem.appendChild(recipeButton);
        }
      });
    }
  }
  
  // If no menu items were found, we'll try again later in case they're loaded dynamically
  if (!menuItemsFound) {
    setTimeout(injectCopycatButtons, 2000);
  }
}

// Run button injection after the page loads
window.addEventListener('load', () => {
  // Initial injection
  injectCopycatButtons();
  
  // Set up a MutationObserver to detect when new menu items are added to the page
  const observer = new MutationObserver((mutations) => {
    // Check if new menu items might have been added
    injectCopycatButtons();
  });
  
  // Start observing changes to the DOM
  observer.observe(document.body, { 
    childList: true, 
    subtree: true 
  });
});
