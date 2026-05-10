import { createClient } from '@supabase/supabase-js'

// Use fallbacks to prevent the app from crashing if the user hasn't configured Supabase yet.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL !== 'your_supabase_url_here' 
  ? import.meta.env.VITE_SUPABASE_URL 
  : 'https://placeholder.supabase.co'

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY !== 'your_supabase_anon_key_here'
  ? import.meta.env.VITE_SUPABASE_ANON_KEY
  : 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
