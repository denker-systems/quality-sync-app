import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';

export interface SignedContract {
  id: string;
  employee_id: string;
  contract_id: string;
  contract_title: string;
  contract_type: 'employment' | 'nda' | 'custom';
  contract_content: string;
  signed_at: string;
  signature_data?: Record<string, any>;
  pdf_url?: string;
  created_at: string;
}

/**
 * Hook för att hämta signerade avtal för inloggad användare
 */
export function useMyContracts(employeeId?: string) {
  return useQuery({
    queryKey: ['my-contracts', employeeId],
    queryFn: async (): Promise<SignedContract[]> => {
      if (!employeeId) return [];

      console.log('📄 Fetching contracts for employee:', employeeId);

      const { data, error } = await supabase
        .from('signed_contracts')
        .select('*')
        .eq('employee_id', employeeId)
        .order('signed_at', { ascending: false });

      if (error) {
        console.error('❌ Failed to fetch contracts:', error);
        throw error;
      }

      console.log('✅ Contracts loaded:', data?.length || 0);
      return data || [];
    },
    enabled: !!employeeId,
    staleTime: 60000, // 1 minute
  });
}

/**
 * Hook för att hämta ett specifikt avtal
 */
export function useContract(contractId?: string) {
  return useQuery({
    queryKey: ['contract', contractId],
    queryFn: async (): Promise<SignedContract | null> => {
      if (!contractId) return null;

      console.log('📄 Fetching contract:', contractId);

      const { data, error } = await supabase
        .from('signed_contracts')
        .select('*')
        .eq('id', contractId)
        .single();

      if (error) {
        console.error('❌ Failed to fetch contract:', error);
        throw error;
      }

      console.log('✅ Contract loaded');
      return data;
    },
    enabled: !!contractId,
    staleTime: 300000, // 5 minutes
  });
}
