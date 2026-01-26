---
description: Create a new screen in the React Native app
---

# Create Screen Skill

This skill helps you create a new screen component, register it in the navigation, and set up the necessary types.

## Usage

Call this skill when you need to add a new view/page to the app.

## Steps

1.  **Create Component File**
    - Location: `src/screens/<Feature>/<ScreenName>.tsx`
    - Use `ScreenTemplate.tsx` as a base.
    - Ensure it uses `SafeAreaView` (if needed) and `react-native-paper` components.

2.  **Define Navigation Types**
    - Edit `src/types/navigation.ts`.
    - Add the route name and params to `RootStackParamList` (or appropriate navigator).

3.  **Register in Navigator**
    - Edit `src/navigation/AppNavigator.tsx` (or `AuthNavigator`/`MainNavigator`).
    - Import the new screen.
    - Add `<Stack.Screen />`.

## Template

Use the `ScreenTemplate.tsx` file in this directory as a starting point.
