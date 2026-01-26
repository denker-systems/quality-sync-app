require('dotenv').config();

module.exports = ({ config }) => ({
  ...config,
  plugins: [...(config.plugins || []), 'expo-localization', 'expo-secure-store'],
  extra: {
    ...config.extra,
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey:
      process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  },
});
