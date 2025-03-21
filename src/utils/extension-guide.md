
# CopyCat Cuisine Extension Guide

## Building the Extension (Standard Method)

1. **Using the Lovable Platform**:
   - Click the "Share" button in the top right corner
   - Select "Download" to get a zip file of your project

2. **On Your Computer**:
   - Unzip the downloaded file
   - Open a terminal in the unzipped folder
   - Run `npm install` to install dependencies
   - Run `npm run build` to build the extension
   - The built extension will be in the `dist` folder

## Alternative Build Method (If encountering npm errors)

If you're seeing npm errors like "Missing script: install", try this alternative approach:

1. **Using the Lovable Platform**:
   - Make sure your extension is working correctly in the preview
   - Click the "Share" button in the top right corner
   - Select "Download" to get a zip file of your project

2. **Direct Chrome Loading**:
   - Unzip the downloaded file
   - In Chrome, go to `chrome://extensions/`
   - Enable "Developer mode" using the toggle in the top-right corner
   - Click "Load unpacked" 
   - Select the entire unzipped project folder (not just a subfolder)
   - If Chrome gives an error about the manifest, try creating a "dist" folder manually and moving the following files into it:
     - Copy `public/manifest.json` to `dist/manifest.json`
     - Copy `public/favicon.ico` to `dist/favicon.ico`
     - Copy `index.html` to `dist/index.html`
     - Create an `assets` folder in `dist` and copy your JavaScript files there

## Loading in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" using the toggle in the top-right corner
3. Click "Load unpacked" and select the `dist` folder from your built project (or the alternative folder if using the alternative method)
4. The extension should now appear in your browser and be ready to use

## Troubleshooting

- If you see npm errors, try the alternative build method above
- If Chrome gives an error about the manifest file, ensure your manifest.json is properly formatted and in the correct location
- If the extension doesn't appear after loading, check Chrome's Developer Tools console for errors (right-click the extension icon and select "Inspect")

## Extension Structure

- `public/manifest.json`: Defines how Chrome sees your extension
- `src/background.ts`: Background script that runs when the extension is installed
- Other React files: Handle the popup UI when users click the extension icon
