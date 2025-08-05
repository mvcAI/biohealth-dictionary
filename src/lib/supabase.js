import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if Supabase is properly configured
const isSupabaseConfigured = supabaseUrl &&
                            supabaseAnonKey &&
                            supabaseUrl !== 'your_supabase_project_url' &&
                            supabaseAnonKey !== 'your_supabase_anon_key' &&
                            supabaseUrl.startsWith('http')

let supabase = null

if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.warn('Error creating Supabase client:', error)
  }
} else {
  console.log('Supabase not configured - running in demo mode with local data')
}

export { supabase, isSupabaseConfigured }
