import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { supabase } from '@/config/supabase';
import type { MyEmployee } from '@/types';

export const useMyEmployee = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['my-employee', user?.id],
    enabled: !!user?.id,
    queryFn: async (): Promise<MyEmployee | null> => {
      if (!user?.id) return null;

      // 1) Get company_id from user_profiles
      const { data: profile, error: profileErr } = await supabase
        .from('user_profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();
      
      if (profileErr) throw profileErr;
      const companyId = (profile as any)?.company_id as string | null;
      if (!companyId || !user.email) return null;

      // 2) Get employee via user_id (primary) or email (fallback)
      let { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // Fallback: If no employee found via user_id, try email matching
      if (!data && user.email) {
        const emailResult = await supabase
          .from('employees')
          .select('*')
          .eq('company_id', companyId)
          .ilike('email', user.email)
          .maybeSingle();
        
        data = emailResult.data;
        error = emailResult.error;
      }

      if (error) throw error;
      if (!data) return null;

      const employee = data as any;
      return {
        id: employee.id,
        user_id: employee.user_id,
        company_id: employee.company_id,
        first_name: employee.first_name,
        last_name: employee.last_name,
        full_name: employee.full_name,
        email: employee.email,
        phone: employee.phone,
        mobile_phone: employee.mobile_phone,
        personal_identity_number: employee.personal_identity_number,
        personal_number: employee.personal_number,
        address1: employee.address1,
        post_code: employee.post_code,
        city: employee.city,
        role: 'Sjuksköterska', // Default role
        hr_status: employee.hr_status,
      };
    },
  });
};

/**
 * Hook för att uppdatera employee-data (används vid onboarding)
 */
export const useUpdateMyEmployee = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: {
      employeeId: string;
      first_name?: string;
      last_name?: string;
      personal_identity_number?: string;
      address1?: string;
      post_code?: string;
      city?: string;
      phone?: string;
      mobile_phone?: string;
      email?: string;
    }) => {
      console.log('📝 Updating employee data:', data);

      const { employeeId, ...updateData } = data;

      // Update full_name if first_name or last_name changed
      if (updateData.first_name || updateData.last_name) {
        const { data: currentEmployee } = await supabase
          .from('employees')
          .select('first_name, last_name')
          .eq('id', employeeId)
          .single();

        const firstName = updateData.first_name || (currentEmployee as any)?.first_name || '';
        const lastName = updateData.last_name || (currentEmployee as any)?.last_name || '';
        (updateData as any).full_name = `${firstName} ${lastName}`.trim();
      }

      const { data: updatedEmployee, error } = await (supabase as any)
        .from('employees')
        .update(updateData)
        .eq('id', employeeId)
        .select()
        .single();

      if (error) {
        console.error('❌ Failed to update employee:', error);
        throw error;
      }

      console.log('✅ Employee updated successfully');
      return updatedEmployee;
    },
    onSuccess: () => {
      // Invalidate my-employee query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['my-employee', user?.id] });
    },
  });
};
