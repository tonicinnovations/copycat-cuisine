
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Your PayPal client ID
const PAYPAL_CLIENT_ID = "AWlG0jsULIbL7Un-uRUaB88Q_zn8Vu09fpwqI-sm9p9iV0IdgiASJwFUQvX3slmCYAuXRn9UrudgwVx5";

interface CancelSubscriptionButtonProps {
  subscriptionId: string;
  onCancelled: () => void;
  onError?: (error: any) => void;
}

const CancelSubscriptionButton = ({ 
  subscriptionId, 
  onCancelled,
  onError
}: CancelSubscriptionButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const cancelSubscription = async () => {
    try {
      setIsLoading(true);
      
      // Load the PayPal SDK if not already loaded
      if (!window.paypal) {
        await loadPayPalScript();
      }
      
      // Get access token from PayPal API
      const accessToken = await getPayPalAccessToken();
      
      if (!accessToken) {
        throw new Error("Failed to get PayPal access token");
      }
      
      // Call PayPal API to cancel subscription
      const response = await fetch(`https://api-m.paypal.com/v1/billing/subscriptions/${subscriptionId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          reason: "Customer requested cancellation"
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`PayPal error: ${errorData.message || 'Failed to cancel subscription'}`);
      }
      
      // Success - call the onCancelled callback
      toast.success("Your subscription has been cancelled. You'll have access until the end of your billing period.");
      onCancelled();
    } catch (error) {
      console.error("Subscription cancellation error:", error);
      toast.error("Could not cancel subscription. Please try again or contact support.");
      if (onError) onError(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to load PayPal script
  const loadPayPalScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&vault=true`;
      script.addEventListener('load', () => resolve());
      script.addEventListener('error', () => reject(new Error('Failed to load PayPal SDK')));
      document.body.appendChild(script);
    });
  };
  
  // Helper function to get PayPal access token
  const getPayPalAccessToken = async (): Promise<string | null> => {
    try {
      // For security reasons, this should ideally be done through your backend
      // This frontend-only approach is simplified for demonstration
      // In production, you should route this request through your server
      
      // NOTE: This is a simplified example and won't work directly
      // Your backend needs to securely store and use client_id and client_secret
      // to get an access token and relay the cancellation request
      
      // Instead, we'll inform the user to cancel through PayPal directly
      toast.info("For security reasons, please cancel your subscription through your PayPal account.");
      window.open('https://www.paypal.com/myaccount/autopay/', '_blank');
      
      // Return null as we're redirecting user to PayPal
      return null;
    } catch (error) {
      console.error("Error getting PayPal access token:", error);
      return null;
    }
  };
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={cancelSubscription}
      disabled={isLoading}
      className="border-red-300 text-red-600 hover:bg-red-50"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Cancelling...
        </>
      ) : (
        "Cancel Subscription"
      )}
    </Button>
  );
};

export default CancelSubscriptionButton;
