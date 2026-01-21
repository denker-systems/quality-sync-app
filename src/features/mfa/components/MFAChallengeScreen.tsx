/**
 * MFAChallengeScreen - TOTP code input during login
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button, Card, ActivityIndicator } from 'react-native-paper';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMFA } from '../hooks/useMFA';
import { useMFAStatus } from '../hooks/useMFAStatus';
import { useAuth } from '@/hooks/useAuth';
import type { MFAChallengeProps } from '../types/mfa.types';

export function MFAChallengeScreen({ onVerified, onCancel }: MFAChallengeProps) {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { isLoading, error, completeChallenge, clearError } = useMFA();
  const { trustCurrentDevice } = useMFAStatus();
  const { signOut } = useAuth();
  const [code, setCode] = useState('');

  const bgColor = isDark ? '#171717' : '#F5F5F5';
  const cardBg = isDark ? '#262626' : '#FFFFFF';
  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#666666';
  const errorBg = isDark ? '#7F1D1D' : '#FFEBEE';
  const errorText = isDark ? '#FCA5A5' : '#C62828';

  const handleVerify = async () => {
    if (code.length !== 6) return;
    
    const success = await completeChallenge(code);
    if (success) {
      // Trust device for 6 hours after successful MFA
      await trustCurrentDevice();
      onVerified();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Card style={[styles.card, { backgroundColor: cardBg }]}>
        <Card.Content>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>🔐</Text>
          </View>
          
          <Text variant="headlineMedium" style={[styles.title, { color: textColor }]}>
            {t('mfa.challengeTitle')}
          </Text>
          
          <Text variant="bodyMedium" style={[styles.description, { color: mutedColor }]}>
            {t('mfa.challengeDescription')}
          </Text>

          {error && (
            <Card style={[styles.errorCard, { backgroundColor: errorBg }]}>
              <Card.Content>
                <Text style={[styles.errorText, { color: errorText }]}>{error}</Text>
              </Card.Content>
            </Card>
          )}

          <TextInput
            mode="outlined"
            label={t('mfa.verificationCode')}
            value={code}
            onChangeText={(text) => {
              clearError();
              setCode(text.replace(/\D/g, '').slice(0, 6));
            }}
            keyboardType="number-pad"
            maxLength={6}
            style={styles.input}
            autoFocus
            onSubmitEditing={handleVerify}
          />

          <Button
            mode="contained"
            onPress={handleVerify}
            disabled={code.length !== 6 || isLoading}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            {isLoading ? <ActivityIndicator color="#fff" /> : t('mfa.verify')}
          </Button>

          <Button
            mode="text"
            onPress={handleSignOut}
            style={styles.signOutButton}
          >
            {t('mfa.signOut')}
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 400,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconText: {
    fontSize: 48,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    marginBottom: 24,
  },
  errorCard: {
    marginBottom: 16,
  },
  errorText: {
    fontWeight: '500',
  },
  input: {
    marginBottom: 16,
    fontSize: 24,
    textAlign: 'center',
    letterSpacing: 8,
  },
  button: {
    marginBottom: 8,
  },
  buttonContent: {
    height: 48,
  },
  signOutButton: {
    marginTop: 8,
  },
});
