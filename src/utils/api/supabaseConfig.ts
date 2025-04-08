
// Supabase configuration
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  const configured = !!(supabaseUrl && supabaseAnonKey);
  
  if (!configured) {
    console.error('Supabase is not properly configured. Please check that you have added the following to your .env file:');
    console.error('VITE_SUPABASE_URL=your-supabase-project-url');
    console.error('VITE_SUPABASE_ANON_KEY=your-supabase-anon-key');
    console.error('You can find these values in your Supabase dashboard under Project Settings > API');
  } else {
    console.log('Supabase configuration detected:', { url: supabaseUrl.substring(0, 15) + '...' });
  }
  
  return configured;
};

// Call this function to quickly test the configuration
export const testSupabaseConfig = (): void => {
  if (isSupabaseConfigured()) {
    console.log('✅ Supabase configuration is valid');
  } else {
    console.log('❌ Supabase configuration is missing or invalid');
  }
};
