
import FeatureCard from './FeatureCard';

const FeaturesSection = () => {
  return (
    <div className="mt-16 max-w-4xl mx-auto">
      <h2 className="text-2xl font-display font-medium mb-6 text-center">
        What's Included in Premium?
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FeatureCard 
          title="Unlimited Recipe Searches" 
          description="Search for as many restaurant and store copycat recipes as you want, whenever you want."
        />
        <FeatureCard 
          title="Print & Share Recipes" 
          description="Easily print recipes for your kitchen or share them with friends and family."
        />
        <FeatureCard 
          title="Adjust Portion Sizes" 
          description="Scale recipes up or down to get the perfect amount for your needs."
        />
        <FeatureCard 
          title="Dietary Substitutions" 
          description="Get suggestions for ingredient alternatives to match your dietary preferences."
        />
        <FeatureCard 
          title="Premium Support" 
          description="Get priority assistance if you ever need help with the app."
        />
      </div>
    </div>
  );
};

export default FeaturesSection;
