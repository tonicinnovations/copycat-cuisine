
interface RecipeNotesProps {
  notes?: string;
}

const RecipeNotes = ({ notes }: RecipeNotesProps) => {
  if (!notes) return null;
  
  return (
    <div className="mt-8 p-4 bg-culinary-cream rounded-lg">
      <h3 className="font-medium mb-2">Chef's Notes</h3>
      <p className="text-muted-foreground">{notes}</p>
    </div>
  );
};

export default RecipeNotes;
