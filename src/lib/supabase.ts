import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const offlineMode = import.meta.env.VITE_ENABLE_OFFLINE_MODE === 'true';

// Create Supabase client (or mock for offline mode)
export const supabase = offlineMode || !supabaseUrl || !supabaseAnonKey
  ? null
  : createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });

// Check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return !offlineMode && !!supabaseUrl && !!supabaseAnonKey && !!supabase;
};

// Check if offline mode is enabled
export const isOfflineMode = (): boolean => {
  return offlineMode || !supabaseUrl || !supabaseAnonKey;
};

