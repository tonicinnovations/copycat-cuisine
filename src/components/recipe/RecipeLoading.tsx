
import { motion } from 'framer-motion';

const RecipeLoading = ({ query }: { query?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <div className="relative w-16 h-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-0 left-0 w-full h-full flex justify-center items-center"
        >
          <div className="relative w-12 h-12 animate-spin">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-culinary-beige rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-culinary-copper rounded-full"></div>
          </div>
        </motion.div>
      </div>
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4 text-muted-foreground"
      >
        Searching for {query ? `"${query}"` : "your recipe"}...
      </motion.p>
    </div>
  );
};

export default RecipeLoading;
