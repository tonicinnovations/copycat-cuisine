
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChefHat } from 'lucide-react';
import NavBar from '@/components/NavBar';
import SearchBar from '@/components/SearchBar';
import { getPremiumStatus } from '@/utils/storage';

const Index = () => {
  const [isPremium, setIsPremium] = useState(false);
  
  useEffect(() => {
    const status = getPremiumStatus();
    setIsPremium(status.isPremium);
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-culinary-cream to-white">
      <NavBar />
      
      <main className="pt-24 pb-16 px-4 container max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div className="w-20 h-20 bg-culinary-beige rounded-full flex items-center justify-center mx-auto mb-4">
              <ChefHat size={32} className="text-culinary-copper" />
            </div>
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-display font-medium mb-4 text-culinary-charcoal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              CopyCat Cuisine
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Discover secret recipes from your favorite restaurants and stores, 
              crafted with a pinch of AI magic.
            </motion.p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="w-full max-w-3xl mx-auto"
          >
            <SearchBar isPremium={isPremium} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center"
          >
            <FeatureCard 
              title="Restaurant Favorites"
              description="Recreate signature dishes from Olive Garden, Cheesecake Factory, and more."
              icon="🍝"
              delay={1.1}
            />
            <FeatureCard 
              title="Coffee Shop Secrets"
              description="Brew your own Starbucks and Dunkin' specialties at home for a fraction of the cost."
              icon="☕"
              delay={1.3}
            />
            <FeatureCard 
              title="Store-Bought Classics"
              description="Make grocery store favorites from scratch with simple ingredients."
              icon="🥖"
              delay={1.5}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7, duration: 0.8 }}
            className="mt-12"
          >
            <p className="text-sm text-muted-foreground">
              Try searching for: "Olive Garden Breadsticks," "Starbucks Pumpkin Spice Latte," or "Chipotle Guacamole"
            </p>
          </motion.div>
        </div>
      </main>
      
      <footer className="py-6 border-t border-culinary-beige bg-white">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} CopyCat Cuisine. All rights reserved.</p>
          <p className="mt-1">Not affiliated with any restaurants or brands mentioned.</p>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  delay: number;
}

const FeatureCard = ({ title, description, icon, delay }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-white/60 backdrop-blur-sm border border-culinary-beige rounded-xl p-6
                shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="w-12 h-12 rounded-full bg-culinary-cream flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </motion.div>
  );
};

export default Index;
