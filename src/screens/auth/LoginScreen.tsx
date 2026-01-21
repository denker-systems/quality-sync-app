import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, Surface, Snackbar } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email('Ogiltig email-adress'),
  password: z.string().min(6, 'Lösenordet måste vara minst 6 tecken'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const LoginScreen = () => {
  const { signIn } = useAuth();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    const { error } = await signIn(data.email, data.password);
    
    if (error) {
      setSnackbarMessage(error.message || 'Inloggning misslyckades');
      setSnackbarVisible(true);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Surface style={styles.surface} elevation={2}>
          <View style={styles.logoContainer}>
            <Text variant="displaySmall" style={styles.title}>
              Quality Sync
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              Logga in för att fortsätta
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  error={!!errors.email}
                  style={styles.input}
                  mode="outlined"
                />
              )}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email.message}</Text>
            )}

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Lösenord"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                  autoComplete="password"
                  error={!!errors.password}
                  style={styles.input}
                  mode="outlined"
                />
              )}
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password.message}</Text>
            )}

            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting}
              disabled={isSubmitting}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Logga in
            </Button>
          </View>
        </Surface>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  surface: {
    padding: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    color: '#0056b3',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#6c757d',
    textAlign: 'center',
  },
  formContainer: {
    gap: 16,
  },
  input: {
    backgroundColor: '#ffffff',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: -12,
    marginLeft: 12,
  },
  button: {
    marginTop: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});
