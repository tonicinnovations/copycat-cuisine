
# Supabase and Stripe Setup Instructions

## Step 1: Set Up Supabase Environment Variables

For your Chrome extension to connect to Supabase, add these variables to your project:

1. Create a `.env` file in the root of your project (if it doesn't exist)
2. Add the following lines:

```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

You can find these values in your Supabase dashboard:
- Go to Project Settings > API
- Copy the URL from "Project URL"
- Copy the anon/public key from "Project API keys"

## Step 2: Add Stripe Secret Key to Supabase

For Stripe integration to work:

1. Go to your Supabase dashboard
2. Navigate to Edge Functions > Secrets
3. Add a new secret with:
   - Key: `STRIPE_SECRET_KEY`
   - Value: Your Stripe secret key (from Stripe Dashboard > Developers > API keys)

## Step 3: Deploy Edge Functions

Make sure to deploy these edge functions to Supabase:
- `create-checkout`
- `check-subscription`

You can deploy them using the Supabase CLI or through the Supabase dashboard.

## Testing

After setting up everything, test your payment flow by:
1. Going to the pricing page
2. Selecting a plan
3. Clicking on the "Pay with Stripe" button

Check the console logs for any errors or success messages.
