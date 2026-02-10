
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Use a dummy client if credentials are missing to prevent "Failed to fetch" on startup
// and allow the UI to show a more helpful error message.
const isConfigured = !!(SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_URL.includes('your-project-url'));

export const supabase = createClient(
  isConfigured ? SUPABASE_URL : 'https://placeholder-to-avoid-crash.supabase.co',
  isConfigured ? SUPABASE_ANON_KEY : 'placeholder-key'
);

export const checkConfig = () => isConfigured;
