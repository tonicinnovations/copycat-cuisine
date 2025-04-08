
// Supabase configuration
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Set to false to use real payment gateway
const MOCK_MODE = false; 

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  const configured = !!(supabaseUrl && supabaseAnonKey);
  
  if (!configured) {
    console.error('Supabase is not properly configured. Real payment gateway requires Supabase configuration.');
    console.info('To configure Supabase, add the following to your .env file:');
    console.info('VITE_SUPABASE_URL=your-supabase-project-url');
    console.info('VITE_SUPABASE_ANON_KEY=your-supabase-anon-key');
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
    console.error('❌ Supabase configuration is missing or invalid');
  }
};
