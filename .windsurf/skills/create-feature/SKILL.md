---
description: Scaffold a new feature module in the React Native app
---

# Create Feature Skill

This skill helps you scaffold a new feature module, ensuring a consistent directory structure and separation of concerns.

## Usage

Call this skill when starting a significant new functional area (e.g., "TimeReporting", "Documents").

## Steps

1.  **Create Directory Structure**
    - Create `src/features/<feature-name>/`.
    - Create subdirectories: `components/`, `hooks/`, `screens/`, `services/`, `types/`.

2.  **Create Feature Entry Point**
    - Create `src/features/<feature-name>/index.ts` to export public API.

3.  **Create Initial Screen**
    - Use the `create-screen` skill to create the main screen for this feature inside `src/features/<feature-name>/screens/`.

4.  **Register Feature**
    - Add the new screen to `src/navigation/AppNavigator.tsx` or create a new Stack Navigator for the feature if it has multiple screens.

## Template Structure

```
src/features/<feature-name>/
├── components/       # Feature-specific UI components
├── hooks/            # Feature-specific logic (useFeatureName.ts)
├── screens/          # Full screen components
├── services/         # API calls and data transformation
├── types/            # TypeScript interfaces
└── index.ts          # Public exports
```
