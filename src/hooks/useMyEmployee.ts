import { useQuery } from '@tanstack/react-query';
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
        .select('id, company_id, first_name, last_name, full_name, email, phone, personal_identity_number, user_id, hr_status')
        .eq('user_id', user.id)
        .maybeSingle();

      // Fallback: If no employee found via user_id, try email matching
      if (!data && user.email) {
        const emailResult = await supabase
          .from('employees')
          .select('id, company_id, first_name, last_name, full_name, email, phone, personal_identity_number, user_id, hr_status')
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
        personal_identity_number: employee.personal_identity_number,
        role: 'Sjuksköterska', // Default role
        hr_status: employee.hr_status,
      };
    },
  });
};
