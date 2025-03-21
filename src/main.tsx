
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Make sure DOM is loaded before rendering (important for Chrome extensions)
document.addEventListener('DOMContentLoaded', () => {
  createRoot(document.getElementById("root")!).render(<App />);
});
