// Onboarding Admin Feature
// Separate from employee onboarding - for admin/superadmin preview and management

export { OnboardingAdminScreen, OnboardingPreviewScreen } from './screens';
export { OnboardingStepsEditor, OnboardingStepCard } from './components';
export {
  useOnboardingSteps,
  useUpdateOnboardingStep,
  useCreateOnboardingStep,
  useDeleteOnboardingStep,
} from './hooks/useOnboardingSteps';
export type { AdminOnboardingStep, MockEmployee, PreviewProgress } from './types';
