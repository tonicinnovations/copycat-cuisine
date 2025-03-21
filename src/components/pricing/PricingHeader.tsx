
import { motion } from 'framer-motion';

const PricingHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-12"
    >
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium mb-4">
        Upgrade to Premium
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Unlock all features and enjoy unlimited recipe searches with a premium subscription.
      </p>
    </motion.div>
  );
};

export default PricingHeader;
