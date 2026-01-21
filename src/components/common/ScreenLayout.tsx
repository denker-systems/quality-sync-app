import React, { ReactNode } from 'react';
import { View, ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { PageHeader } from './PageHeader';

interface ScreenLayoutProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  headerRight?: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  noPadding?: boolean;
}

export function ScreenLayout({ 
  children, 
  title,
  showBack = true,
  onBackPress,
  headerRight,
  scrollable = true, 
  style,
  contentStyle,
  noPadding = false,
}: ScreenLayoutProps) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  
  const backgroundColor = isDark ? '#0F0F0F' : '#FFFFFF';
  
  const containerStyle = [
    styles.container,
    { backgroundColor, paddingTop: insets.top },
    style,
  ];
  
  const innerContentStyle = [
    styles.content,
    !noPadding && styles.padding,
    { paddingBottom: insets.bottom + 100 },
    contentStyle,
  ];

  if (scrollable) {
    return (
      <View style={containerStyle}>
        {title && (
          <PageHeader 
            title={title} 
            showBack={showBack}
            onBackPress={onBackPress}
            rightContent={headerRight}
          />
        )}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={innerContentStyle}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      {title && (
        <PageHeader 
          title={title} 
          showBack={showBack}
          onBackPress={onBackPress}
          rightContent={headerRight}
        />
      )}
      <View style={innerContentStyle}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  padding: {
    paddingHorizontal: 16,
  },
});

export default ScreenLayout;
