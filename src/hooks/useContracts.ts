import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';

export interface SignedContract {
  id: string;
  employee_id: string;
  contract_id: string;
  signed_at: string;
  signature_data?: Record<string, any>;
  created_at: string;
  contract?: {
    title: string;
    contract_type: string;
    content: string;
  };
  // Flattened for backwards compatibility
  contract_title?: string;
  contract_type?: 'employment' | 'nda' | 'custom';
  contract_content?: string;
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
        .from('employee_contract_signatures')
        .select(`
          id,
          contract_id,
          employee_id,
          signed_at,
          signature_data,
          created_at,
          contract:employee_contracts(
            title,
            contract_type,
            content
          )
        `)
        .eq('employee_id', employeeId)
        .order('signed_at', { ascending: false });

      if (error) {
        console.error('❌ Failed to fetch contracts:', error);
        throw error;
      }

      // Flatten contract data for backwards compatibility
      const contracts = (data || []).map((item: any) => ({
        ...item,
        contract_title: item.contract?.title,
        contract_type: item.contract?.contract_type as 'employment' | 'nda' | 'custom',
        contract_content: item.contract?.content,
      })) as SignedContract[];

      console.log('✅ Contracts loaded:', contracts.length);
      return contracts;
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

      console.log('📄 Fetching contract signature:', contractId);

      const { data, error } = await supabase
        .from('employee_contract_signatures')
        .select(`
          id,
          contract_id,
          employee_id,
          signed_at,
          signature_data,
          created_at,
          contract:employee_contracts(
            title,
            contract_type,
            content
          )
        `)
        .eq('id', contractId)
        .single();

      if (error) {
        console.error('❌ Failed to fetch contract:', error);
        throw error;
      }

      // Flatten contract data
      const contract = data ? {
        ...(data as any),
        contract_title: (data as any).contract?.title,
        contract_type: (data as any).contract?.contract_type as 'employment' | 'nda' | 'custom',
        contract_content: (data as any).contract?.content,
      } as SignedContract : null;

      console.log('✅ Contract loaded');
      return contract;
    },
    enabled: !!contractId,
    staleTime: 300000, // 5 minutes
  });
}

/**
 * Avtalsmall från employee_contracts (för signering)
 */
export interface ContractTemplate {
  id: string;
  company_id: string;
  contract_type: string;
  title: string;
  content: string;
  version: number;
  is_active: boolean;
  requires_signature: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Hook för att hämta avtalsmall baserat på typ
 * Används av ContractSigningStep för att ladda avtal från databasen
 */
export function useContractTemplate(companyId?: string, contractType: string = 'employment') {
  return useQuery({
    queryKey: ['contract-template', companyId, contractType],
    queryFn: async (): Promise<ContractTemplate | null> => {
      if (!companyId) return null;

      console.log('📄 Fetching contract template:', { companyId, contractType });

      const { data, error } = await (supabase as any)
        .from('employee_contracts')
        .select('*')
        .eq('company_id', companyId)
        .eq('contract_type', contractType)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('❌ Failed to fetch contract template:', error);
        throw error;
      }

      console.log('✅ Contract template loaded:', data?.title);
      return data as ContractTemplate | null;
    },
    enabled: !!companyId,
    staleTime: 300000, // 5 minutes
  });
}
