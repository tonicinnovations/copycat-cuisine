
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AccountHeader = () => {
  const navigate = useNavigate();
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={() => navigate('/')}
      className="mb-6 text-sm border-culinary-beige hover:bg-culinary-cream"
    >
      <ArrowLeft size={16} className="mr-1" />
      Back to Home
    </Button>
  );
};

export default AccountHeader;
