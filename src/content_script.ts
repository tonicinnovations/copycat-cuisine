
/// <reference types="chrome"/>

console.log('CopyCat Cuisine content script initialized');

// Configuration for popular restaurant sites
const RESTAURANT_CONFIGS = [
  {
    // Generic selectors that work on many restaurant sites
    nameSelector: '.restaurant-name, .brand-logo, header h1, .logo, .site-title, .site-header, .header-logo, #header, .navbar-brand',
    itemSelectors: '.menu-item, .dish-name, .item-name, .food-item, .product-name, .product-title, .item-title, .menu-item-title, h3, .card-title'
  },
  // Site-specific configurations
  {
    domain: 'mcdonalds.com',
    nameSelector: '.brand-logo, .site-header, .mcd-global-header',
    itemSelectors: '.item-title, .product-name, .cmp-category-item__content-title'
  },
  {
    domain: 'olivegarden.com',
    nameSelector: '.logo, .og-header-logo',
    itemSelectors: '.menu-item-title, .item-name, .og-menu-item-name'
  },
  {
    domain: 'chickfila.com',
    nameSelector: '.brand-logo, .restaurant-name, .header-logo',
    itemSelectors: '.menu-item-title, .product-name, .product-title'
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
  try {
    console.log('CopyCat Cuisine: Injecting buttons...');
    const restaurantName = getRestaurantName();
    console.log(`CopyCat Cuisine: Detected restaurant: ${restaurantName}`);
    
    // Find the current site in our configs or use generic selectors
    let itemSelectors = RESTAURANT_CONFIGS[0].itemSelectors;
    const currentDomain = window.location.hostname;
    
    for (const config of RESTAURANT_CONFIGS) {
      if (config.domain && currentDomain.includes(config.domain)) {
        itemSelectors = config.itemSelectors;
        console.log(`CopyCat Cuisine: Using specific selectors for ${config.domain}`);
        break;
      }
    }
    
    // For testing, log what selectors we're using
    console.log(`CopyCat Cuisine: Using selectors: ${itemSelectors}`);
    
    // Try each selector to find menu items
    const selectors = itemSelectors.split(', ');
    let menuItemsFound = false;
    let buttonsAdded = 0;
    
    for (const selector of selectors) {
      const menuItems = document.querySelectorAll(selector);
      console.log(`CopyCat Cuisine: Found ${menuItems.length} items with selector "${selector}"`);
      
      if (menuItems.length > 0) {
        menuItemsFound = true;
        
        menuItems.forEach(menuItem => {
          // Only add button if it hasn't been added already and has text content
          if (!menuItem.querySelector('.copycat-button') && menuItem.textContent?.trim()) {
            const dishName = menuItem.textContent?.trim() || '';
            // Skip items with very short names (likely not menu items)
            if (dishName.length < 3) return;
            
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
              z-index: 10000;
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
              
              console.log(`CopyCat Cuisine: Requesting recipe for "${dishName}" from "${restaurantName}"`);
              chrome.runtime.sendMessage({
                action: 'findRecipe',
                dish: dishName,
                restaurant: restaurantName
              }, (response) => {
                if (chrome.runtime.lastError) {
                  console.error('CopyCat Cuisine: Error sending message:', chrome.runtime.lastError);
                  alert(`CopyCat Cuisine: Error finding recipe. Please try again.`);
                } else if (response && response.success) {
                  console.log('CopyCat Cuisine: Message sent successfully');
                }
              });
            });
            
            // Add button to menu item
            menuItem.appendChild(recipeButton);
            buttonsAdded++;
          }
        });
      }
    }
    
    console.log(`CopyCat Cuisine: Added ${buttonsAdded} buttons`);
    
    // If no menu items were found, we'll try again later in case they're loaded dynamically
    if (!menuItemsFound) {
      console.log('CopyCat Cuisine: No menu items found, will retry in 2 seconds');
      setTimeout(injectCopycatButtons, 2000);
    }
  } catch (error) {
    console.error('CopyCat Cuisine: Error injecting buttons:', error);
  }
}

// Function to add a test panel for development and testing purposes
function addTestPanel() {
  if (document.getElementById('copycat-test-panel')) return;
  
  const testPanel = document.createElement('div');
  testPanel.id = 'copycat-test-panel';
  testPanel.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #fff;
    border: 2px solid #e67e22;
    border-radius: 8px;
    padding: 15px;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    width: 300px;
    font-family: Arial, sans-serif;
  `;
  
  // Only show test panel when in development or when a specific query param is present
  const isTestMode = window.location.search.includes('copycattest=true') || 
                      window.location.hostname.includes('localhost') ||
                      window.location.hostname.includes('127.0.0.1');
  
  if (!isTestMode) {
    // For non-test mode, just run the injection without the panel
    return;
  }
  
  // Add heading
  const heading = document.createElement('h3');
  heading.textContent = 'CopyCat Cuisine Tester';
  heading.style.margin = '0 0 10px 0';
  heading.style.color = '#e67e22';
  testPanel.appendChild(heading);
  
  // Add restaurant name display
  const restaurantName = getRestaurantName();
  const restaurantDisplay = document.createElement('p');
  restaurantDisplay.textContent = `Detected Restaurant: ${restaurantName}`;
  restaurantDisplay.style.margin = '5px 0';
  testPanel.appendChild(restaurantDisplay);
  
  // Add test field and button
  const testInput = document.createElement('input');
  testInput.type = 'text';
  testInput.placeholder = 'Enter a dish name to test';
  testInput.style.cssText = `
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 10px;
    box-sizing: border-box;
  `;
  testPanel.appendChild(testInput);
  
  const testButton = document.createElement('button');
  testButton.textContent = 'Test Recipe Lookup';
  testButton.style.cssText = `
    background-color: #e67e22;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 12px;
    cursor: pointer;
    font-weight: bold;
    width: 100%;
  `;
  testButton.addEventListener('click', () => {
    const dishName = testInput.value.trim();
    if (dishName) {
      chrome.runtime.sendMessage({
        action: 'findRecipe',
        dish: dishName,
        restaurant: restaurantName
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('CopyCat Cuisine: Error sending message:', chrome.runtime.lastError);
          alert(`Error: ${chrome.runtime.lastError.message || 'Could not connect to extension'}`);
        } else if (response && response.success) {
          console.log('CopyCat Cuisine: Test message sent successfully');
        }
      });
    } else {
      alert('Please enter a dish name to test');
    }
  });
  testPanel.appendChild(testButton);
  
  // Add status display
  const statusDisplay = document.createElement('div');
  statusDisplay.style.marginTop = '10px';
  statusDisplay.style.fontSize = '12px';
  statusDisplay.style.color = '#666';
  statusDisplay.textContent = 'Extension active and ready for testing';
  testPanel.appendChild(statusDisplay);
  
  // Add close button
  const closeButton = document.createElement('button');
  closeButton.textContent = 'X';
  closeButton.style.cssText = `
    position: absolute;
    top: 5px;
    right: 5px;
    background: none;
    border: none;
    font-weight: bold;
    cursor: pointer;
    color: #999;
  `;
  closeButton.addEventListener('click', () => {
    testPanel.remove();
  });
  testPanel.appendChild(closeButton);
  
  document.body.appendChild(testPanel);
}

// Run button injection after the page loads
window.addEventListener('load', () => {
  console.log('CopyCat Cuisine: Page loaded, initializing extension...');
  
  // Initial injection
  injectCopycatButtons();
  
  // Add test panel for development
  addTestPanel();
  
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
  
  console.log('CopyCat Cuisine: Extension fully initialized');
});

// This makes TypeScript treat this file as a module
export {};
