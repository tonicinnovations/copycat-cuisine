
import { toast } from "sonner";

// Function to simulate processing a payment
export const processPayment = async (plan: string, paymentDetails: any): Promise<boolean> => {
  return new Promise((resolve) => {
    // Simulate payment processing delay
    setTimeout(() => {
      // Always succeed for demo purposes
      const success = true;
      
      if (success) {
        toast.success(`Successfully upgraded to ${plan} plan!`);
      } else {
        toast.error("Payment processing failed. Please try again.");
      }
      
      resolve(success);
    }, 2000);
  });
};
