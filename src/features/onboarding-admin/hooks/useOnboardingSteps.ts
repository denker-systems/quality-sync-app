import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';
import { useCompanyData } from '@/hooks/useCompanyData';
import { AdminOnboardingStep } from '../types';

/**
 * Hook to fetch all onboarding steps for admin management
 */
export function useOnboardingSteps(companyId?: string) {
  const { company } = useCompanyData();
  const targetCompanyId = companyId || company?.id;

  return useQuery({
    queryKey: ['admin-onboarding-steps', targetCompanyId],
    queryFn: async (): Promise<AdminOnboardingStep[]> => {
      if (!targetCompanyId) return [];

      console.log('📋 Fetching onboarding steps for admin:', targetCompanyId);

      const { data, error } = await (supabase as any)
        .from('onboarding_steps')
        .select('*')
        .eq('company_id', targetCompanyId)
        .order('order_index');

      if (error) {
        console.error('❌ Failed to fetch onboarding steps:', error);
        throw error;
      }

      console.log('✅ Fetched', data?.length || 0, 'steps');
      return (data || []) as AdminOnboardingStep[];
    },
    enabled: !!targetCompanyId,
    staleTime: 30000,
  });
}

/**
 * Hook to update an onboarding step
 */
export function useUpdateOnboardingStep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (step: Partial<AdminOnboardingStep> & { id: string }) => {
      const { id, ...updates } = step;

      console.log('📝 Updating onboarding step:', id);

      const { data, error } = await (supabase as any)
        .from('onboarding_steps')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Failed to update step:', error);
        throw error;
      }

      console.log('✅ Step updated');
      return data as AdminOnboardingStep;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-onboarding-steps'] });
    },
  });
}

/**
 * Hook to create a new onboarding step
 */
export function useCreateOnboardingStep() {
  const queryClient = useQueryClient();
  const { company } = useCompanyData();

  return useMutation({
    mutationFn: async (stepData: Omit<AdminOnboardingStep, 'id' | 'created_at' | 'updated_at'>) => {
      const targetCompanyId = stepData.company_id || company?.id;
      if (!targetCompanyId) throw new Error('No company ID');

      console.log('➕ Creating onboarding step');

      const { data, error } = await (supabase as any)
        .from('onboarding_steps')
        .insert({
          ...stepData,
          company_id: targetCompanyId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Failed to create step:', error);
        throw error;
      }

      console.log('✅ Step created');
      return data as AdminOnboardingStep;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-onboarding-steps'] });
    },
  });
}

/**
 * Hook to delete an onboarding step
 */
export function useDeleteOnboardingStep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (stepId: string) => {
      console.log('🗑️ Deleting onboarding step:', stepId);

      const { error } = await (supabase as any).from('onboarding_steps').delete().eq('id', stepId);

      if (error) {
        console.error('❌ Failed to delete step:', error);
        throw error;
      }

      console.log('✅ Step deleted');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-onboarding-steps'] });
    },
  });
}
