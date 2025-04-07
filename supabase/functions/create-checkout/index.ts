
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Initialize Supabase client
  let supabaseClient;
  try {
    supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    
    if (!Deno.env.get("SUPABASE_URL") || !Deno.env.get("SUPABASE_ANON_KEY")) {
      throw new Error("Missing Supabase URL or anon key in environment");
    }
  } catch (error) {
    console.error("Supabase client initialization error:", error);
    return new Response(JSON.stringify({ 
      error: "Failed to initialize Supabase client",
      details: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }

  try {
    // Parse request body
    const requestData = await req.json();
    const { plan } = requestData;

    if (!plan || !plan.name || !plan.priceInCents) {
      throw new Error("Invalid plan data");
    }

    // Get user from auth header if available
    let user = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabaseClient.auth.getUser(token);
      user = data.user;
    }

    // Initialize Stripe
    let stripe;
    try {
      const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
      if (!stripeKey) {
        throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
      }
      
      stripe = new Stripe(stripeKey, {
        apiVersion: "2023-10-16",
      });
    } catch (error) {
      console.error("Stripe initialization error:", error);
      return new Response(JSON.stringify({ 
        error: "Failed to initialize Stripe",
        details: error.message 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    // Check if an existing Stripe customer record exists
    let customerId;
    if (user?.email) {
      const customers = await stripe.customers.list({ email: user.email, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      }
    }

    // Define the payment parameters
    const checkoutParams: any = {
      customer: customerId,
      customer_email: customerId ? undefined : user?.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: plan.name },
            unit_amount: plan.priceInCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${req.headers.get("origin")}/pricing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/pricing?canceled=true`,
    };

    // Handle different payment types (subscription vs one-time)
    if (plan.interval) {
      // Subscription payment
      checkoutParams.mode = "subscription";
      checkoutParams.line_items[0].price_data.recurring = {
        interval: plan.interval
      };
    } else {
      // One-time payment
      checkoutParams.mode = "payment";
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create(checkoutParams);

    // Return the session URL and ID
    return new Response(JSON.stringify({ 
      url: session.url,
      sessionId: session.id
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      stack: error.stack
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
