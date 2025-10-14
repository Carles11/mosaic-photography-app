import { createClient } from '@supabase/supabase-js';

// This works with Expo .env and expo-constants.
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);