
// This is a basic background script for the Chrome extension
// It will run in the background when the extension is installed

console.log('CopyCat Cuisine extension background script initialized');

// Example: Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('CopyCat Cuisine extension installed');
});

export {}
