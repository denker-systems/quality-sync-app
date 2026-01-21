import 'react-native-url-polyfill/auto';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

const extra = (Constants.expoConfig?.extra ||
  (Constants.manifest as { extra?: Record<string, string> } | undefined)?.extra ||
  (Constants.manifest2 as { extra?: Record<string, string> } | undefined)?.extra) as
  | {
      supabaseUrl?: string;
      supabaseAnonKey?: string;
    }
  | undefined;

// Debug logging
console.log('🔍 Supabase Config Debug:');
console.log('  Constants.expoConfig:', Constants.expoConfig);
console.log('  extra:', extra);
console.log('  extra?.supabaseUrl:', extra?.supabaseUrl);
console.log('  process.env.EXPO_PUBLIC_SUPABASE_URL:', process.env.EXPO_PUBLIC_SUPABASE_URL);

const supabaseUrl =
  extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey =
  extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

console.log('📍 Final values:');
console.log('  supabaseUrl:', supabaseUrl);
console.log('  supabaseAnonKey:', supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'NOT SET');

// Varning istället för error så appen kan starta
if (!extra?.supabaseUrl && !process.env.EXPO_PUBLIC_SUPABASE_URL) {
  console.warn('⚠️ Supabase not configured - using placeholder values');
} else {
  console.log('✅ Supabase configured successfully');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Important for React Native!
    flowType: 'pkce',
  },
});
