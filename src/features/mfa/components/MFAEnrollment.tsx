/**
 * MFAEnrollment - QR code enrollment for Google Authenticator
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Card, ActivityIndicator } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import { useMFA } from '../hooks/useMFA';
import type { MFAEnrollmentProps } from '../types/mfa.types';

export function MFAEnrollment({ onEnrolled, onCancelled, required = false }: MFAEnrollmentProps) {
  const { 
    isLoading, 
    error, 
    enrollmentData, 
    startEnrollment, 
    verifyEnrollment,
    clearError 
  } = useMFA();
  
  const [verifyCode, setVerifyCode] = useState('');

  useEffect(() => {
    startEnrollment();
  }, []);

  const handleVerify = async () => {
    if (verifyCode.length !== 6) return;
    
    const success = await verifyEnrollment(verifyCode);
    if (success) {
      onEnrolled();
    }
  };

  if (isLoading && !enrollmentData) {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content style={styles.loadingContent}>
            <ActivityIndicator size="large" />
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>📱</Text>
          </View>
          
          <Text variant="headlineMedium" style={styles.title}>
            Aktivera 2FA
          </Text>
          
          <Text variant="bodyMedium" style={styles.description}>
            Skanna QR-koden med Google Authenticator
          </Text>

          {error && (
            <Card style={styles.errorCard}>
              <Card.Content>
                <Text style={styles.errorText}>{error}</Text>
              </Card.Content>
            </Card>
          )}

          {/* QR Code */}
          {enrollmentData?.totp.qr_code && (
            <View style={styles.qrContainer}>
              <WebView
                source={{ html: `
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
                          background: white;
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
                ` }}
                style={styles.qrCode}
                scrollEnabled={false}
              />
            </View>
          )}

          {/* Manual secret entry */}
          {enrollmentData?.totp.secret && (
            <View style={styles.secretContainer}>
              <Text variant="labelSmall" style={styles.secretLabel}>
                Manuell inmatning:
              </Text>
              <Card style={styles.secretCard}>
                <Card.Content>
                  <Text style={styles.secretText}>
                    {enrollmentData.totp.secret}
                  </Text>
                </Card.Content>
              </Card>
            </View>
          )}

          {/* Verification code input */}
          <View style={styles.inputContainer}>
            <Text variant="labelLarge" style={styles.inputLabel}>
              Ange verifieringskod
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
              placeholder="000000"
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
                Avbryt
              </Button>
            )}
            <Button
              mode="contained"
              onPress={handleVerify}
              disabled={verifyCode.length !== 6 || isLoading}
              style={required ? styles.fullButton : styles.actionButton}
              contentStyle={styles.buttonContent}
            >
              {isLoading ? <ActivityIndicator color="#fff" /> : 'Aktivera'}
            </Button>
          </View>

          {required && (
            <Text variant="bodySmall" style={styles.requiredText}>
              Du måste aktivera 2FA för att fortsätta
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
    backgroundColor: '#f5f5f5',
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
    color: '#666',
  },
  errorCard: {
    backgroundColor: '#ffebee',
    marginBottom: 16,
  },
  errorText: {
    color: '#c62828',
  },
  qrContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  qrCode: {
    width: 250,
    height: 250,
    backgroundColor: 'white',
  },
  secretContainer: {
    marginBottom: 24,
  },
  secretLabel: {
    marginBottom: 8,
    color: '#666',
  },
  secretCard: {
    backgroundColor: '#f5f5f5',
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
    color: '#666',
  },
});
