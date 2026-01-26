import 'react-native-url-polyfill/auto';
import Constants from 'expo-constants';
import { createClient } from '@supabase/supabase-js';
import { authStorage } from '@/config/secure-storage';
import type { Database } from '@/types/database.types';

const extra = (Constants.expoConfig?.extra ||
  (Constants.manifest as { extra?: Record<string, string> } | undefined)?.extra ||
  (Constants.manifest2 as { extra?: Record<string, string> } | undefined)?.extra) as
  | {
      supabaseUrl?: string;
      supabaseAnonKey?: string;
    }
  | undefined;

const configuredUrl = extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const configuredAnonKey =
  extra?.supabaseAnonKey ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  '';

if (!configuredUrl || !configuredAnonKey) {
  console.warn('⚠️ Supabase not configured - using placeholder values');
}

const supabaseUrl = configuredUrl || 'https://placeholder.supabase.co';
const supabaseAnonKey = configuredAnonKey || 'placeholder-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: authStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Important for React Native!
    flowType: 'pkce',
  },
});
