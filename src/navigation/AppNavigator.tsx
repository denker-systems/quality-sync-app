import React, { useState } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useTheme as usePaperTheme } from 'react-native-paper';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { MenuProvider, useMenu } from '@/contexts/MenuContext';
import { LoginScreen } from '@/screens/auth/LoginScreen';
import { HomeScreen } from '@/screens/home/HomeScreen';
import { SearchScreen } from '@/screens/search/SearchScreen';
import { ScheduleScreen } from '@/screens/schedule/ScheduleScreen';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';
import { EditProfileScreen } from '@/screens/profile/EditProfileScreen';
import { OnboardingScreen } from '@/screens/onboarding/OnboardingScreen';
import { OnboardingStepScreen } from '@/screens/onboarding/OnboardingStepScreen';
import { OnboardingAdminScreen, OnboardingPreviewScreen } from '@/features/onboarding-admin';
import { ContractsScreen } from '@/screens/contracts/ContractsScreen';
import { ContractViewerScreen } from '@/screens/contracts/ContractViewerScreen';
import { SettingsScreen } from '@/screens/settings/SettingsScreen';
import { SecurityScreen } from '@/screens/settings/SecurityScreen';
import { AboutScreen } from '@/screens/settings/AboutScreen';
import { ChangePasswordScreen } from '@/screens/settings/ChangePasswordScreen';
import { CompanyScreen } from '@/screens/company/CompanyScreen';
import { FloatingTabBar } from '@/components/ui/FloatingTabBar';
import { FullscreenMenu } from '@/components/ui/FullscreenMenu';
import { SwipeEdgeDetector } from '@/components/common/SwipeEdgeDetector';
import type { RootStackParamList } from '@/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Navigation ref for use in callbacks
let navigationRef: any = null;

function AppNavigatorContent() {
  const { user, loading, signOut } = useAuth();
  const { isDark } = useTheme();
  const paperTheme = usePaperTheme();
  const { menuVisible, closeMenu } = useMenu();
  const [activeTab, setActiveTab] = useState('home');
  const [currentRoute, setCurrentRoute] = useState<string>('Home');

  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: paperTheme.colors.primary,
      background: paperTheme.colors.background,
      card: paperTheme.colors.surface,
      text: paperTheme.colors.onSurface,
      border: paperTheme.colors.outline,
      notification: paperTheme.colors.error,
    },
  };

  // Screens where tab bar should be hidden
  const hideTabBarScreens = ['OnboardingAdmin', 'OnboardingPreview', 'OnboardingStep'];
  const shouldShowTabBar = user && !hideTabBarScreens.includes(currentRoute);

  const handleTabPress = (key: string) => {
    setActiveTab(key);
    if (navigationRef) {
      switch (key) {
        case 'home': navigationRef.navigate('Home'); break;
        case 'profile': navigationRef.navigate('Profile'); break;
        case 'schedule': navigationRef.navigate('Schedule'); break;
        case 'settings': navigationRef.navigate('Settings'); break;
      }
    }
  };

  const handleNavigate = (screen: string) => {
    closeMenu();
    setTimeout(() => {
      if (navigationRef) {
        switch (screen) {
          case 'dashboard': navigationRef.navigate('Home'); setActiveTab('home'); break;
          case 'schedule': navigationRef.navigate('Schedule'); setActiveTab('schedule'); break;
          case 'profile': navigationRef.navigate('Profile'); break;
          case 'onboarding': navigationRef.navigate('Onboarding'); break;
          case 'onboarding-admin': navigationRef.navigate('OnboardingAdmin'); break;
          case 'contracts': navigationRef.navigate('Contracts'); break;
          case 'company': navigationRef.navigate('Company'); break;
          case 'settings': navigationRef.navigate('Settings'); setActiveTab('settings'); break;
        }
      }
    }, 100);
  };

  const handleLogout = async () => {
    closeMenu();
    await signOut();
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: paperTheme.colors.background }]}>
        <ActivityIndicator size="large" color={paperTheme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer 
      theme={navigationTheme}
      ref={(ref) => { navigationRef = ref; }}
      onStateChange={(state) => {
        if (state) {
          const route = state.routes[state.index];
          setCurrentRoute(route.name);
        }
      }}
    >
      <SwipeEdgeDetector>
        <View style={styles.container}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!user ? (
            <Stack.Screen name="Login" component={LoginScreen} />
          ) : (
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Search" component={SearchScreen} />
              <Stack.Screen name="Schedule" component={ScheduleScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="EditProfile" component={EditProfileScreen} />
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
              <Stack.Screen name="OnboardingStep" component={OnboardingStepScreen} />
              <Stack.Screen name="OnboardingAdmin" component={OnboardingAdminScreen} />
              <Stack.Screen name="OnboardingPreview" component={OnboardingPreviewScreen} />
              <Stack.Screen name="Contracts" component={ContractsScreen} />
              <Stack.Screen name="ContractViewer" component={ContractViewerScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
              <Stack.Screen name="Company" component={CompanyScreen} />
              <Stack.Screen name="Security" component={SecurityScreen} />
              <Stack.Screen name="About" component={AboutScreen} />
              <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
            </>
          )}
        </Stack.Navigator>

        {shouldShowTabBar && (
          <>
            <FloatingTabBar
              activeTab={activeTab}
              onTabPress={handleTabPress}
            />
            <FullscreenMenu
              visible={menuVisible}
              onClose={closeMenu}
              onNavigate={handleNavigate}
              onLogout={handleLogout}
            />
          </>
        )}
        </View>
      </SwipeEdgeDetector>
    </NavigationContainer>
  );
}

// Wrapper with MenuProvider
export const AppNavigator = () => {
  return (
    <MenuProvider>
      <AppNavigatorContent />
    </MenuProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
