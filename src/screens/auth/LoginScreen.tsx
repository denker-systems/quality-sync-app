import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TextInput } from 'react-native';
import { Text, Card, CardContent, Button } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const loginSchema = z.object({
  email: z.string().email('Ogiltig email-adress'),
  password: z.string().min(6, 'Lösenordet måste vara minst 6 tecken'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const LoginScreen = () => {
  const { signIn } = useAuth();
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [errorMessage, setErrorMessage] = useState('');
  
  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';
  const accentColor = isDark ? '#6BBD68' : '#489A45';
  const inputBg = isDark ? '#1A1A1A' : '#FFFFFF';
  const borderColor = isDark ? '#2E2E2E' : '#E5E5E5';
  const backgroundColor = isDark ? '#0F0F0F' : '#FFFFFF';
  
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setErrorMessage('');
    const { error } = await signIn(data.email, data.password);
    
    if (error) {
      setErrorMessage(error.message || 'Inloggning misslyckades');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor, paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Text variant="display" style={{ color: accentColor }}>
            Quality Sync
          </Text>
          <Text variant="body-lg" style={{ color: mutedColor, marginTop: 8 }}>
            Logga in för att fortsätta
          </Text>
        </View>

        <Card variant="elevated" style={styles.card}>
          <CardContent>
            <Text variant="body-sm" style={[styles.label, { color: mutedColor }]}>Email</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  placeholder="din@email.com"
                  placeholderTextColor={mutedColor}
                  style={[
                    styles.input, 
                    { backgroundColor: inputBg, borderColor, color: textColor },
                    errors.email && styles.inputError
                  ]}
                />
              )}
            />
            {errors.email && (
              <Text variant="body-sm" style={styles.errorText}>{errors.email.message}</Text>
            )}

            <Text variant="body-sm" style={[styles.label, { color: mutedColor, marginTop: 16 }]}>Lösenord</Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                  autoComplete="password"
                  placeholder="********"
                  placeholderTextColor={mutedColor}
                  style={[
                    styles.input, 
                    { backgroundColor: inputBg, borderColor, color: textColor },
                    errors.password && styles.inputError
                  ]}
                />
              )}
            />
            {errors.password && (
              <Text variant="body-sm" style={styles.errorText}>{errors.password.message}</Text>
            )}

            {errorMessage && (
              <View style={styles.errorContainer}>
                <Text variant="body" style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            <Button
              variant="primary"
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              style={styles.button}
            >
              {isSubmitting ? 'Loggar in...' : 'Logga in'}
            </Button>
          </CardContent>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  card: {
    marginHorizontal: 0,
  },
  label: {
    marginBottom: 6,
  },
  input: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 4,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  button: {
    marginTop: 24,
  },
});
