/**
 * MFAGate - Wrapper component that enforces MFA when required
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { useMFAStatus } from '../hooks/useMFAStatus';
import { MFAChallengeScreen } from './MFAChallengeScreen';
import { MFAEnrollment } from './MFAEnrollment';
import type { MFAGateProps } from '../types/mfa.types';

type MFAState = 'loading' | 'passed' | 'needs-enrollment' | 'needs-challenge';

export function MFAGate({ children }: MFAGateProps) {
  const { isLoading, isRequired, isEnrolled, needsChallenge, refresh } = useMFAStatus();
  const [mfaState, setMFAState] = useState<MFAState>('loading');

  useEffect(() => {
    if (isLoading) {
      setMFAState('loading');
      return;
    }

    // If MFA is not required for this user's role, pass through
    if (!isRequired) {
      setMFAState('passed');
      return;
    }

    // MFA is required
    if (!isEnrolled) {
      // User needs to set up MFA first
      setMFAState('needs-enrollment');
      return;
    }

    if (needsChallenge) {
      // User has MFA but hasn't verified this session
      setMFAState('needs-challenge');
      return;
    }

    // User has MFA and is verified (aal2)
    setMFAState('passed');
  }, [isLoading, isRequired, isEnrolled, needsChallenge]);

  const handleEnrolled = () => {
    // After enrollment, user still needs to complete challenge
    setMFAState('needs-challenge');
    refresh();
  };

  const handleVerified = () => {
    setMFAState('passed');
    refresh();
  };

  // Loading state
  if (mfaState === 'loading') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text variant="bodyLarge" style={styles.loadingText}>
          Kontrollerar säkerhet...
        </Text>
      </View>
    );
  }

  // Needs to set up MFA
  if (mfaState === 'needs-enrollment') {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text variant="headlineMedium" style={styles.title}>
            2FA krävs
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            Din organisation kräver tvåfaktorsautentisering för säkerhet
          </Text>
          <MFAEnrollment onEnrolled={handleEnrolled} required={true} />
        </View>
      </View>
    );
  }

  // Needs to verify MFA
  if (mfaState === 'needs-challenge') {
    return <MFAChallengeScreen onVerified={handleVerified} />;
  }

  // MFA passed or not required - render children
  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  content: {
    width: '100%',
    maxWidth: 400,
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
});
