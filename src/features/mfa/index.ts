/**
 * MFA Feature - Multi-Factor Authentication
 */

// Services
export { mfaService } from './services/mfa.service';

// Hooks
export { useMFA } from './hooks/useMFA';
export { useMFAStatus } from './hooks/useMFAStatus';

// Components
export { MFAGate } from './components/MFAGate';
export { MFAChallengeScreen } from './components/MFAChallengeScreen';
export { MFAEnrollment } from './components/MFAEnrollment';

// Types
export type {
  AAL,
  MFAFactor,
  MFAEnrollmentResult,
  MFAChallengeResult,
  MFAStatus,
  MFAEnrollmentProps,
  MFAChallengeProps,
  MFAGateProps,
} from './types/mfa.types';
