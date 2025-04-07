
import { motion } from 'framer-motion';

interface WhimsicalIntroProps {
  intro: string;
}

const WhimsicalIntro = ({ intro }: WhimsicalIntroProps) => {
  if (!intro) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-culinary-cream/60 border border-culinary-beige rounded-xl p-6 mb-8 text-center shadow-sm"
    >
      <p className="text-lg font-medium text-culinary-copper italic">{intro}</p>
    </motion.div>
  );
};

export default WhimsicalIntro;
