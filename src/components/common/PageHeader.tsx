import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { MotiView } from 'moti';
import { MotiPressable } from 'moti/interactions';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/contexts/ThemeContext';
import { SPRING_CONFIGS, usePressAnimation } from '@/lib/animations';

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightContent?: React.ReactNode;
}

export function PageHeader({ 
  title, 
  showBack = true,
  onBackPress,
  rightContent,
}: PageHeaderProps) {
  const navigation = useNavigation();
  const { isDark } = useTheme();
  
  const textColor = isDark ? '#FAFAFA' : '#171717';
  const bgColor = isDark ? '#1A1A1A' : '#F5F5F5';

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      (navigation as any).navigate('Home');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0F0F0F' : '#FFFFFF' }]}>
      {/* Left - Back button */}
      <View style={styles.leftSection}>
        {showBack ? (
          <MotiView
            from={{ opacity: 0, translateX: -20, scale: 0.8 }}
            animate={{ opacity: 1, translateX: 0, scale: 1 }}
            transition={SPRING_CONFIGS.bouncy}
          >
            <MotiPressable
              onPress={handleBack}
              style={[styles.backButton, { backgroundColor: bgColor }]}
              animate={usePressAnimation({ scaleDown: 0.92 })}
              transition={SPRING_CONFIGS.snappy}
            >
              <ArrowLeft size={20} color={textColor} />
            </MotiPressable>
          </MotiView>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      {/* Center - Title */}
      <View style={styles.centerSection}>
        <MotiView
          from={{ opacity: 0, translateY: -15, scale: 0.9 }}
          animate={{ opacity: 1, translateY: 0, scale: 1 }}
          transition={SPRING_CONFIGS.smooth}
        >
          <Text variant="h3" style={[styles.title, { color: textColor }]}>
            {title}
          </Text>
        </MotiView>
      </View>

      {/* Right - Optional content */}
      <View style={styles.rightSection}>
        <MotiView
          from={{ opacity: 0, translateX: 20, scale: 0.8 }}
          animate={{ opacity: 1, translateX: 0, scale: 1 }}
          transition={{ ...SPRING_CONFIGS.bouncy, delay: 50 }}
        >
          {rightContent || <View style={styles.placeholder} />}
        </MotiView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  leftSection: {
    width: 48,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    width: 60,
    alignItems: 'flex-end',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    width: 40,
    height: 40,
  },
  title: {
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default PageHeader;
