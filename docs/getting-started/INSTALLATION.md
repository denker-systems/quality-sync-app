# Installation Guide

Complete installation guide for Quality Sync Mobile app.

## System Requirements

### Required

- **Node.js:** 18.x or higher
- **npm:** 9.x or higher (comes with Node.js)
- **Expo CLI:** Installed automatically with dependencies
- **Git:** For version control

### Platform-Specific Requirements

#### iOS Development (macOS only)

- **macOS:** 12.0 (Monterey) or higher
- **Xcode:** 14.0 or higher
- **iOS Simulator:** Included with Xcode
- **CocoaPods:** Installed automatically

#### Android Development

- **Android Studio:** Latest stable version
- **Android SDK:** API Level 31 or higher
- **Android Emulator:** Configured in Android Studio
- **Java Development Kit (JDK):** 11 or higher

## Step-by-Step Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd quality-sync-app
```

### 2. Install Node Dependencies

```bash
npm install
```

This will install:

- React Native & Expo SDK
- Supabase client
- React Navigation
- React Native Paper (UI library)
- React Hook Form & Zod (form validation)
- React Query (data fetching)
- All other dependencies listed in `package.json`

### 3. Environment Configuration

#### Create Environment File

```bash
cp .env.example .env
```

#### Configure Supabase Credentials

Open `.env` and add your Supabase project credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Where to find these:**

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the **Project URL** and **anon/public key**

> **Note:** The Quality Sync mobile app shares the same Supabase project as the web application.

### 4. Platform-Specific Setup

#### iOS Setup (macOS only)

1. **Install Xcode:**
   - Download from Mac App Store
   - Open Xcode and accept license agreements
   - Install Command Line Tools:
     ```bash
     xcode-select --install
     ```

2. **Install iOS Simulator:**
   - Open Xcode
   - Go to **Xcode** → **Preferences** → **Components**
   - Download desired iOS versions

3. **Install CocoaPods (if not already installed):**
   ```bash
   sudo gem install cocoapods
   ```

#### Android Setup

1. **Install Android Studio:**
   - Download from [developer.android.com](https://developer.android.com/studio)
   - Follow installation wizard
   - Install Android SDK and tools

2. **Configure Environment Variables:**

   Add to your `~/.bashrc`, `~/.zshrc`, or equivalent:

   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

3. **Create Android Virtual Device (AVD):**
   - Open Android Studio
   - Go to **Tools** → **AVD Manager**
   - Click **Create Virtual Device**
   - Select a device (e.g., Pixel 5)
   - Download and select a system image (API 31+)
   - Finish setup

### 5. Verify Installation

```bash
# Check Node.js version
node --version  # Should be 18.x or higher

# Check npm version
npm --version   # Should be 9.x or higher

# Check Expo CLI (installed with dependencies)
npx expo --version
```

## Running the App

### Start Metro Bundler

```bash
npm start
```

This opens Expo Dev Tools in your browser at `http://localhost:19002`.

### Run on iOS Simulator

```bash
npm run ios
```

Or press `i` in the terminal where Metro is running.

### Run on Android Emulator

```bash
npm run android
```

Or press `a` in the terminal where Metro is running.

### Run on Physical Device

1. Install **Expo Go** app from App Store or Play Store
2. Scan the QR code shown in the terminal
3. App will load on your device

> **Note:** For MFA features, you'll also need **Google Authenticator** or similar TOTP app.

## Post-Installation

### Verify App Functionality

1. **Login Screen** should appear
2. Try logging in with test credentials
3. Complete MFA enrollment if prompted
4. Verify profile data loads correctly

### Development Tools

Install recommended VS Code extensions:

- **React Native Tools** - Debugging and IntelliSense
- **Prettier** - Code formatting
- **ESLint** - Code linting
- **GitLens** - Git integration

## Troubleshooting

### Common Installation Issues

#### "Cannot find module" errors

```bash
rm -rf node_modules package-lock.json
npm install
```

#### Metro bundler won't start

```bash
npm start -- --clear
```

#### iOS build fails

```bash
cd ios
pod install
cd ..
npm run ios
```

#### Android build fails

- Ensure Android Studio is properly installed
- Check that ANDROID_HOME is set correctly
- Verify AVD is running

### Getting Help

- Check [Troubleshooting Guide](../reference/TROUBLESHOOTING.md)
- Review [FAQ](../reference/FAQ.md)
- Contact development team

## Next Steps

- Read [Environment Setup](./ENVIRONMENT.md) for advanced configuration
- Understand [Project Structure](./PROJECT_STRUCTURE.md)
- Review [Development Workflow](../development/WORKFLOW.md)

---

**Last Updated:** 2026-01-20
