---
trigger: always_on
---

# Development Workflow Rules (Mobile)

## Code Quality & Standards

### ESLint & Prettier
- **Strict TypeScript:** No `any`. Use specific types or generics.
- **Imports:** Use absolute imports (`@/components/...`) defined in `tsconfig.json`.
- **Formatting:** Prettier must run on save.
- **Linting:** Run `npm run lint` before committing.

### Scripts & Commands
```json
// package.json scripts reference
"start": "expo start",              // Start Metro Bundler
"android": "expo start --android",  // Run on Android
"ios": "expo start --ios",          // Run on iOS
"lint": "eslint .",                 // Check for issues
"type-check": "tsc --noEmit"        // Verify types
```

## Build & Deployment (EAS)

### EAS Configuration
- **Builds:** Managed via `eas.json`.
- **Profiles:**
  - `development`: Debug build for simulators/devices.
  - `preview`: Internal distribution (TestFlight/APK).
  - `production`: App Store/Play Store release.

### Deployment Commands
```bash
# Create a development build
eas build --profile development --platform ios

# Submit to stores
eas submit -p ios
```

## Environment Management

### Environment Variables
- **Format:** `EXPO_PUBLIC_[NAME]` for client-side variables.
- **File:** `.env` (loaded by Expo automatically).
- **Secrets:** NEVER commit `.env`. Use EAS Secrets for CI/CD.

### Config
- **File:** `app.config.js` or `app.json`.
- **Dynamic Config:** Use `app.config.js` to load env vars effectively.

## Testing Strategy

### Unit Testing
- **Framework:** Jest + React Native Testing Library.
- **Scope:** Test hooks and utility functions. Snapshot tests for simple UI components.

### Manual Testing
- **Devices:** Test on BOTH physical iOS and Android devices if possible.
- **Simulators:** Use for rapid iteration.

## Performance Monitoring

### Optimization Checklist
- ✅ **Images:** Use `expo-image` with proper caching policies.
- ✅ **Lists:** Use `FlashList` (Shopify) or optimized `FlatList`.
- ✅ **Memoization:** Wrap callbacks passed to children in `useCallback`.
- ✅ **Bundle Size:** Check with `npx expo-atlas`.

## Debugging

### Tools
- **React Native DevTools:** Press `j` in terminal to open debugger.
- **Console:** Use `console.log` sparingly; remove before commit.
- **Network:** Inspect network requests in DevTools.

### Common Issues
- **Cache:** If weird errors occur, start with `npx expo start -c` to clear cache.
- **Pods:** If native modules fail on iOS, run `npx pod-install`.
