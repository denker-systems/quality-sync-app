# Styling & UI Rules (React Native)

## Design System

- **Framework:** React Native Paper (Material Design 3)
- **Theme:** Use the global theme object (`src/config/theme.ts`) for colors, fonts, and roundness.
- **Icons:** Use `react-native-vector-icons/MaterialCommunityIcons` (bundled with Paper) or `lucide-react-native`.

## Best Practices

### StyleSheet

- **Performance:** Always use `StyleSheet.create` to define styles outside of the render cycle.
- **Naming:** Use semantic names (e.g., `container`, `header`, `cardContent`) rather than descriptive ones (e.g., `blueBox`, `marginTop20`).
- **Flexbox:** Use Flexbox for all layout. Remember that `flexDirection` defaults to `column` in React Native.

### Components (React Native Paper)

- **Text:** Use `<Text variant="...">` for typography. Do not hardcode font sizes or weights.
  - `displayLarge` - `displaySmall`: Hero headers.
  - `headlineLarge` - `headlineSmall`: Section headers.
  - `titleLarge` - `titleSmall`: Card titles.
  - `bodyLarge` - `bodySmall`: Standard text.
  - `labelLarge` - `labelSmall`: Buttons and inputs.
- **Buttons:** Use `<Button mode="...">`.
  - `contained`: Primary actions.
  - `outlined`: Secondary actions.
  - `text`: Tertiary actions.
- **Inputs:** Use `<TextInput mode="outlined">` for consistent form fields.
- **Surfaces:** Use `<Surface>` or `<Card>` for elevated content with shadows.

### Safe Area & Layout

- **Wrapper:** Wrap all screen content in a custom `SafeAreaWrapper` or `SafeAreaView`.
- **Spacing:** Use a consistent spacing scale (4, 8, 16, 24, 32). Define these in a constant file if possible.
- **Scroll:** Use `ScrollView` or `FlatList` for content that might exceed the screen height. Ensure `contentContainerStyle` is used for padding.

### Accessibility

- **Touch Targets:** Ensure all interactive elements have a minimum size of 44x44 points.
- **Labels:** Provide `accessibilityLabel` for icon-only buttons.
- **Hints:** Use `accessibilityHint` for complex interactions.

## Code Examples

### Standard Screen Layout

```tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaWrapper } from '@/components/SafeAreaWrapper';

export const MyScreen = () => {
  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <Text variant="headlineMedium">Title</Text>
        <Button mode="contained" onPress={() => {}}>
          Action
        </Button>
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16, // Use gap for spacing between items
  },
});
```

### Theming

```tsx
// Accessing theme in components
import { useTheme } from 'react-native-paper';

const MyComponent = () => {
  const theme = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors.primaryContainer }}>
      <Text style={{ color: theme.colors.onPrimaryContainer }}>Colored Text</Text>
    </View>
  );
};
```
