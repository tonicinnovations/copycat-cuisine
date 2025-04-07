/// <reference types="chrome"/>

// This is a background script for the Chrome extension
console.log('CopyCat Cuisine extension background script initialized');

// Example: Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('CopyCat Cuisine extension installed');
  
  // Initialize default storage if needed
  chrome.storage.local.set({
    preferences: {
      theme: 'light',
      savedRecipes: []
    }
  }, () => {
    console.log('Default preferences initialized');
  });
  
  // Create a context menu for easy testing
  chrome.contextMenus.create({
    id: 'copycatContextMenu',
    title: 'Find Copycat Recipe',
    contexts: ['selection']
  });
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'findRecipe') {
    const { dish, restaurant } = message;
    const query = `${dish} from ${restaurant}`;
    
    console.log(`Background: Searching for copycat recipe: ${query}`);
    
    try {
      // Open extension popup with the pre-filled query
      chrome.tabs.create({
        url: chrome.runtime.getURL(`index.html#/recipe/${encodeURIComponent(query)}`)
      }, (tab) => {
        if (chrome.runtime.lastError) {
          console.error('Error opening recipe tab:', chrome.runtime.lastError);
          sendResponse({ success: false, error: chrome.runtime.lastError.message });
        } else {
          console.log(`Opened recipe tab with ID: ${tab.id}`);
          sendResponse({ success: true, tabId: tab.id });
        }
      });
    } catch (error) {
      console.error('Error processing findRecipe action:', error);
      sendResponse({ success: false, error: error.message });
    }
    
    return true; // Required for async response
  }
  
  return true; // Required for async response
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'copycatContextMenu' && info.selectionText) {
    console.log(`Context menu: Selected text: ${info.selectionText}`);
    
    // Try to determine the restaurant from the tab's URL
    let restaurant = 'Unknown';
    if (tab.url) {
      const url = new URL(tab.url);
      const domain = url.hostname;
      // Extract restaurant name from domain (e.g., mcdonalds.com -> McDonald's)
      const domainParts = domain.split('.');
      if (domainParts.length >= 2) {
        restaurant = domainParts[domainParts.length - 2]
          .replace(/-/g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
    }
    
    const query = `${info.selectionText} from ${restaurant}`;
    chrome.tabs.create({
      url: chrome.runtime.getURL(`index.html#/recipe/${encodeURIComponent(query)}`)
    });
  }
});

// Keep extension active
chrome.runtime.onSuspend.addListener(() => {
  console.log('CopyCat Cuisine extension suspended');
});

// This is required to make the file a module
export {};
