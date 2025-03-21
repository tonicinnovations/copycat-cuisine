
interface InstructionsListProps {
  instructions: string[];
}

const InstructionsList = ({ instructions }: InstructionsListProps) => {
  return (
    <div className="md:col-span-2">
      <h2 className="text-xl font-display font-medium mb-4">Instructions</h2>
      <ol className="space-y-4">
        {instructions.map((instruction, index) => (
          <li key={index} className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-culinary-cream rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-culinary-charcoal">{index + 1}</span>
            </div>
            <p className="flex-1">{instruction}</p>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default InstructionsList;
