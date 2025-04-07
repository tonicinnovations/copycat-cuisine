
import { motion } from 'framer-motion';
import PricingCard from '../PricingCard';

interface PricingPlansProps {
  onSelectPlan: (name: string, price: string, period: string) => void;
}

const PricingPlans = ({ onSelectPlan }: PricingPlansProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <PricingCard
          title="Monthly"
          price="$5.99"
          period="month"
          description="Perfect for short-term culinary adventures"
          features={[
            "Unlimited recipe searches",
            "Print recipes",
            "Share recipes", 
            "Adjust portion sizes",
            "Dietary substitutions"
          ]}
          ctaText="Subscribe Monthly"
          onSelect={() => onSelectPlan("Monthly", "$5.99", "month")}
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <PricingCard
          title="Annual"
          price="$49.99"
          period="year"
          description="Our most popular plan - save over 15%"
          features={[
            "Unlimited recipe searches",
            "Print recipes",
            "Share recipes", 
            "Adjust portion sizes",
            "Dietary substitutions",
            "Priority customer support"
          ]}
          isPopular
          ctaText="Subscribe Annually"
          onSelect={() => onSelectPlan("Annual", "$49.99", "year")}
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <PricingCard
          title="Lifetime"
          price="$129.99"
          period="one-time"
          description="One payment, unlimited access forever"
          features={[
            "Unlimited recipe searches",
            "Print recipes",
            "Share recipes", 
            "Adjust portion sizes",
            "Dietary substitutions",
            "Priority customer support",
            "Free future updates"
          ]}
          ctaText="Get Lifetime Access"
          onSelect={() => onSelectPlan("Lifetime", "$129.99", "lifetime")}
        />
      </motion.div>
    </div>
  );
};

export default PricingPlans;
