
import { Info, ExternalLink } from 'lucide-react';

const RecipeFooter = () => {
  const isExtension = window.location.href.includes('chrome-extension://');
  
  return (
    <footer className="py-6 border-t border-culinary-beige bg-white print:hidden">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center mb-3 text-culinary-copper">
          <Info size={16} className="mr-1" />
          <p className="font-medium">New! Find copycat recipes directly on restaurant websites with our extension.</p>
        </div>
        
        {isExtension && (
          <div className="mt-2 mb-3 p-3 border border-culinary-beige rounded-md bg-culinary-cream">
            <h4 className="font-medium mb-1">Testing Your Extension</h4>
            <p className="text-xs">
              Visit any restaurant website (like mcdonalds.com) to see "Get Copycat Recipe" buttons.
              You can also right-click and select text on any webpage, then choose "Find Copycat Recipe".
            </p>
            <p className="text-xs mt-2">
              For easy testing, visit any website with <code>?copycattest=true</code> added to the URL to show a test panel.
            </p>
          </div>
        )}
        
        <p>© {new Date().getFullYear()} CopyCat Cuisine. All rights reserved.</p>
        <p className="mt-1">Not affiliated with any restaurants or brands mentioned.</p>
      </div>
    </footer>
  );
};

export default RecipeFooter;
