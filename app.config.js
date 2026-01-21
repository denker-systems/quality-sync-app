require('dotenv').config();

module.exports = ({ config }) => ({
  ...config,
  plugins: [
    ...(config.plugins || []),
    'expo-localization',
  ],
  extra: {
    ...config.extra,
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://gezwyczyzvzkujfsohyt.supabase.co',
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdlend5Y3p5enZ6a3VqZnNvaHl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5Njk1MjIsImV4cCI6MjA2OTU0NTUyMn0.SUTZcZ29w9-VvLTeBY67CbTfK1NXhc3WZJSx8Pl2P5M',
  },
});
