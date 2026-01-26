/**
 * MFA Service - Wrapper around Supabase MFA API
 */

import { supabase } from '@/config/supabase';
import type { MFAEnrollmentResult, MFAChallengeResult, MFAFactor, AAL } from '../types/mfa.types';

class MFAService {
  /**
   * Start MFA enrollment - generates QR code for Google Authenticator
   */
  async enroll(friendlyName?: string): Promise<MFAEnrollmentResult> {
    console.log('🔐 MFA Service: Starting enrollment');

    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: friendlyName || 'Google Authenticator',
    });

    if (error) {
      console.error('❌ MFA enrollment failed:', error);
      throw error;
    }

    console.log('✅ MFA enrollment successful');
    return {
      id: data.id,
      type: data.type as 'totp',
      totp: {
        qr_code: data.totp.qr_code,
        secret: data.totp.secret,
        uri: data.totp.uri,
      },
    };
  }

  /**
   * Create a challenge for MFA verification
   */
  async challenge(factorId: string): Promise<MFAChallengeResult> {
    console.log('🔐 MFA Service: Creating challenge for factor:', factorId);

    const { data, error } = await supabase.auth.mfa.challenge({ factorId });

    if (error) {
      console.error('❌ MFA challenge failed:', error);
      throw error;
    }

    console.log('✅ MFA challenge created');
    return { id: data.id, expires_at: data.expires_at };
  }

  /**
   * Verify TOTP code
   */
  async verify(factorId: string, challengeId: string, code: string): Promise<boolean> {
    console.log('🔐 MFA Service: Verifying code');

    const { error } = await supabase.auth.mfa.verify({ factorId, challengeId, code });

    if (error) {
      console.error('❌ MFA verification failed:', error);
      throw error;
    }

    console.log('✅ MFA verification successful');
    return true;
  }

  /**
   * List all MFA factors for current user
   */
  async listFactors(): Promise<MFAFactor[]> {
    const { data, error } = await supabase.auth.mfa.listFactors();

    if (error) {
      console.error('❌ Failed to list MFA factors:', error);
      throw error;
    }

    return [...(data.totp || []), ...(data.phone || [])] as MFAFactor[];
  }

  /**
   * Get verified TOTP factors only
   */
  async getVerifiedTOTPFactors(): Promise<MFAFactor[]> {
    const factors = await this.listFactors();
    return factors.filter((f) => f.factor_type === 'totp' && f.status === 'verified');
  }

  /**
   * Unenroll (remove) a factor
   */
  async unenroll(factorId: string): Promise<void> {
    console.log('🔐 MFA Service: Unenrolling factor:', factorId);

    const { error } = await supabase.auth.mfa.unenroll({ factorId });

    if (error) {
      console.error('❌ MFA unenroll failed:', error);
      throw error;
    }

    console.log('✅ MFA unenrolled successfully');
  }

  /**
   * Get current Authenticator Assurance Level
   */
  async getAssuranceLevel(): Promise<{ currentLevel: AAL; nextLevel: AAL }> {
    const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

    if (error) {
      console.error('❌ Failed to get assurance level:', error);
      throw error;
    }

    return {
      currentLevel: (data.currentLevel || 'aal1') as AAL,
      nextLevel: (data.nextLevel || 'aal1') as AAL,
    };
  }

  /**
   * Check if user needs to complete MFA challenge
   */
  async needsMFAChallenge(): Promise<boolean> {
    const { currentLevel, nextLevel } = await this.getAssuranceLevel();
    return nextLevel === 'aal2' && currentLevel !== 'aal2';
  }

  /**
   * Complete full MFA challenge flow
   */
  async completeChallenge(code: string): Promise<boolean> {
    console.log('🔐 MFA Service: Completing challenge');

    const factors = await this.getVerifiedTOTPFactors();

    if (factors.length === 0) {
      throw new Error('No verified TOTP factors found');
    }

    const factorId = factors[0].id;
    const challenge = await this.challenge(factorId);
    return await this.verify(factorId, challenge.id, code);
  }
}

export const mfaService = new MFAService();
