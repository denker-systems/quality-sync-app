/**
 * Utility functions for handling multilingual onboarding steps
 */

import type { OnboardingStep } from '@/hooks/useOnboarding';

export type Language = 'sv' | 'en';

/**
 * Get the title for an onboarding step in the specified language
 * Falls back to the other language if not available, then to legacy field
 */
export function getOnboardingStepTitle(
  step: OnboardingStep,
  language: Language
): string {
  if (language === 'sv') {
    return step.title_sv || step.title_en || step.title || '';
  }
  return step.title_en || step.title_sv || step.title || '';
}

/**
 * Get the description for an onboarding step in the specified language
 * Falls back to the other language if not available, then to legacy field
 */
export function getOnboardingStepDescription(
  step: OnboardingStep,
  language: Language
): string | undefined {
  if (language === 'sv') {
    return step.description_sv || step.description_en || step.description;
  }
  return step.description_en || step.description_sv || step.description;
}
