
interface PriceSummaryProps {
  price: string;
}

const PriceSummary = ({ price }: PriceSummaryProps) => {
  return (
    <div className="bg-culinary-cream/50 p-3 rounded-lg w-full mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm">Subtotal</span>
        <span className="text-sm font-medium">{price}</span>
      </div>
      <div className="flex justify-between mb-1">
        <span className="text-sm">Tax</span>
        <span className="text-sm font-medium">Calculated at checkout</span>
      </div>
      <div className="flex justify-between font-medium mt-2 pt-2 border-t border-culinary-beige">
        <span>Total</span>
        <span>{price}</span>
      </div>
    </div>
  );
};

export default PriceSummary;
