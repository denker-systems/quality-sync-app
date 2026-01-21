import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { LoginScreen } from '@/screens/auth/LoginScreen';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';
import type { RootStackParamList } from '@/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0056b3" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen 
            name="Profile" 
            component={ProfileScreen}
            options={{ 
              title: 'Min Profil',
              headerStyle: {
                backgroundColor: '#0056b3',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
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
    backgroundColor: '#ffffff',
  },
});
