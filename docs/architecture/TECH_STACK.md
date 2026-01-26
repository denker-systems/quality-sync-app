# Tech Stack

Detailed overview of technologies used in Quality Sync Mobile.

## Core Technologies

### React Native (0.81.5)

**Purpose:** Cross-platform mobile framework

**Why chosen:**

- Single codebase for iOS and Android
- Large ecosystem of libraries
- Native performance
- Hot reloading for fast development

**Documentation:** [reactnative.dev](https://reactnative.dev)

### Expo (SDK 54)

**Purpose:** Development platform and tooling

**Why chosen:**

- Simplified setup and configuration
- Over-the-air (OTA) updates
- Easy access to native APIs
- Excellent development experience

**Documentation:** [docs.expo.dev](https://docs.expo.dev)

### TypeScript (5.5.3)

**Purpose:** Type-safe JavaScript

**Why chosen:**

- Compile-time type checking
- Better IDE support
- Improved code quality
- Easier refactoring

**Documentation:** [typescriptlang.org](https://www.typescriptlang.org)

## Backend

### Supabase (2.53.0)

**Purpose:** Backend-as-a-Service

**Features:**

- PostgreSQL database
- Authentication with MFA
- Real-time subscriptions
- Row Level Security
- RESTful API

**Why chosen:**

- Shared with web application
- Built-in authentication
- Real-time capabilities
- Excellent TypeScript support

**Documentation:** [supabase.com/docs](https://supabase.com/docs)

## State Management

### React Query (5.56.2)

**Purpose:** Server state management

**Features:**

- Automatic caching
- Background refetching
- Optimistic updates
- DevTools

**Why chosen:**

- Perfect for API data
- Automatic cache invalidation
- Reduces boilerplate
- Excellent performance

**Documentation:** [tanstack.com/query](https://tanstack.com/query)

### React Hooks

**Purpose:** Local state management

**Used for:**

- Component state (useState)
- Side effects (useEffect)
- Context (useContext)
- Memoization (useMemo, useCallback)

## Navigation

### React Navigation (7.0.0)

**Purpose:** Routing and navigation

**Features:**

- Native stack navigator
- Tab navigator
- Drawer navigator
- Deep linking support

**Why chosen:**

- Most popular React Native navigation
- Excellent TypeScript support
- Customizable
- Platform-specific behavior

**Documentation:** [reactnavigation.org](https://reactnavigation.org)

## UI & Styling

### React Native Paper (5.12.5)

**Purpose:** UI component library

**Features:**

- Material Design 3
- Theming support
- Accessibility
- Cross-platform components

**Why chosen:**

- Modern design system
- Consistent look and feel
- Comprehensive components
- Good documentation

**Documentation:** [callstack.github.io/react-native-paper](https://callstack.github.io/react-native-paper)

## Forms

### React Hook Form (7.61.1)

**Purpose:** Form state management

**Features:**

- Minimal re-renders
- Easy validation
- TypeScript support
- Small bundle size

**Why chosen:**

- Excellent performance
- Simple API
- Great TypeScript support

**Documentation:** [react-hook-form.com](https://react-hook-form.com)

### Zod (3.24.1)

**Purpose:** Schema validation

**Features:**

- TypeScript-first
- Composable schemas
- Type inference
- Runtime validation

**Why chosen:**

- Perfect TypeScript integration
- Type-safe validation
- Excellent DX

**Documentation:** [zod.dev](https://zod.dev)

## Storage

### AsyncStorage (2.1.0)

**Purpose:** Persistent local storage

**Features:**

- Key-value storage
- Async API
- Encrypted on iOS
- Secure on Android

**Used for:**

- Session tokens
- User preferences
- Cached data

**Documentation:** [react-native-async-storage.github.io](https://react-native-async-storage.github.io)

## Development Tools

### Metro Bundler

**Purpose:** JavaScript bundler

**Features:**

- Fast bundling
- Hot reloading
- Source maps
- Tree shaking

**Built into:** React Native

### Babel (7.28.6)

**Purpose:** JavaScript compiler

**Features:**

- ES6+ support
- JSX transformation
- Module resolution
- Plugin system

**Configuration:** `babel.config.js`

### TypeScript Compiler

**Purpose:** Type checking

**Features:**

- Static type checking
- Type inference
- IDE integration
- Compile-time errors

**Configuration:** `tsconfig.json`

## Utilities

### date-fns (3.6.0)

**Purpose:** Date manipulation

**Why chosen:**

- Modular
- Immutable
- TypeScript support
- Tree-shakeable

**Documentation:** [date-fns.org](https://date-fns.org)

### react-native-url-polyfill (2.0.0)

**Purpose:** URL API polyfill

**Why needed:**

- Supabase requires URL API
- Not available in React Native by default

## Native Modules

### expo-constants (18.0.13)

**Purpose:** Access app constants

**Used for:**

- Environment variables
- App version
- Device info

### expo-status-bar (3.0.9)

**Purpose:** Status bar control

**Used for:**

- Status bar styling
- Platform-specific behavior

### react-native-webview (13.15.0)

**Purpose:** WebView component

**Used for:**

- MFA QR code display (future)
- OAuth flows

### react-native-vector-icons (10.2.0)

**Purpose:** Icon library

**Used for:**

- UI icons
- Navigation icons

## Build & Deployment

### EAS (Expo Application Services)

**Purpose:** Build and deployment

**Features:**

- Cloud builds
- App signing
- OTA updates
- TestFlight/Play Store submission

**Documentation:** [docs.expo.dev/eas](https://docs.expo.dev/eas)

## Version Requirements

### Minimum Versions

**iOS:**

- iOS 13.0 or higher
- Xcode 14.0 or higher

**Android:**

- API Level 21 (Android 5.0) or higher
- Android Studio latest stable

**Node.js:**

- Node.js 18.x or higher
- npm 9.x or higher

## Dependencies Overview

### Production Dependencies (18)

- Core: React Native, Expo, TypeScript
- Backend: Supabase
- State: React Query
- Navigation: React Navigation
- UI: React Native Paper
- Forms: React Hook Form, Zod
- Storage: AsyncStorage
- Utilities: date-fns, url-polyfill

### Development Dependencies (4)

- Babel core and presets
- TypeScript
- Module resolver
- dotenv

## Future Considerations

### Planned Additions

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Unit testing
- **Detox** - E2E testing
- **Sentry** - Error tracking
- **Analytics** - Usage tracking

### Potential Libraries

- **react-native-reanimated** - Advanced animations
- **react-native-gesture-handler** - Gesture handling
- **react-native-image-picker** - Image selection
- **expo-notifications** - Push notifications

## Dependency Management

### Updating Dependencies

```bash
# Check for updates
npm outdated

# Update specific package
npm update package-name

# Update all packages
npm update

# Check for security issues
npm audit
npm audit fix
```

### Version Pinning

- **Exact versions** for critical dependencies
- **Caret (^)** for most dependencies
- **Tilde (~)** for Expo SDK packages

## Related Documentation

- [Architecture Overview](./OVERVIEW.md)
- [Development Workflow](../development/WORKFLOW.md)
- [Installation Guide](../getting-started/INSTALLATION.md)

---

**Last Updated:** 2026-01-20
