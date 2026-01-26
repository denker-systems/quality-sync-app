# Visuals Roadmap (Animations & Transitions)

## Goals

- Smooth native-feeling transitions (iOS/Android)
- Delightful micro-interactions
- Consistent, subtle motion system
- Maintain performance (UI-thread animations)

## Plan (Full)

1. Add animation stack
   - Install `react-native-reanimated`, `react-native-gesture-handler`, `moti`
   - Configure Babel for Reanimated
   - Wrap app with `GestureHandlerRootView`

2. Navigation transitions
   - Set native-stack `screenOptions.animation` (platform-aware)
   - Optional: enable shared element transitions for hero elements

3. Global screen entry
   - Add subtle entry animation in `ScreenLayout`
   - Prefer fade + slight translateY

4. List and card motion
   - Add staggered entrance on lists (Contracts, Profile, Home cards)
   - Keep delays small (50–80ms)

5. Micro-interactions
   - Convert tab bar items to `MotiPressable`
   - Add scale + opacity press feedback

6. Menu polish
   - Add backdrop fade
   - Tune slide timing/easing

7. QA + performance
   - Verify no layout jank
   - Confirm animations run on UI thread

## Checklist

- [x] Install Reanimated + Gesture Handler + Moti
- [x] Update babel.config.js (Reanimated plugin last)
- [x] Wrap App root with GestureHandlerRootView
- [x] Add native-stack animation options
- [x] Add ScreenLayout entry animation
- [x] Stagger list/card entrances
- [x] Add tab bar micro-interactions
- [x] Improve menu transitions (backdrop fade + easing)
- [x] Header motion (title/back/right)
- [x] Empty state motion
- [x] Shared element transition (Contracts → ContractViewer)
- [x] Modal presentation (ContractViewer)
- [x] List press micro-interactions (Contracts)
- [ ] Manual QA on iOS + Android

## Files to touch

- App.tsx
- babel.config.js
- src/navigation/AppNavigator.tsx
- src/components/common/ScreenLayout.tsx
- src/components/ui/FloatingTabBar.tsx
- src/components/ui/FullscreenMenu.tsx
- src/screens/home/HomeScreen.tsx
- src/screens/contracts/ContractsScreen.tsx
- src/screens/profile/ProfileScreen.tsx
