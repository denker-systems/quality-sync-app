# Frequently Asked Questions (FAQ)

Common questions about Quality Sync Mobile.

## General

### What is Quality Sync Mobile?

Quality Sync Mobile is a React Native mobile application that provides access to the Quality Sync platform on iOS and Android devices. It shares the same backend (Supabase) as the web application.

### What platforms are supported?

- **iOS:** 13.0 and higher
- **Android:** API Level 21 (Android 5.0) and higher

### Does it work offline?

Currently, no. The app requires an internet connection to function. Offline mode is planned for a future release.

## Installation & Setup

### How do I install the app?

See the [Installation Guide](../getting-started/INSTALLATION.md) for detailed instructions.

### Where do I get Supabase credentials?

Supabase credentials are shared with the Quality Sync web application. Contact your team lead or check the web app's `.env` file.

### Do I need Expo Go?

For development, yes. For production builds, no - the app will be a standalone application.

## Authentication

### Can I use the same login as the web app?

Yes! The mobile app shares the same authentication system as the web application. Use the same email and password.

### Why do I need MFA?

Multi-Factor Authentication (MFA) provides an additional layer of security. It's required for users with sensitive data access.

### What authenticator apps are supported?

Any TOTP-compatible authenticator app works:

- Google Authenticator
- Microsoft Authenticator
- Authy
- 1Password
- Bitwarden

### I lost my authenticator app. What do I do?

Contact your administrator to reset your MFA. You'll need to re-enroll with a new device.

### How long do sessions last?

Sessions last 7 days by default. After that, you'll need to log in again.

## Features

### What features are available?

**Current (v1.0):**

- Email/password login
- Multi-Factor Authentication (MFA)
- User profile viewing
- Session persistence

**Planned:**

- Company data display
- Employee data management
- Avatar upload
- Push notifications
- Offline mode

### Can I edit my profile?

Not yet. Profile editing is planned for a future release. Currently, you can only view your profile.

### Can I upload a profile picture?

Not yet. Avatar upload is planned for a future release.

## Development

### What tech stack is used?

- **Framework:** React Native with Expo
- **Language:** TypeScript
- **Backend:** Supabase (PostgreSQL)
- **Navigation:** React Navigation
- **State Management:** React Query
- **UI Library:** React Native Paper
- **Forms:** React Hook Form + Zod

### How do I run the app locally?

```bash
npm install
npm start
npm run ios     # For iOS
npm run android # For Android
```

See [Quick Start](../getting-started/QUICK_START.md) for details.

### How do I add a new feature?

1. Create feature directory in `src/features/`
2. Add components, hooks, services, types
3. Export through `index.ts`
4. Document in `docs/features/`

See [Development Workflow](../development/WORKFLOW.md) for details.

### What's the code style?

- TypeScript strict mode
- No `any` types
- PascalCase for components
- camelCase for functions/variables
- Feature-based organization

See [Code Style Guide](../development/CODE_STYLE.md) for details.

## Troubleshooting

### The app won't start. What should I do?

```bash
# Clear cache and restart
npm start -- --clear

# If that doesn't work:
rm -rf node_modules
npm install
npm start
```

See [Troubleshooting Guide](./TROUBLESHOOTING.md) for more solutions.

### I'm getting "Cannot find module" errors

```bash
rm -rf node_modules package-lock.json
npm install
npm start -- --clear
```

### Login isn't working

1. Check network connection
2. Verify Supabase credentials in `.env`
3. Check console for error messages
4. Verify user exists in Supabase dashboard

### MFA code says "Invalid"

1. Check device time is synchronized
2. Ensure code hasn't expired (30-second window)
3. Verify you're using the correct factor
4. Try generating a new code

### Data isn't loading

1. Check network connection
2. Verify you're logged in
3. Check RLS policies in Supabase
4. Review console for errors

## Backend & Database

### What database is used?

PostgreSQL via Supabase. The mobile app shares the same database as the web application.

### How is data secured?

- Row Level Security (RLS) at database level
- JWT-based authentication
- HTTPS for all connections
- Encrypted storage on device

### Can I access the database directly?

No. All database access goes through Supabase's API with RLS policies enforced.

### How do I update database types?

```bash
npx supabase gen types typescript --project-id your-project-id > src/types/database.types.ts
```

## Deployment

### How do I create a build?

```bash
# Development build
eas build --profile development --platform ios

# Production build
eas build --profile production --platform ios
```

See [Build Process](../deployment/BUILD.md) for details.

### How do I deploy to App Store?

See [App Store Deployment](../deployment/APP_STORE.md) for complete guide.

### How do I deploy to Play Store?

See [Play Store Deployment](../deployment/PLAY_STORE.md) for complete guide.

### What's the difference between development and production builds?

- **Development:** Includes debugging tools, connects to dev server
- **Production:** Optimized, minified, ready for app stores

## Performance

### Why is the app slow?

Common causes:

- Network latency
- Large data sets
- Unoptimized queries
- Memory leaks

See [Performance Optimization](../development/PERFORMANCE.md) for solutions.

### How can I improve performance?

1. Use React Query caching
2. Optimize database queries
3. Use React.memo for expensive components
4. Lazy load heavy components
5. Optimize images

## Security

### Is my data secure?

Yes. Security measures include:

- HTTPS encryption
- Row Level Security (RLS)
- JWT authentication
- MFA support
- Secure token storage

### Where are sessions stored?

Sessions are stored securely in AsyncStorage on the device. On iOS, this uses the Keychain. On Android, it uses EncryptedSharedPreferences.

### Can I disable MFA?

Only administrators can disable MFA for a user. Contact your admin if you need MFA disabled.

## Contributing

### How can I contribute?

See [Contributing Guide](../contributing/CONTRIBUTING.md) for details.

### What's the PR process?

1. Create feature branch
2. Make changes
3. Write tests
4. Update docs
5. Create PR
6. Request review

See [Pull Request Process](../contributing/PULL_REQUESTS.md) for details.

### How do I report a bug?

See [Issue Reporting](../contributing/ISSUES.md) for guidelines.

## Miscellaneous

### What's the difference between this and the web app?

The mobile app provides a native mobile experience with:

- Push notifications (planned)
- Offline mode (planned)
- Native camera access
- Better mobile UX

But shares the same:

- Backend (Supabase)
- Database
- Authentication
- Core features

### Will there be a tablet version?

Yes, the app supports tablets. iPad and Android tablet layouts are optimized for larger screens.

### Can I use this on my Apple Watch?

Not currently. Apple Watch support is not planned for v1.0.

### How often is the app updated?

Updates are released as needed. Check the [Changelog](./CHANGELOG.md) for version history.

### Where can I find the source code?

The source code is in a private repository. Contact your team lead for access.

## Still Have Questions?

- Check [Troubleshooting Guide](./TROUBLESHOOTING.md)
- Review [Documentation](../README.md)
- Contact development team

---

**Last Updated:** 2026-01-20
