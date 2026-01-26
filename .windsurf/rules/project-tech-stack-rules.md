# Project Tech Stack Rules (Quality Sync Mobile)

## Project Overview

- **Quality Sync Mobile** - React Native app for employee self-service.
- **Purpose:** Allow employees to view profiles, shifts, and handle tasks.
- **Platform:** iOS and Android (via Expo).
- **Architecture:** React Native New Architecture (Bridgeless Mode enabled by default in SDK 54).

## Core Technologies

### Frontend Stack

- **React Native 0.76+** with **Expo SDK 54+**
  - Uses the **New Architecture** (Fabric Renderer & TurboModules).
  - **Strict TypeScript** configuration enabled.
- **React 19** (aligned with Expo SDK 54).
- **React Native Paper 5.x** for UI components (Material Design 3).
- **React Navigation 7** for routing (Native Stack & Bottom Tabs).

### State & Data

- **TanStack React Query 5** for server state, caching, and optimistic updates.
- **React Context** for global app state (Auth Session, Theme Preferences).
- **Zod 3.x** for runtime schema validation (API responses, Forms).
- **React Hook Form 7.x** for form management.

### Backend & Database

- **Supabase** (Shared project with Web App)
  - **Auth:** Supabase Auth with PKCE flow (`@supabase/supabase-js`).
  - **Database:** PostgreSQL with Row Level Security (RLS).
  - **Storage:** Supabase Storage for user uploads.

### Security

- **MFA:** Time-based One-Time Password (TOTP) support via Supabase.
- **Storage:** `@react-native-async-storage/async-storage` for non-sensitive persistence.
- **Secure Storage:** Use `expo-secure-store` for sensitive tokens (access/refresh tokens).

## Architecture Principles

### Mobile-First & Performance

- **New Architecture:** Leverage TurboModules for native integrations.
- **Offline First:** Design for intermittent connectivity using React Query's `offlineBehavior`.
- **Optimization:** Use `React.memo` and `useCallback` judiciously to prevent re-renders, especially in `FlatList` items.
- **Images:** Use `expo-image` for optimized image loading and caching.

### Code Structure

- **Screens:** `src/screens` - Top level views focused on layout and data orchestration.
- **Components:** `src/components` - Reusable, presentational UI elements.
- **Hooks:** `src/hooks` - Encapsulated business logic and data fetching.
- **Features:** `src/features` - Modular feature bundles (e.g., `src/features/mfa`) keeping related code together.
- **Config:** `src/config` - App-wide settings and constants.

### Navigation

- Use **typed routes** in `src/types/navigation.ts`.
- Prefer **Stack Navigator** for linear flows and **Tab Navigator** for main sections.
- Avoid deep nesting of navigators to maintain performance.

## Development Workflow

- **Package Manager:** `npm`.
- **Run:** `npm start` (starts Expo Go).
- **Lint:** `npm run lint` (ESLint + Prettier).
- **Type Check:** `tsc --noEmit`.
