import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { copyFileSync } from "fs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    {
      name: 'copy-manifest',
      buildEnd() {
        // This will run at the end of the build process
        console.log('Preparing to copy manifest.json...');
      },
      closeBundle() {
        try {
          // Ensure the manifest is copied to the dist folder
          copyFileSync(
            path.resolve(__dirname, 'public/manifest.json'),
            path.resolve(__dirname, 'dist/manifest.json')
          );
          console.log('✅ manifest.json copied to dist folder');
        } catch (error) {
          console.error('Failed to copy manifest.json:', error);
        }
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    assetsInlineLimit: 0,
    outDir: "dist",
    chunkSizeWarningLimit: 1500, // Increased from 1000 to 1500kb
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        background: path.resolve(__dirname, "src/background.ts"),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // Output background.js directly to the root of dist
          return chunkInfo.name === 'background' ? '[name].js' : 'assets/[name].[hash].js';
        },
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`,
        // Improved manual chunks configuration for better code splitting
        manualChunks: (id) => {
          // React and related packages in a single chunk
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom') || 
              id.includes('node_modules/react-router-dom') || 
              id.includes('node_modules/framer-motion')) {
            return 'vendor-react';
          }
          
          // UI components from Radix
          if (id.includes('node_modules/@radix-ui')) {
            return 'vendor-radix';
          }
          
          // Other UI-related packages
          if (id.includes('node_modules/lucide-react') || 
              id.includes('node_modules/tailwind-merge') || 
              id.includes('node_modules/class-variance-authority')) {
            return 'vendor-ui';
          }
          
          // Data handling and forms
          if (id.includes('node_modules/@tanstack') || 
              id.includes('node_modules/react-hook-form') ||
              id.includes('node_modules/zod')) {
            return 'vendor-data';
          }
          
          // Return undefined for everything else to let Rollup decide
          return undefined;
        }
      }
    }
  }
}));
