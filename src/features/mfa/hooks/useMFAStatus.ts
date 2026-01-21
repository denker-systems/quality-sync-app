/**
 * useMFAStatus Hook - Check if current user needs MFA
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { mfaService } from '../services/mfa.service';
import { trustedDeviceService } from '../services/trustedDevice.service';
import type { MFAStatus } from '../types/mfa.types';

interface UseMFAStatusReturn {
  status: MFAStatus | null;
  isLoading: boolean;
  isRequired: boolean;
  isEnrolled: boolean;
  needsChallenge: boolean;
  isDeviceTrusted: boolean;
  refresh: () => Promise<void>;
  trustCurrentDevice: () => Promise<void>;
}

export function useMFAStatus(): UseMFAStatusReturn {
  const { user } = useAuth();
  const [status, setStatus] = useState<MFAStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeviceTrusted, setIsDeviceTrusted] = useState(false);

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

      // Check if device is trusted (MFA bypass for configured hours)
      const deviceTrusted = await trustedDeviceService.isDeviceTrusted(user.id);
      setIsDeviceTrusted(deviceTrusted);

      // If user has MFA enrolled, it's required for this session
      // Unless the device is trusted
      const isRequired = isEnrolled && !deviceTrusted;

      console.log('🔐 MFA Status Check:');
      console.log('  isEnrolled:', isEnrolled);
      console.log('  isRequired:', isRequired);
      console.log('  isDeviceTrusted:', deviceTrusted);
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
  // Device trusted = no challenge needed even if enrolled
  const needsChallenge = status 
    ? status.isRequired && status.isEnrolled && status.currentLevel !== 'aal2' && !isDeviceTrusted
    : false;

  // Function to trust current device after successful MFA
  const trustCurrentDevice = useCallback(async () => {
    if (!user) return;
    
    // Default to 6 hours, could be fetched from company settings
    const hoursToTrust = 6;
    await trustedDeviceService.trustDevice(user.id, hoursToTrust);
    setIsDeviceTrusted(true);
  }, [user]);

  return {
    status,
    isLoading,
    isRequired,
    isEnrolled,
    needsChallenge,
    isDeviceTrusted,
    refresh: checkStatus,
    trustCurrentDevice,
  };
}
