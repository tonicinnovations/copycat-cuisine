
/// <reference types="chrome"/>

// This is a basic background script for the Chrome extension
// It will run in the background when the extension is installed

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

// Keep extension active
chrome.runtime.onSuspend.addListener(() => {
  console.log('CopyCat Cuisine extension suspended');
});

// This is required to make the file a module
export {};
