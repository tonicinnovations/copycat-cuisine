import { toast } from "sonner";
import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseAnonKey, isSupabaseConfigured } from './supabaseConfig';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
    // Check if Supabase is properly configured
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase configuration is missing. Cannot process payment without proper configuration.');
    }
    
    // Convert price from string format (e.g., "$49.99") to cents for Stripe
    const priceInDollars = parseFloat(plan.price.replace('$', ''));
    const priceInCents = Math.round(priceInDollars * 100);
    
    console.log('Creating Stripe checkout session for:', plan.name, 'at price:', priceInCents, 'cents');
    
    // Call Supabase Edge Function to create a checkout session
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: JSON.stringify({
        plan: {
          name: `CopyCat Cuisine ${plan.name} Plan`,
          priceInCents,
          interval: plan.period === 'month' ? 'month' : 
                   plan.period === 'year' ? 'year' : null
        }
      })
    });

    if (error) {
      console.error("Error calling create-checkout function:", error);
      throw new Error(error.message || 'Failed to create checkout session');
    }
    
    if (!data || !data.url) {
      console.error("Invalid response from create-checkout function:", data);
      throw new Error('Invalid response from checkout service');
    }
    
    const { url, sessionId } = data;
    console.log('Checkout session created:', sessionId, 'redirecting to:', url);
    
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
    // Check if Supabase is properly configured
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase configuration is missing. Cannot verify subscription without proper configuration.');
    }
    
    // Call Supabase Edge Function to verify subscription status
    const { data, error } = await supabase.functions.invoke("check-subscription");
    
    if (error) {
      console.error("Error calling check-subscription function:", error);
      throw new Error(error.message || 'Failed to verify subscription');
    }
    
    const { subscribed } = data;
    return subscribed;
  } catch (error) {
    console.error("Error verifying subscription:", error);
    return false;
  }
};
