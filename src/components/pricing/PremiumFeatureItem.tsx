
import { Check } from 'lucide-react';

interface PremiumFeatureItemProps {
  children: React.ReactNode;
}

const PremiumFeatureItem = ({ children }: PremiumFeatureItemProps) => (
  <li className="flex items-start">
    <Check size={18} className="text-culinary-copper mt-0.5 mr-2 flex-shrink-0" />
    <span>{children}</span>
  </li>
);

export default PremiumFeatureItem;
