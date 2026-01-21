/**
 * useMFA Hook - MFA operations (enroll, challenge, verify)
 */

import { useState, useCallback } from 'react';
import { mfaService } from '../services/mfa.service';
import type { MFAEnrollmentResult, MFAFactor, AAL } from '../types/mfa.types';
import { Alert } from 'react-native';

interface UseMFAReturn {
  // State
  isLoading: boolean;
  error: string | null;
  enrollmentData: MFAEnrollmentResult | null;
  factors: MFAFactor[];
  assuranceLevel: { currentLevel: AAL; nextLevel: AAL } | null;
  
  // Actions
  startEnrollment: (friendlyName?: string) => Promise<MFAEnrollmentResult | null>;
  verifyEnrollment: (code: string) => Promise<boolean>;
  completeChallenge: (code: string) => Promise<boolean>;
  loadFactors: () => Promise<void>;
  loadAssuranceLevel: () => Promise<void>;
  unenrollFactor: (factorId: string) => Promise<boolean>;
  needsMFAChallenge: () => Promise<boolean>;
  clearError: () => void;
}

export function useMFA(): UseMFAReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enrollmentData, setEnrollmentData] = useState<MFAEnrollmentResult | null>(null);
  const [factors, setFactors] = useState<MFAFactor[]>([]);
  const [assuranceLevel, setAssuranceLevel] = useState<{ currentLevel: AAL; nextLevel: AAL } | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadFactors = useCallback(async (): Promise<void> => {
    try {
      const result = await mfaService.listFactors();
      setFactors(result);
    } catch (err: any) {
      console.error('Failed to load MFA factors:', err);
    }
  }, []);

  const loadAssuranceLevel = useCallback(async (): Promise<void> => {
    try {
      const result = await mfaService.getAssuranceLevel();
      setAssuranceLevel(result);
    } catch (err: any) {
      console.error('Failed to load assurance level:', err);
    }
  }, []);

  const startEnrollment = useCallback(async (friendlyName?: string): Promise<MFAEnrollmentResult | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await mfaService.enroll(friendlyName);
      setEnrollmentData(result);
      return result;
    } catch (err: any) {
      const message = err.message || 'Kunde inte starta MFA-registrering';
      setError(message);
      Alert.alert('Registrering misslyckades', message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyEnrollment = useCallback(async (code: string): Promise<boolean> => {
    if (!enrollmentData) {
      setError('No enrollment in progress');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const challenge = await mfaService.challenge(enrollmentData.id);
      await mfaService.verify(enrollmentData.id, challenge.id, code);
      
      setEnrollmentData(null);
      Alert.alert('MFA aktiverat', 'Tvåfaktorsautentisering är nu aktiverat för ditt konto.');
      
      await loadFactors();
      return true;
    } catch (err: any) {
      const message = err.message || 'Ogiltig verifieringskod';
      setError(message);
      Alert.alert('Verifiering misslyckades', message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [enrollmentData, loadFactors]);

  const completeChallenge = useCallback(async (code: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await mfaService.completeChallenge(code);
      await loadAssuranceLevel();
      return true;
    } catch (err: any) {
      const message = err.message || 'Ogiltig verifieringskod';
      setError(message);
      Alert.alert('Verifiering misslyckades', message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [loadAssuranceLevel]);

  const unenrollFactor = useCallback(async (factorId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await mfaService.unenroll(factorId);
      await loadFactors();
      Alert.alert('MFA inaktiverat', 'Tvåfaktorsautentisering har tagits bort.');
      return true;
    } catch (err: any) {
      const message = err.message || 'Kunde inte ta bort MFA';
      setError(message);
      Alert.alert('Fel', message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [loadFactors]);

  const needsMFAChallenge = useCallback(async (): Promise<boolean> => {
    try {
      return await mfaService.needsMFAChallenge();
    } catch (err) {
      return false;
    }
  }, []);

  return {
    isLoading,
    error,
    enrollmentData,
    factors,
    assuranceLevel,
    startEnrollment,
    verifyEnrollment,
    completeChallenge,
    loadFactors,
    loadAssuranceLevel,
    unenrollFactor,
    needsMFAChallenge,
    clearError,
  };
}
