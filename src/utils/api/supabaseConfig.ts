
// Supabase configuration
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  const configured = !!(supabaseUrl && supabaseAnonKey);
  
  if (!configured) {
    console.error('Supabase is not properly configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
  }
  
  return configured;
};
