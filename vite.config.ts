
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
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        background: path.resolve(__dirname, "src/background.ts"),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // Output background.js directly to the root of dist
          // This ensures the file is at /dist/background.js and not /dist/assets/background.js
          return chunkInfo.name === 'background' ? '[name].js' : 'assets/[name].[hash].js';
        },
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`,
        // Enhanced manual chunks for better code splitting
        manualChunks: (id) => {
          // React core in a separate chunk
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom')) {
            return 'vendor-react-core';
          }
          
          // React ecosystem packages
          if (id.includes('node_modules/react-router') ||
              id.includes('node_modules/react-hook-form')) {
            return 'vendor-react-ecosystem';
          }
          
          // Animation libraries
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-animation';
          }
          
          // Radix UI components by feature
          if (id.includes('node_modules/@radix-ui/react-dialog') ||
              id.includes('node_modules/@radix-ui/react-popover') ||
              id.includes('node_modules/@radix-ui/react-sheet')) {
            return 'vendor-radix-overlays';
          }
          
          if (id.includes('node_modules/@radix-ui/react-tabs') ||
              id.includes('node_modules/@radix-ui/react-accordion') ||
              id.includes('node_modules/@radix-ui/react-collapsible')) {
            return 'vendor-radix-disclosure';
          }
          
          if (id.includes('node_modules/@radix-ui/react-form') ||
              id.includes('node_modules/@radix-ui/react-select') ||
              id.includes('node_modules/@radix-ui/react-checkbox') ||
              id.includes('node_modules/@radix-ui/react-radio')) {
            return 'vendor-radix-forms';
          }
          
          // Other Radix components
          if (id.includes('node_modules/@radix-ui')) {
            return 'vendor-radix-other';
          }
          
          // UI utilities
          if (id.includes('node_modules/lucide-react') || 
              id.includes('node_modules/tailwind-merge') || 
              id.includes('node_modules/class-variance-authority')) {
            return 'vendor-ui-utils';
          }
          
          // Data handling
          if (id.includes('node_modules/@tanstack')) {
            return 'vendor-tanstack';
          }
          
          // Validation
          if (id.includes('node_modules/zod')) {
            return 'vendor-validation';
          }
          
          // Date handling
          if (id.includes('node_modules/date-fns')) {
            return 'vendor-dates';
          }
          
          // Return undefined for everything else to let Rollup decide
          return undefined;
        }
      }
    }
  }
}));
