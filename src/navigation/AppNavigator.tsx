import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useTheme as usePaperTheme } from 'react-native-paper';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { LoginScreen } from '@/screens/auth/LoginScreen';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';
import { OnboardingScreen } from '@/screens/onboarding/OnboardingScreen';
import { ContractsScreen } from '@/screens/contracts/ContractsScreen';
import { ContractViewerScreen } from '@/screens/contracts/ContractViewerScreen';
import { ScheduleScreen } from '@/screens/schedule/ScheduleScreen';
import { EditProfileScreen } from '@/screens/profile/EditProfileScreen';
import type { RootStackParamList } from '@/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const { user, loading } = useAuth();
  const { isDark } = useTheme();
  const paperTheme = usePaperTheme();

  // Create navigation theme based on Paper theme
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

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: paperTheme.colors.background }]}>
        <ActivityIndicator size="large" color={paperTheme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator>
        {!user ? (
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen 
              name="Profile" 
              component={ProfileScreen}
              options={{ 
                title: 'Min Profil',
                headerStyle: {
                  backgroundColor: paperTheme.colors.primary,
                },
                headerTintColor: paperTheme.colors.onPrimary,
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
            <Stack.Screen 
              name="Onboarding" 
              component={OnboardingScreen}
              options={{ 
                title: 'Onboarding',
                headerStyle: {
                  backgroundColor: paperTheme.colors.primary,
                },
                headerTintColor: paperTheme.colors.onPrimary,
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
            <Stack.Screen 
              name="Contracts" 
              component={ContractsScreen}
              options={{ 
                title: 'Avtal',
                headerStyle: {
                  backgroundColor: paperTheme.colors.primary,
                },
                headerTintColor: paperTheme.colors.onPrimary,
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
            <Stack.Screen 
              name="ContractViewer" 
              component={ContractViewerScreen}
              options={{ 
                title: 'Visa Avtal',
                headerStyle: {
                  backgroundColor: paperTheme.colors.primary,
                },
                headerTintColor: paperTheme.colors.onPrimary,
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
            <Stack.Screen 
              name="Schedule" 
              component={ScheduleScreen}
              options={{ 
                title: 'Mitt Schema',
                headerStyle: {
                  backgroundColor: paperTheme.colors.primary,
                },
                headerTintColor: paperTheme.colors.onPrimary,
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
            <Stack.Screen 
              name="EditProfile" 
              component={EditProfileScreen}
              options={{ 
                title: 'Redigera Profil',
                headerStyle: {
                  backgroundColor: paperTheme.colors.primary,
                },
                headerTintColor: paperTheme.colors.onPrimary,
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
