import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/contexts/ThemeContext';

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
    } else {
      // Always navigate to Home
      (navigation as any).navigate('Home');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0F0F0F' : '#FFFFFF' }]}>
      {/* Left - Back button */}
      <View style={styles.leftSection}>
        {showBack ? (
          <TouchableOpacity 
            onPress={handleBack}
            style={[styles.backButton, { backgroundColor: bgColor }]}
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color={textColor} />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      {/* Center - Title */}
      <View style={styles.centerSection}>
        <Text variant="h3" style={[styles.title, { color: textColor }]}>
          {title}
        </Text>
      </View>

      {/* Right - Optional content */}
      <View style={styles.rightSection}>
        {rightContent || <View style={styles.placeholder} />}
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
    width: 48,
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
