
import { motion } from 'framer-motion';
import PremiumFeatureItem from './PremiumFeatureItem';

const PremiumBenefits = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="w-20 h-20 bg-culinary-copper rounded-full flex items-center justify-center mx-auto mb-6">
        <Check size={32} className="text-white" />
      </div>
      
      <h1 className="text-3xl md:text-4xl font-display font-medium mb-4">
        You're Premium!
      </h1>
      
      <p className="text-lg text-muted-foreground mb-8">
        Thank you for your support. You now have access to all premium features.
      </p>
      
      <div className="bg-white/80 backdrop-blur-sm border border-culinary-beige rounded-xl p-6 shadow-sm mb-8">
        <h2 className="text-xl font-medium mb-4">Your Premium Benefits</h2>
        
        <ul className="space-y-3 text-left">
          <PremiumFeatureItem>Unlimited recipe searches</PremiumFeatureItem>
          <PremiumFeatureItem>Print recipes</PremiumFeatureItem>
          <PremiumFeatureItem>Share recipes</PremiumFeatureItem>
          <PremiumFeatureItem>Adjust portion sizes</PremiumFeatureItem>
          <PremiumFeatureItem>Dietary substitutions</PremiumFeatureItem>
        </ul>
      </div>
      
      <button
        onClick={() => window.location.href = '/'}
        className="px-6 py-3 bg-culinary-copper text-white rounded-full hover:bg-culinary-copper/90 transition-colors"
      >
        Start Exploring
      </button>
    </motion.div>
  );
};

import { Check } from 'lucide-react';

export default PremiumBenefits;
