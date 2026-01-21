/**
 * MFA Types - Type definitions for Multi-Factor Authentication
 */

export type AAL = 'aal1' | 'aal2';

export interface MFAFactor {
  id: string;
  friendly_name: string;
  factor_type: 'totp';
  status: 'verified' | 'unverified';
  created_at: string;
  updated_at: string;
}

export interface MFAEnrollmentResult {
  id: string;
  type: 'totp';
  totp: {
    qr_code: string;
    secret: string;
    uri: string;
  };
}

export interface MFAChallengeResult {
  id: string;
  expires_at: number;
}

export interface MFAStatus {
  isEnrolled: boolean;
  isRequired: boolean;
  currentLevel: AAL;
  nextLevel: AAL;
  factors: MFAFactor[];
}

export interface MFAEnrollmentProps {
  onEnrolled: () => void;
  onCancelled?: () => void;
  required?: boolean;
}

export interface MFAChallengeProps {
  onVerified: () => void;
  onCancel?: () => void;
}

export interface MFAGateProps {
  children: React.ReactNode;
}
