
import { toast } from "sonner";

// Function to redirect to Stripe Checkout
export const processStripePayment = async (plan: string, paymentDetails: any): Promise<boolean> => {
  try {
    // In a real implementation, this would redirect to Stripe Checkout
    // For demo purposes, simulate success
    toast.success(`Successfully upgraded to ${plan} plan!`);
    return true;
  } catch (error) {
    console.error("Payment processing error:", error);
    toast.error("Payment processing failed. Please try again.");
    return false;
  }
};

// Create a Stripe Checkout session and redirect the user
export const createStripeCheckoutSession = async (plan: {
  name: string;
  price: string;
  period: string;
}): Promise<{ sessionId: string; url: string } | null> => {
  try {
    // Convert price from string format (e.g., "$49.99") to cents for Stripe
    const priceInDollars = parseFloat(plan.price.replace('$', ''));
    const priceInCents = Math.round(priceInDollars * 100);
    
    // Build product name based on plan
    const productName = `CopyCat Cuisine ${plan.name} Plan`;
    
    // Configure Stripe Checkout
    const stripe = await loadStripe(process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx');
    
    if (!stripe) {
      throw new Error("Failed to load Stripe");
    }
    
    // For a real implementation, we would call a backend endpoint to create a session
    // For now, simulate creating a session ID and redirect URL
    const sessionId = `cs_test_${Math.random().toString(36).substring(2, 15)}`;
    
    // In a real implementation, this URL would come from a backend call
    // For now, we'll use a mock URL for demonstration
    const checkoutUrl = `https://checkout.stripe.com/c/pay/${sessionId}`;
    
    // Redirect to Stripe Checkout
    window.location.href = checkoutUrl;
    
    return {
      sessionId,
      url: checkoutUrl
    };
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    toast.error("Failed to initialize payment. Please try again.");
    return null;
  }
};

// Helper function to load Stripe.js
const loadStripe = async (publishableKey: string) => {
  if (!window.Stripe) {
    // Load Stripe.js dynamically
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    document.body.appendChild(script);
    
    // Wait for Stripe to load
    await new Promise((resolve) => {
      script.onload = resolve;
    });
  }
  
  return window.Stripe?.(publishableKey);
};

// Add Stripe type definition
declare global {
  interface Window {
    Stripe?: (key: string) => any;
  }
}
