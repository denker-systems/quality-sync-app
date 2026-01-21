# React Native & Expo Rules

## Tech Stack
- **Framework:** React Native with Expo (SDK 54+)
- **Language:** TypeScript
- **UI Library:** React Native Paper (Material Design 3)
- **Navigation:** React Navigation (Stack & Tabs)
- **State/Data:** TanStack React Query + Context API
- **Auth/Backend:** Supabase (shared with web app)
- **Form:** React Hook Form + Zod

## Best Practices

### UI & Styling

- **StyleSheet:** Always use `StyleSheet.create` for defining styles. Avoid inline styles for complex components to ensure performance and maintainability.
- **Components:** Prioritize using `react-native-paper` components (e.g., `Text`, `Button`, `Card`, `TextInput`) to maintain design consistency.
- **SafeArea:** Always wrap screen content in `SafeAreaView` or use `SafeAreaProvider`/`useSafeAreaInsets` to handle notches and dynamic islands correctly.
- **Layout:** Use `View` for containers and `ScrollView` for scrollable content. Ensure touch targets are at least 44x44 points.

### Navigation

- **Type Safety:** Define all navigation stacks and tabs in `src/types/navigation.ts`.
- **Props:** Use `NativeStackScreenProps` or `BottomTabScreenProps` to type screen props strictly.
- **Structure:** Keep navigation logic centralized in `src/navigation/`.

### Data Fetching

- **React Query:** Encapsulate all data fetching logic in custom hooks (e.g., `useMyEmployee`, `useCompanyData`).
- **State Handling:** Explicitly handle `isLoading`, `isError`, and `data` states in the UI. Provide user feedback (spinners, error messages).
- **Supabase:** Use the singleton `supabase` instance from `@/config/supabase`.
- **Caching:** Configure `staleTime` and `gcTime` appropriately for a mobile context where connectivity might be intermittent.

### Auth & MFA

- **Session:** Access user session via the `useAuth` hook.
- **MFA:** Manage Multi-Factor Authentication flows using `useMFA` and `useMFAStatus`.
- **Protection:** Protect sensitive routes using the `MFAGate` component or route guards.
- **Persistence:** Ensure session persistence is handled via `AsyncStorage`.
- Handle session persistence with `AsyncStorage`.

### Environment Variables
- Access variables via `process.env.EXPO_PUBLIC_*` in client code.
- Ensure `app.config.js` correctly loads `.env` for the Expo runtime.
- Never hardcode secrets in the client code.

## Directory Structure
- `src/screens`: Full screen components (pages).
- `src/components`: Reusable UI components.
- `src/hooks`: Custom hooks for logic and data fetching.
- `src/features`: Feature-based modules (e.g., `src/features/mfa`).
- `src/types`: TypeScript definitions and interfaces.
- `src/config`: Configuration files (Supabase, Theme).
- `src/navigation`: Navigation setup and types.
- `src/utils`: Helper functions.

## Coding Standards
- **Imports:** Use absolute imports with `@/` alias.
- **Components:** Functional components with named exports.
- **Types:** Interfaces for objects, Types for unions/primitives.
- **Error Handling:** Use `try/catch` in async functions and display user-friendly errors (e.g., Snackbar).
