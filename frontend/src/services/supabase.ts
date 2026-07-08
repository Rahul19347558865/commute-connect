import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Warning: VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY environment variables are missing. Supabase functionality will fail at runtime.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
