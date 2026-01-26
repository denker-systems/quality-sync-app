/**
 * MFAEnrollment - QR code enrollment for Google Authenticator
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Card, ActivityIndicator } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMFA } from '../hooks/useMFA';
import type { MFAEnrollmentProps } from '../types/mfa.types';

export function MFAEnrollment({ onEnrolled, onCancelled, required = false }: MFAEnrollmentProps) {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { isLoading, error, enrollmentData, startEnrollment, verifyEnrollment, clearError } =
    useMFA();

  const [verifyCode, setVerifyCode] = useState('');

  const bgColor = isDark ? '#171717' : '#F5F5F5';
  const cardBg = isDark ? '#262626' : '#FFFFFF';
  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#666666';
  const errorBg = isDark ? '#7F1D1D' : '#FFEBEE';
  const errorText = isDark ? '#FCA5A5' : '#C62828';
  const secretCardBg = isDark ? '#404040' : '#F5F5F5';
  const qrBg = isDark ? '#262626' : '#FFFFFF';

  useEffect(() => {
    startEnrollment();
  }, [startEnrollment]);

  const handleVerify = async () => {
    if (verifyCode.length !== 6) return;

    const success = await verifyEnrollment(verifyCode);
    if (success) {
      onEnrolled();
    }
  };

  if (isLoading && !enrollmentData) {
    return (
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <Card style={[styles.card, { backgroundColor: cardBg }]}>
          <Card.Content style={styles.loadingContent}>
            <ActivityIndicator size="large" />
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: bgColor }]}>
      <Card style={[styles.card, { backgroundColor: cardBg }]}>
        <Card.Content>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>📱</Text>
          </View>

          <Text variant="headlineMedium" style={[styles.title, { color: textColor }]}>
            {t('mfa.enrollmentTitle')}
          </Text>

          <Text variant="bodyMedium" style={[styles.description, { color: mutedColor }]}>
            {t('mfa.enrollmentDescription')}
          </Text>

          {error && (
            <Card style={[styles.errorCard, { backgroundColor: errorBg }]}>
              <Card.Content>
                <Text style={[styles.errorText, { color: errorText }]}>{error}</Text>
              </Card.Content>
            </Card>
          )}

          {/* QR Code */}
          {enrollmentData?.totp.qr_code && (
            <View style={styles.qrContainer}>
              <WebView
                source={{
                  html: `
                  <html>
                    <head>
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <style>
                        body {
                          margin: 0;
                          padding: 20px;
                          display: flex;
                          justify-content: center;
                          align-items: center;
                          background: ${qrBg};
                        }
                        svg {
                          max-width: 100%;
                          height: auto;
                        }
                      </style>
                    </head>
                    <body>
                      ${enrollmentData.totp.qr_code}
                    </body>
                  </html>
                `,
                }}
                style={[styles.qrCode, { backgroundColor: qrBg }]}
                scrollEnabled={false}
              />
            </View>
          )}

          {/* Manual secret entry */}
          {enrollmentData?.totp.secret && (
            <View style={styles.secretContainer}>
              <Text variant="labelSmall" style={[styles.secretLabel, { color: mutedColor }]}>
                {t('mfa.manualEntry')}
              </Text>
              <Card style={[styles.secretCard, { backgroundColor: secretCardBg }]}>
                <Card.Content>
                  <Text style={[styles.secretText, { color: textColor }]}>
                    {enrollmentData.totp.secret}
                  </Text>
                </Card.Content>
              </Card>
            </View>
          )}

          {/* Verification code input */}
          <View style={styles.inputContainer}>
            <Text variant="labelLarge" style={[styles.inputLabel, { color: textColor }]}>
              {t('mfa.enterCode')}
            </Text>
            <TextInput
              mode="outlined"
              value={verifyCode}
              onChangeText={(text) => {
                clearError();
                setVerifyCode(text.replace(/\D/g, '').slice(0, 6));
              }}
              keyboardType="number-pad"
              maxLength={6}
              placeholder={t('mfa.codePlaceholder')}
              style={styles.input}
              onSubmitEditing={handleVerify}
            />
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            {!required && onCancelled && (
              <Button
                mode="outlined"
                onPress={onCancelled}
                style={styles.cancelButton}
                disabled={isLoading}
              >
                {t('common.cancel')}
              </Button>
            )}
            <Button
              mode="contained"
              onPress={handleVerify}
              disabled={verifyCode.length !== 6 || isLoading}
              style={required ? styles.fullButton : styles.actionButton}
              contentStyle={styles.buttonContent}
            >
              {isLoading ? <ActivityIndicator color="#fff" /> : t('mfa.activate')}
            </Button>
          </View>

          {required && (
            <Text variant="bodySmall" style={[styles.requiredText, { color: mutedColor }]}>
              {t('mfa.required')}
            </Text>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 400,
  },
  loadingContent: {
    padding: 48,
    alignItems: 'center',
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
  qrContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  qrCode: {
    width: 250,
    height: 250,
  },
  secretContainer: {
    marginBottom: 24,
  },
  secretLabel: {
    marginBottom: 8,
  },
  secretCard: {
    // backgroundColor set dynamically
  },
  secretText: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    marginBottom: 8,
  },
  input: {
    fontSize: 24,
    textAlign: 'center',
    letterSpacing: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  actionButton: {
    flex: 1,
  },
  fullButton: {
    width: '100%',
  },
  buttonContent: {
    height: 48,
  },
  requiredText: {
    textAlign: 'center',
    marginTop: 16,
  },
});
