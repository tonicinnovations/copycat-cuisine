
// Supabase configuration
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Mock data for development when Supabase is not configured
const MOCK_MODE = true; // Set to false in production

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  const configured = !!(supabaseUrl && supabaseAnonKey);
  
  if (!configured) {
    console.warn('Supabase is not properly configured. Using mock mode for development.');
    console.info('To configure Supabase, add the following to your .env file:');
    console.info('VITE_SUPABASE_URL=your-supabase-project-url');
    console.info('VITE_SUPABASE_ANON_KEY=your-supabase-anon-key');
  } else {
    console.log('Supabase configuration detected:', { url: supabaseUrl.substring(0, 15) + '...' });
  }
  
  return configured || MOCK_MODE;
};

// Call this function to quickly test the configuration
export const testSupabaseConfig = (): void => {
  if (isSupabaseConfigured()) {
    console.log('✅ Supabase configuration is valid or running in mock mode');
  } else {
    console.log('❌ Supabase configuration is missing or invalid');
  }
};
