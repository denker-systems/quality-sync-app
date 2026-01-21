/**
 * useMFAStatus Hook - Check if current user needs MFA
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { mfaService } from '../services/mfa.service';
import type { MFAStatus } from '../types/mfa.types';

interface UseMFAStatusReturn {
  status: MFAStatus | null;
  isLoading: boolean;
  isRequired: boolean;
  isEnrolled: boolean;
  needsChallenge: boolean;
  refresh: () => Promise<void>;
}

export function useMFAStatus(): UseMFAStatusReturn {
  const { user } = useAuth();
  const [status, setStatus] = useState<MFAStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkStatus = useCallback(async () => {
    if (!user) {
      setStatus(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const { currentLevel, nextLevel } = await mfaService.getAssuranceLevel();
      const factors = await mfaService.listFactors();
      const verifiedFactors = factors.filter(f => f.status === 'verified');
      const isEnrolled = verifiedFactors.length > 0;

      // If user has MFA enrolled, it's required for this session
      // This matches the web app behavior
      const isRequired = isEnrolled;

      console.log('🔐 MFA Status Check:');
      console.log('  isEnrolled:', isEnrolled);
      console.log('  isRequired:', isRequired);
      console.log('  currentLevel:', currentLevel);
      console.log('  nextLevel:', nextLevel);
      console.log('  verifiedFactors:', verifiedFactors.length);

      setStatus({
        isEnrolled,
        isRequired,
        currentLevel,
        nextLevel,
        factors: verifiedFactors,
      });
    } catch (err) {
      console.error('❌ Failed to check MFA status:', err);
      setStatus({
        isEnrolled: false,
        isRequired: false,
        currentLevel: 'aal1',
        nextLevel: 'aal1',
        factors: [],
      });
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const isRequired = status?.isRequired ?? false;
  const isEnrolled = status?.isEnrolled ?? false;
  const needsChallenge = status 
    ? status.isRequired && status.isEnrolled && status.currentLevel !== 'aal2'
    : false;

  return {
    status,
    isLoading,
    isRequired,
    isEnrolled,
    needsChallenge,
    refresh: checkStatus,
  };
}
