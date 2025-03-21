
import { motion } from 'framer-motion';

interface FeatureProps {
  title: string;
  description: string;
}

const FeatureCard = ({ title, description }: FeatureProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white/60 backdrop-blur-sm border border-culinary-beige rounded-lg p-5 shadow-sm"
  >
    <h3 className="text-lg font-medium mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </motion.div>
);

export default FeatureCard;
