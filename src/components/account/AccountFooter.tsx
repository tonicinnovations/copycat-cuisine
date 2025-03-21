
const AccountFooter = () => {
  return (
    <footer className="py-6 border-t border-culinary-beige bg-white">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} CopyCat Cuisine. All rights reserved.</p>
        <p className="mt-1">Not affiliated with any restaurants or brands mentioned.</p>
      </div>
    </footer>
  );
};

export default AccountFooter;
