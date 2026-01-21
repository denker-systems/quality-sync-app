# Environment Setup

Guide to configuring environment variables and settings for Quality Sync Mobile.

## Environment Variables

The app uses environment variables to configure different aspects of the application. These are managed through the `.env` file.

### Required Variables

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Variable Naming Convention

Expo requires client-side environment variables to be prefixed with `EXPO_PUBLIC_`:

- ✅ `EXPO_PUBLIC_SUPABASE_URL` - Accessible in app
- ❌ `SUPABASE_URL` - Not accessible in app

### Environment Files

The project uses the following environment file structure:

```
.env                 # Local development (gitignored)
.env.example         # Template file (committed to git)
```

> **Security Note:** Never commit `.env` to version control. It contains sensitive credentials.

## Configuration Files

### app.config.js

The `app.config.js` file loads environment variables and configures the Expo app:

```javascript
import 'dotenv/config';

export default {
  expo: {
    name: 'Quality Sync',
    slug: 'quality-sync-app',
    version: '1.0.0',
    // ... other config
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    },
  },
};
```

### Accessing Environment Variables

In your code, access environment variables using:

```typescript
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;
```

Or directly (if prefixed with `EXPO_PUBLIC_`):

```typescript
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
```

## Development vs Production

### Development Environment

For local development, use `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://dev-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=dev-anon-key
```

### Production Environment

For production builds, environment variables are managed through:

1. **EAS Build Secrets** (recommended)
2. **Environment-specific config files**
3. **Build-time configuration**

#### Using EAS Secrets

```bash
# Set production secrets
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://prod.supabase.co"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "prod-key"
```

## Supabase Configuration

### Getting Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Settings** → **API**
4. Copy:
   - **Project URL** → `EXPO_PUBLIC_SUPABASE_URL`
   - **anon public key** → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### Shared Database

The mobile app shares the same Supabase project as the Quality Sync web application:

- Same authentication system
- Same database tables
- Same Row Level Security (RLS) policies
- Same real-time subscriptions

## TypeScript Configuration

### tsconfig.json

The TypeScript configuration includes path aliases for cleaner imports:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

This allows imports like:

```typescript
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/config/supabase';
```

### babel.config.js

Babel is configured to support the path aliases:

```javascript
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
        },
      },
    ],
  ],
};
```

## Metro Configuration

### metro.config.js

Metro bundler configuration for React Native:

```javascript
const { getDefaultConfig } = require('expo/metro-config');

module.exports = getDefaultConfig(__dirname);
```

## Platform-Specific Configuration

### iOS Configuration

iOS-specific settings in `app.config.js`:

```javascript
ios: {
  bundleIdentifier: 'com.denkersystems.qualitysync',
  supportsTablet: true,
  infoPlist: {
    NSCameraUsageDescription: 'Allow Quality Sync to access your camera for profile photos.',
  },
}
```

### Android Configuration

Android-specific settings in `app.config.js`:

```javascript
android: {
  package: 'com.denkersystems.qualitysync',
  adaptiveIcon: {
    foregroundImage: './assets/adaptive-icon.png',
    backgroundColor: '#FFFFFF',
  },
  permissions: ['CAMERA'],
}
```

## Development Tools Configuration

### ESLint (Future)

When adding ESLint, create `.eslintrc.js`:

```javascript
module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
};
```

### Prettier (Future)

When adding Prettier, create `.prettierrc`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

## Troubleshooting

### Environment Variables Not Loading

1. **Restart Metro bundler:**
   ```bash
   npm start -- --clear
   ```

2. **Verify .env file exists:**
   ```bash
   ls -la .env
   ```

3. **Check variable naming:**
   - Must start with `EXPO_PUBLIC_`
   - No spaces around `=`
   - No quotes needed for values

### TypeScript Path Aliases Not Working

1. **Restart TypeScript server** in VS Code
2. **Clear Metro cache:**
   ```bash
   npm start -- --clear
   ```

### Supabase Connection Issues

1. **Verify credentials** in `.env`
2. **Check Supabase project status** in dashboard
3. **Test connection** in browser: visit `EXPO_PUBLIC_SUPABASE_URL`

## Best Practices

1. **Never commit `.env`** - Always in `.gitignore`
2. **Use `.env.example`** - Template for other developers
3. **Prefix public variables** - Use `EXPO_PUBLIC_` for client-side
4. **Document all variables** - Add comments in `.env.example`
5. **Use EAS Secrets** - For production builds
6. **Rotate keys regularly** - Especially after team changes

## Next Steps

- Learn about [Project Structure](./PROJECT_STRUCTURE.md)
- Understand [Supabase Setup](../backend/SUPABASE.md)
- Review [Development Workflow](../development/WORKFLOW.md)

---

**Last Updated:** 2026-01-20
