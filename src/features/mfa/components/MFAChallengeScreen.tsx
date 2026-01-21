/**
 * MFAChallengeScreen - TOTP code input during login
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button, Card, ActivityIndicator } from 'react-native-paper';
import { useMFA } from '../hooks/useMFA';
import { useAuth } from '@/hooks/useAuth';
import type { MFAChallengeProps } from '../types/mfa.types';

export function MFAChallengeScreen({ onVerified, onCancel }: MFAChallengeProps) {
  const { isLoading, error, completeChallenge, clearError } = useMFA();
  const { signOut } = useAuth();
  const [code, setCode] = useState('');

  const handleVerify = async () => {
    if (code.length !== 6) return;
    
    const success = await completeChallenge(code);
    if (success) {
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
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>🔐</Text>
          </View>
          
          <Text variant="headlineMedium" style={styles.title}>
            Tvåfaktorsautentisering
          </Text>
          
          <Text variant="bodyMedium" style={styles.description}>
            Ange 6-siffrig kod från din autentiseringsapp
          </Text>

          {error && (
            <Card style={styles.errorCard}>
              <Card.Content>
                <Text style={styles.errorText}>{error}</Text>
              </Card.Content>
            </Card>
          )}

          <TextInput
            mode="outlined"
            label="Verifieringskod"
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
            {isLoading ? <ActivityIndicator color="#fff" /> : 'Verifiera'}
          </Button>

          <Button
            mode="text"
            onPress={handleSignOut}
            style={styles.signOutButton}
          >
            Logga ut
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
    backgroundColor: '#f5f5f5',
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
    color: '#666',
  },
  errorCard: {
    backgroundColor: '#ffebee',
    marginBottom: 16,
  },
  errorText: {
    color: '#c62828',
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
