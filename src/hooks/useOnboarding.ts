import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';

export interface OnboardingData {
  id: string;
  employee_id: string;
  user_id?: string;
  status: 'pending' | 'invited' | 'in_progress' | 'completed';
  invitation_sent_at?: string;
  invitation_token?: string;
  started_at?: string;
  completed_at?: string;
  onboarding_data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface OnboardingStep {
  id: string;
  company_id: string;
  step_type:
    | 'welcome'
    | 'personal_info'
    | 'emergency_contact'
    | 'bank_details'
    | 'contract_signing'
    | 'handbook'
    | 'custom';
  title: string;
  description?: string;
  title_sv?: string;
  title_en?: string;
  description_sv?: string;
  description_en?: string;
  content: Record<string, any>;
  order_index: number;
  is_required: boolean;
  is_active: boolean;
}

export interface OnboardingProgress {
  id: string;
  onboarding_id: string;
  step_id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  step_data: Record<string, any>;
  completed_at?: string;
}

export interface OnboardingWithProgress {
  onboarding: OnboardingData;
  steps: OnboardingStep[];
  progress: OnboardingProgress[];
}

/**
 * Hook för att hämta onboarding data för inloggad användare
 */
export function useMyOnboarding(employeeId?: string) {
  return useQuery({
    queryKey: ['my-onboarding', employeeId],
    queryFn: async (): Promise<OnboardingWithProgress | null> => {
      if (!employeeId) return null;

      console.log('📋 Fetching onboarding for employee:', employeeId);

      // Hämta onboarding record
      const { data: onboarding, error: onboardingError } = await supabase
        .from('employee_onboarding')
        .select('*')
        .eq('employee_id', employeeId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (onboardingError) {
        console.error('❌ Failed to fetch onboarding:', onboardingError);
        throw onboardingError;
      }

      if (!onboarding) {
        console.log('ℹ️ No onboarding found');
        return null;
      }

      const onboardingData = onboarding as unknown as OnboardingData;

      // Hämta employee för att få company_id
      const { data: employee, error: employeeError } = await supabase
        .from('employees')
        .select('company_id')
        .eq('id', employeeId)
        .single();

      if (employeeError || !employee) {
        console.error('❌ Failed to fetch employee:', employeeError);
        throw employeeError;
      }

      const employeeData = employee as unknown as { company_id: string };

      // Hämta onboarding steps
      const { data: steps, error: stepsError } = await supabase
        .from('onboarding_steps')
        .select('*')
        .eq('company_id', employeeData.company_id)
        .eq('is_active', true)
        .order('order_index');

      if (stepsError) {
        console.error('❌ Failed to fetch steps:', stepsError);
        throw stepsError;
      }

      const stepsData = (steps || []) as unknown as OnboardingStep[];

      // Hämta progress
      const { data: progress, error: progressError } = await supabase
        .from('employee_onboarding_progress')
        .select('*')
        .eq('onboarding_id', onboardingData.id);

      if (progressError) {
        console.error('❌ Failed to fetch progress:', progressError);
        throw progressError;
      }

      const progressData = (progress || []) as unknown as OnboardingProgress[];

      console.log('✅ Onboarding loaded:', {
        onboardingId: onboardingData.id,
        status: onboardingData.status,
        stepsCount: stepsData.length,
        progressCount: progressData.length,
        progressStatuses: progressData.map((p) => ({ step_id: p.step_id, status: p.status })),
        activeStepsIds: stepsData.map((s) => s.id),
      });

      console.log('🔍 Detailed logging:');
      console.log('Onboarding data:', onboardingData);
      console.log('Employee data:', employeeData);
      console.log('Steps data:', stepsData);
      console.log('Progress data:', progressData);

      return {
        onboarding: onboardingData,
        steps: stepsData,
        progress: progressData,
      };
    },
    enabled: !!employeeId,
    staleTime: 1000, // 1 second - ensure fresh data
    refetchOnMount: true,
  });
}

/**
 * Hook för att uppdatera onboarding progress
 */
export function useUpdateOnboardingProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      progressId,
      status,
      stepData,
    }: {
      progressId: string;
      status: 'pending' | 'in_progress' | 'completed' | 'skipped';
      stepData?: Record<string, any>;
    }) => {
      console.log('📝 Updating onboarding progress:', progressId, status);

      const updateData: Record<string, any> = {
        status,
        updated_at: new Date().toISOString(),
      };

      if (stepData) {
        updateData.step_data = stepData;
      }

      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { data, error } = await (supabase as any)
        .from('employee_onboarding_progress')
        .update(updateData)
        .eq('id', progressId)
        .select()
        .single();

      if (error) {
        console.error('❌ Failed to update progress:', error);
        throw error;
      }

      console.log('✅ Progress updated');
      return data as unknown as OnboardingProgress;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-onboarding'] });
    },
  });
}

/**
 * Hook för att uppdatera onboarding status
 */
export function useUpdateOnboardingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      onboardingId,
      status,
    }: {
      onboardingId: string;
      status: 'pending' | 'invited' | 'in_progress' | 'completed';
    }) => {
      console.log('📝 Updating onboarding status:', onboardingId, status);

      const updateData: Record<string, any> = {
        status,
        updated_at: new Date().toISOString(),
      };

      if (status === 'in_progress' && !updateData.started_at) {
        updateData.started_at = new Date().toISOString();
      }

      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { data, error } = await (supabase as any)
        .from('employee_onboarding')
        .update(updateData)
        .eq('id', onboardingId)
        .select()
        .single();

      if (error) {
        console.error('❌ Failed to update onboarding:', error);
        throw error;
      }

      console.log('✅ Onboarding status updated');
      return data as unknown as OnboardingData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-onboarding'] });
    },
  });
}
