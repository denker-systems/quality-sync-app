# Quick Start Guide

Get the Quality Sync Mobile app running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- iOS Simulator (macOS) or Android Emulator

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Start Development Server

```bash
npm start
```

### 4. Run the App

**iOS:**

```bash
npm run ios
```

**Android:**

```bash
npm run android
```

## Test the App

1. The **Login Screen** will appear
2. Enter your credentials
3. Complete **MFA enrollment** if prompted (scan QR code with Google Authenticator)
4. Enter **6-digit MFA code** to verify
5. You'll see the **Profile Screen**

## Next Steps

- Read the [Installation Guide](./INSTALLATION.md) for detailed setup
- Learn about [Project Structure](./PROJECT_STRUCTURE.md)
- Understand [Environment Setup](./ENVIRONMENT.md)

## Common Issues

### Metro Bundler Cache Issues

```bash
npm start -- --clear
```

### Module Resolution Errors

```bash
rm -rf node_modules
npm install
```

### iOS Simulator Not Starting

```bash
open -a Simulator
npm run ios
```

## Need Help?

Check the [Troubleshooting Guide](../reference/TROUBLESHOOTING.md) for more solutions.
