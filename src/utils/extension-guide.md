
# CopyCat Cuisine Extension Guide

## Building the Extension

1. **Using the Lovable Platform**:
   - Click the "Share" button in the top right corner
   - Select "Download" to get a zip file of your project

2. **On Your Computer**:
   - Unzip the downloaded file
   - Open a terminal in the unzipped folder
   - Run `npm install` to install dependencies
   - Run `npm run build` to build the extension
   - The built extension will be in the `dist` folder

## Loading in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" using the toggle in the top-right corner
3. Click "Load unpacked" and select the `dist` folder from your built project
4. The extension should now appear in your browser and be ready to use

## Updating Your Extension

After making changes to your code:
1. Run `npm run build` again
2. Go to `chrome://extensions/`
3. Click the refresh icon on your extension card

## Extension Structure

- `public/manifest.json`: Defines how Chrome sees your extension
- `src/background.ts`: Background script that runs when the extension is installed
- Other React files: Handle the popup UI when users click the extension icon
