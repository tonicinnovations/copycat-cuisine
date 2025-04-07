
import { Info } from 'lucide-react';

const RecipeFooter = () => {
  return (
    <footer className="py-6 border-t border-culinary-beige bg-white print:hidden">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center mb-3 text-culinary-copper">
          <Info size={16} className="mr-1" />
          <p className="font-medium">New! Find copycat recipes directly on restaurant websites with our extension.</p>
        </div>
        <p>© {new Date().getFullYear()} CopyCat Cuisine. All rights reserved.</p>
        <p className="mt-1">Not affiliated with any restaurants or brands mentioned.</p>
      </div>
    </footer>
  );
};

export default RecipeFooter;
