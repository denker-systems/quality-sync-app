import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, useTheme as usePaperTheme, SegmentedButtons, IconButton } from 'react-native-paper';
import { Sun, Moon, Smartphone } from 'lucide-react-native';
import { useTheme, Theme } from '@/contexts/ThemeContext';

interface ThemeToggleProps {
  showLabels?: boolean;
}

// Full theme selector with all three options
export const ThemeToggle: React.FC<ThemeToggleProps> = ({ showLabels = true }) => {
  const { theme, setTheme, resolvedTheme, isLoading } = useTheme();
  const paperTheme = usePaperTheme();

  const themeOptions = [
    { value: 'light' as Theme, label: 'Ljust', icon: 'weather-sunny' },
    { value: 'dark' as Theme, label: 'Mörkt', icon: 'weather-night' },
    { value: 'system' as Theme, label: 'System', icon: 'cellphone' },
  ];

  return (
    <View style={styles.container}>
      {showLabels && (
        <Text variant="labelLarge" style={[styles.label, { color: paperTheme.colors.onSurfaceVariant }]}>
          Tema
        </Text>
      )}
      <SegmentedButtons
        value={theme}
        onValueChange={(value) => setTheme(value as Theme)}
        buttons={themeOptions.map(option => ({
          value: option.value,
          label: option.label,
          icon: option.icon,
          disabled: isLoading,
        }))}
        style={styles.segmentedButtons}
      />
      {theme === 'system' && (
        <Text variant="bodySmall" style={[styles.hint, { color: paperTheme.colors.onSurfaceVariant }]}>
          Följer systemet ({resolvedTheme === 'dark' ? 'mörkt' : 'ljust'})
        </Text>
      )}
    </View>
  );
};

// Simple toggle button (only light/dark)
export const SimpleThemeToggle: React.FC = () => {
  const { toggleTheme, resolvedTheme, isLoading } = useTheme();
  const paperTheme = usePaperTheme();

  return (
    <IconButton
      icon={resolvedTheme === 'dark' ? 'weather-sunny' : 'weather-night'}
      size={24}
      onPress={toggleTheme}
      disabled={isLoading}
      iconColor={paperTheme.colors.onSurface}
    />
  );
};

// Theme toggle as a list item (for settings screens)
export const ThemeListItem: React.FC = () => {
  const { theme, setTheme, resolvedTheme, isLoading } = useTheme();
  const paperTheme = usePaperTheme();

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return 'weather-sunny';
      case 'dark':
        return 'weather-night';
      case 'system':
        return 'cellphone';
      default:
        return resolvedTheme === 'dark' ? 'weather-night' : 'weather-sunny';
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Ljust tema';
      case 'dark':
        return 'Mörkt tema';
      case 'system':
        return `System (${resolvedTheme === 'dark' ? 'mörkt' : 'ljust'})`;
      default:
        return 'Tema';
    }
  };

  const cycleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <View style={styles.listItem}>
      <View style={styles.listItemContent}>
        <IconButton
          icon={getThemeIcon()}
          size={20}
          iconColor={paperTheme.colors.primary}
        />
        <View style={styles.listItemText}>
          <Text variant="bodyLarge" style={{ color: paperTheme.colors.onSurface }}>
            Utseende
          </Text>
          <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
            {getThemeLabel()}
          </Text>
        </View>
      </View>
      <View style={styles.themeButtons}>
        <IconButton
          icon="weather-sunny"
          size={20}
          onPress={() => setTheme('light')}
          disabled={isLoading}
          iconColor={theme === 'light' ? paperTheme.colors.primary : paperTheme.colors.onSurfaceVariant}
          style={theme === 'light' ? [styles.activeButton, { backgroundColor: paperTheme.colors.primaryContainer }] : undefined}
        />
        <IconButton
          icon="weather-night"
          size={20}
          onPress={() => setTheme('dark')}
          disabled={isLoading}
          iconColor={theme === 'dark' ? paperTheme.colors.primary : paperTheme.colors.onSurfaceVariant}
          style={theme === 'dark' ? [styles.activeButton, { backgroundColor: paperTheme.colors.primaryContainer }] : undefined}
        />
        <IconButton
          icon="cellphone"
          size={20}
          onPress={() => setTheme('system')}
          disabled={isLoading}
          iconColor={theme === 'system' ? paperTheme.colors.primary : paperTheme.colors.onSurfaceVariant}
          style={theme === 'system' ? [styles.activeButton, { backgroundColor: paperTheme.colors.primaryContainer }] : undefined}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    marginBottom: 4,
  },
  segmentedButtons: {
    alignSelf: 'stretch',
  },
  hint: {
    marginTop: 4,
    textAlign: 'center',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  listItemText: {
    flex: 1,
  },
  themeButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeButton: {
    borderRadius: 20,
  },
});

export default ThemeToggle;
