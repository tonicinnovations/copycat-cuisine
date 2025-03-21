
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Make sure DOM is loaded before rendering (important for Chrome extensions)
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    createRoot(rootElement).render(<App />);
  } else {
    console.error("Root element not found");
  }
});
