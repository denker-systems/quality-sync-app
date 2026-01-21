import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Text, Card, CardContent, Button } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const createLoginSchema = (t: (key: string) => string) => z.object({
  email: z.string().email(t('auth.invalidEmail')),
  password: z.string().min(6, t('auth.passwordTooShort')),
});

type LoginForm = {
  email: string;
  password: string;
};

export const LoginScreen = () => {
  const { signIn } = useAuth();
  const { isDark } = useTheme();
  const { t, language, setLanguage } = useLanguage();
  const insets = useSafeAreaInsets();
  const [errorMessage, setErrorMessage] = useState('');
  
  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';
  const accentColor = isDark ? '#6BBD68' : '#489A45';
  const inputBg = isDark ? '#1A1A1A' : '#FFFFFF';
  const borderColor = isDark ? '#2E2E2E' : '#E5E5E5';
  const backgroundColor = isDark ? '#0F0F0F' : '#FFFFFF';
  
  const loginSchema = createLoginSchema(t);
  
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
      setErrorMessage(error.message || t('auth.loginError'));
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'sv' ? 'en' : 'sv');
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
        {/* Language Toggle */}
        <View style={styles.languageToggleContainer}>
          <TouchableOpacity 
            style={[
              styles.flagButton,
              language === 'sv' && styles.flagButtonActive,
              { backgroundColor: language === 'sv' ? (isDark ? '#2A2A2A' : '#E8E8E8') : 'transparent' }
            ]}
            onPress={() => setLanguage('sv')}
          >
            <Text style={styles.flagEmoji}>🇸🇪</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.flagButton,
              language === 'en' && styles.flagButtonActive,
              { backgroundColor: language === 'en' ? (isDark ? '#2A2A2A' : '#E8E8E8') : 'transparent' }
            ]}
            onPress={() => setLanguage('en')}
          >
            <Text style={styles.flagEmoji}>🇺🇸</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.logoContainer}>
          <Text variant="display" style={{ color: accentColor }}>
            Quality Sync
          </Text>
          <Text variant="body-lg" style={{ color: mutedColor, marginTop: 8 }}>
            {t('auth.subtitle')}
          </Text>
        </View>

        <Card variant="elevated" style={styles.card}>
          <CardContent>
            <Text variant="body-sm" style={[styles.label, { color: mutedColor }]}>{t('auth.email')}</Text>
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
                  placeholder={t('auth.emailPlaceholder')}
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

            <Text variant="body-sm" style={[styles.label, { color: mutedColor, marginTop: 16 }]}>{t('auth.password')}</Text>
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
                  placeholder={t('auth.passwordPlaceholder')}
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
              {isSubmitting ? t('auth.loggingIn') : t('auth.loginButton')}
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
  languageToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 8,
  },
  flagButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  flagButtonActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  flagEmoji: {
    fontSize: 28,
  },
});
