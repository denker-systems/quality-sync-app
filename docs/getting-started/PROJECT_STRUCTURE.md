# Project Structure

Understanding the organization of the Quality Sync Mobile codebase.

## Directory Overview

```
quality-sync-app/
├── .expo/                    # Expo build artifacts and cache
├── .windsurf/                # Windsurf AI workflows and rules
│   ├── rules/                # Project-specific AI rules
│   ├── skills/               # Reusable AI skills
│   └── workflows/            # Development workflows
├── assets/                   # Static assets (images, fonts)
├── docs/                     # Project documentation
│   ├── getting-started/      # Setup and installation guides
│   ├── architecture/         # Architecture documentation
│   ├── features/             # Feature-specific docs
│   ├── backend/              # Backend integration docs
│   ├── development/          # Development guides
│   ├── deployment/           # Deployment guides
│   ├── contributing/         # Contribution guidelines
│   ├── reference/            # Reference materials
│   └── devlogs/              # Development session logs
├── src/                      # Application source code
│   ├── config/               # Configuration files
│   ├── features/             # Feature modules
│   ├── hooks/                # Custom React hooks
│   ├── navigation/           # Navigation setup
│   ├── screens/              # Screen components
│   └── types/                # TypeScript type definitions
├── App.tsx                   # Root application component
├── app.config.js             # Expo configuration
├── babel.config.js           # Babel configuration
├── metro.config.js           # Metro bundler configuration
├── package.json              # Dependencies and scripts
└── tsconfig.json             # TypeScript configuration
```

## Source Code Structure (`src/`)

### `config/`
Configuration files for external services and app settings.

```
src/config/
├── supabase.ts              # Supabase client configuration
└── theme.ts                 # App theme and styling constants
```

**Purpose:** Centralize configuration to make it easy to update settings.

### `features/`
Feature-based modules with co-located components, hooks, and services.

```
src/features/
└── mfa/                     # Multi-Factor Authentication feature
    ├── components/          # MFA-specific UI components
    │   ├── MFAChallengeScreen.tsx
    │   ├── MFAEnrollment.tsx
    │   └── MFAGate.tsx
    ├── hooks/               # MFA-specific hooks
    │   ├── useMFA.ts
    │   └── useMFAStatus.ts
    ├── services/            # MFA business logic
    │   └── mfa.service.ts
    ├── types/               # MFA type definitions
    │   └── mfa.types.ts
    └── index.ts             # Public API exports
```

**Purpose:** Keep related code together for better maintainability and discoverability.

### `hooks/`
Shared custom React hooks used across the application.

```
src/hooks/
├── useAuth.ts               # Authentication state and methods
├── useCompanyData.ts        # Company data fetching
└── useMyEmployee.ts         # Employee profile data
```

**Purpose:** Reusable logic that can be shared across multiple components.

### `navigation/`
Navigation configuration and navigators.

```
src/navigation/
└── AppNavigator.tsx         # Main navigation structure
```

**Purpose:** Centralize routing logic and navigation structure.

### `screens/`
Screen components organized by feature area.

```
src/screens/
├── auth/                    # Authentication screens
│   └── LoginScreen.tsx
└── profile/                 # Profile screens
    └── ProfileScreen.tsx
```

**Purpose:** Top-level components that represent full screens in the app.

### `types/`
TypeScript type definitions and interfaces.

```
src/types/
├── database.types.ts        # Supabase database types (generated)
└── index.ts                 # Shared type definitions
```

**Purpose:** Type safety and better IDE support.

## Key Files

### `App.tsx`
Root component that sets up providers and navigation.

```typescript
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <MFAGate>
          <AppNavigator />
        </MFAGate>
      </PaperProvider>
    </QueryClientProvider>
  );
}
```

### `app.config.js`
Expo configuration including app metadata and environment variables.

```javascript
export default {
  expo: {
    name: 'Quality Sync',
    slug: 'quality-sync-app',
    version: '1.0.0',
    // ... configuration
  },
};
```

### `package.json`
Project dependencies and npm scripts.

```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios"
  }
}
```

## Documentation Structure (`docs/`)

### `devlogs/`
Date-based development logs following the pattern:

```
docs/devlogs/
└── YYYY/
    └── MM/
        └── DD/
            ├── daily-report.md
            ├── session-HH-mm-init.md
            ├── session-HH-mm-end.md
            └── updates-HH-mm.md
```

**Purpose:** Track all development activities with complete traceability.

## Naming Conventions

### Files
- **Components:** PascalCase (e.g., `LoginScreen.tsx`, `MFAGate.tsx`)
- **Hooks:** camelCase with `use` prefix (e.g., `useAuth.ts`, `useMFA.ts`)
- **Services:** camelCase with `.service` suffix (e.g., `mfa.service.ts`)
- **Types:** camelCase with `.types` suffix (e.g., `mfa.types.ts`)
- **Config:** camelCase (e.g., `supabase.ts`, `theme.ts`)

### Directories
- **Lowercase with hyphens** for multi-word names (e.g., `getting-started/`)
- **camelCase** for code directories (e.g., `src/features/`)

### Variables and Functions
- **camelCase** for variables and functions
- **PascalCase** for React components and types
- **SCREAMING_SNAKE_CASE** for constants

## Import Patterns

### Path Aliases
Use `@/` prefix for cleaner imports:

```typescript
// ✅ Good
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/config/supabase';

// ❌ Avoid
import { useAuth } from '../../../hooks/useAuth';
```

### Feature Exports
Features export their public API through `index.ts`:

```typescript
// src/features/mfa/index.ts
export { MFAGate } from './components/MFAGate';
export { useMFA } from './hooks/useMFA';
export type { MFAFactor } from './types/mfa.types';
```

Usage:
```typescript
import { MFAGate, useMFA } from '@/features/mfa';
```

## Code Organization Principles

### 1. Feature-Based Structure
Related code lives together in feature modules.

### 2. Separation of Concerns
- **Components:** UI and presentation
- **Hooks:** State management and side effects
- **Services:** Business logic and API calls
- **Types:** Type definitions

### 3. Single Responsibility
Each file has one clear purpose.

### 4. Dependency Direction
- Features can use shared hooks and config
- Shared code should not depend on features
- Screens use features and hooks
- Features are self-contained

## Adding New Code

### Adding a New Screen

1. Create file in `src/screens/[category]/`
2. Import and use shared hooks
3. Add to navigation in `AppNavigator.tsx`

### Adding a New Feature

1. Create directory in `src/features/[feature-name]/`
2. Add subdirectories: `components/`, `hooks/`, `services/`, `types/`
3. Create `index.ts` to export public API
4. Document in `docs/features/`

### Adding a New Hook

1. Create file in `src/hooks/[hookName].ts`
2. Follow `use` prefix convention
3. Add TypeScript types
4. Document usage

### Adding a New Service

1. Create file in appropriate feature or `src/services/`
2. Use `.service.ts` suffix
3. Export functions, not classes
4. Add error handling

## Best Practices

1. **Keep features self-contained** - Minimize dependencies between features
2. **Use TypeScript strictly** - No `any` types
3. **Co-locate related code** - Keep components, hooks, and services together
4. **Export through index files** - Create clean public APIs
5. **Document complex logic** - Add comments for non-obvious code
6. **Follow naming conventions** - Consistency aids navigation

## Next Steps

- Understand [Architecture Overview](../architecture/OVERVIEW.md)
- Learn about [Tech Stack](../architecture/TECH_STACK.md)
- Review [Development Workflow](../development/WORKFLOW.md)

---

**Last Updated:** 2026-01-20
