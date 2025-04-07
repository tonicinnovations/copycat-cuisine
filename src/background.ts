/// <reference types="chrome"/>

// This is a basic background script for the Chrome extension
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
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'findRecipe') {
    const { dish, restaurant } = message;
    const query = `${dish} from ${restaurant}`;
    
    // Open extension popup with the pre-filled query
    chrome.tabs.create({
      url: chrome.runtime.getURL(`index.html#/recipe/${encodeURIComponent(query)}`)
    });
    
    console.log(`Searching for copycat recipe: ${query}`);
    sendResponse({ success: true });
  }
  
  return true; // Required for async response
});

// Keep extension active
chrome.runtime.onSuspend.addListener(() => {
  console.log('CopyCat Cuisine extension suspended');
});

// This is required to make the file a module
export {};
