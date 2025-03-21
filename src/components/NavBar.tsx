
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChefHat, Search, User, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

const NavBar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2 group"
        >
          <ChefHat 
            size={28} 
            className="text-culinary-copper transition-all duration-300 group-hover:rotate-12"
          />
          <span className="font-display text-xl font-medium">
            <span className="text-culinary-charcoal">CopyCat</span>
            <span className="text-culinary-copper"> Cuisine</span>
          </span>
        </Link>
        
        <div className="flex items-center space-x-6">
          <NavLink to="/" icon={<Search size={18} />} label="Search" isActive={location.pathname === '/'} />
          <NavLink 
            to="/pricing" 
            icon={<Crown size={18} />} 
            label="Go Premium" 
            isActive={location.pathname === '/pricing'} 
            isPremium
          />
          <NavLink to="/account" icon={<User size={18} />} label="Account" isActive={location.pathname === '/account'} />
        </div>
      </div>
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isPremium?: boolean;
}

const NavLink = ({ to, icon, label, isActive, isPremium }: NavLinkProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "relative flex items-center space-x-1 px-3 py-2 rounded-full transition-all",
        isActive 
          ? "bg-culinary-beige text-culinary-charcoal" 
          : "text-culinary-charcoal/70 hover:text-culinary-charcoal hover:bg-culinary-cream",
        isPremium && "group"
      )}
    >
      {icon}
      <span>{label}</span>
      {isPremium && (
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-culinary-copper rounded-full 
                       group-hover:animate-pulse-slow transition-all"></span>
      )}
    </Link>
  );
};

export default NavBar;
