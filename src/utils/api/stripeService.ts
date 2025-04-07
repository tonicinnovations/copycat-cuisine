
import { toast } from "sonner";

// Function to redirect to Stripe Checkout
export const processStripePayment = async (plan: string, paymentDetails: any): Promise<boolean> => {
  try {
    // This function is kept for backwards compatibility
    // In a real implementation, this would redirect to Stripe Checkout
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
    
    // Get authentication token if available (for future implementation)
    const token = localStorage.getItem('supabase.auth.token');
    
    // Call Supabase Edge Function to create a checkout session
    const response = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        plan: {
          name: `CopyCat Cuisine ${plan.name} Plan`,
          priceInCents,
          interval: plan.period === 'month' ? 'month' : 
                   plan.period === 'year' ? 'year' : null
        }
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create checkout session');
    }
    
    const { url, sessionId } = await response.json();
    
    // For lifetime plan (one-time payment), store this info in localStorage
    // In a real implementation, this would be stored in a database
    if (plan.period === 'lifetime') {
      localStorage.setItem('copycat_subscription_id', sessionId);
      localStorage.setItem('copycat_subscription_period', plan.period);
    }
    
    // Redirect to Stripe Checkout
    window.location.href = url;
    
    return { sessionId, url };
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    toast.error("Failed to initialize payment. Please try again.");
    return null;
  }
};

// Helper function to verify subscription status
export const verifySubscription = async (): Promise<boolean> => {
  try {
    // Get authentication token if available
    const token = localStorage.getItem('supabase.auth.token');
    
    // Call Supabase Edge Function to verify subscription status
    const response = await fetch('/api/check-subscription', {
      method: 'GET',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to verify subscription');
    }
    
    const { subscribed } = await response.json();
    return subscribed;
  } catch (error) {
    console.error("Error verifying subscription:", error);
    return false;
  }
};
