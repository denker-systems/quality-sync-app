import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { supabase } from '@/config/supabase';
import type { Company } from '@/types';

export const useCompanyData = () => {
  const { user } = useAuth();

  const {
    data: company,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['company-data', user?.id],
    enabled: !!user?.id,
    queryFn: async (): Promise<Company | null> => {
      if (!user?.id) return null;

      // Get company_id from user_profiles
      const { data: profile, error: profileErr } = await supabase
        .from('user_profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (profileErr) throw profileErr;
      const companyId = (profile as any)?.company_id;
      if (!companyId) return null;

      // Get company data
      const { data: companyData, error: companyErr } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();

      if (companyErr) throw companyErr;
      return companyData;
    },
  });

  return {
    company,
    loading: isLoading,
    error,
  };
};
