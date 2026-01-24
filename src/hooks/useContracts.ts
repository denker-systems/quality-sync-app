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
 * Hämtar från employee_onboarding_progress där step_type === 'contract_signing'
 */
export function useMyContracts(employeeId?: string) {
  return useQuery({
    queryKey: ['my-contracts', employeeId],
    queryFn: async (): Promise<SignedContract[]> => {
      if (!employeeId) return [];

      console.log('📄 Fetching contracts for employee:', employeeId);

      // Hämta alla onboarding-poster för employee
      const { data: onboardings, error: onboardingError } = await supabase
        .from('employee_onboarding')
        .select('id')
        .eq('employee_id', employeeId);

      if (onboardingError || !onboardings || onboardings.length === 0) {
        console.log('ℹ️ No onboarding found for employee');
        return [];
      }

      const onboardingIds = onboardings.map((o: any) => o.id);

      // Hämta employee-uppgifter för att fylla i avtalet
      const { data: employeeData, error: employeeError } = await supabase
        .from('employees')
        .select('first_name, last_name, personal_identity_number, email, phone, address1, post_code, city, employment_date, monthly_salary, hourly_wage')
        .eq('id', employeeId)
        .single();

      if (employeeError) {
        console.warn('⚠️ Could not fetch employee data for contract personalization:', employeeError);
      }

      // Hämta alla completed progress records med contract_signing steg
      const { data: progress, error: progressError } = await supabase
        .from('employee_onboarding_progress')
        .select(`
          id,
          status,
          step_data,
          completed_at,
          step:onboarding_steps(
            id,
            step_type,
            title,
            content
          )
        `)
        .in('onboarding_id', onboardingIds)
        .eq('status', 'completed');

      if (progressError) {
        console.error('❌ Failed to fetch progress:', progressError);
        throw progressError;
      }

      // Filtrera endast contract_signing steg med signatur
      const signedContracts = (progress || [])
        .filter((p: any) => p.step?.step_type === 'contract_signing' && p.step_data?.signature)
        .map((p: any) => {
          const cleanTitle = (p.step?.title || 'Avtal').replace(/^Signera\s+/i, '');
          let contractContent = p.step?.content?.contract_text || '';

          // Fyll i employee-uppgifter i avtalet om de finns
          if (employeeData && contractContent) {
            const emp = employeeData as any;
            contractContent = contractContent
              .replace(/\[Namn\]|\[Medarbetarens namn\]/g, `${emp.first_name || ''} ${emp.last_name || ''}`.trim())
              .replace(/\[Personnummer\]|\[XXXXXX-XXXX\]/g, emp.personal_identity_number || 'Ej angivet')
              .replace(/\[E-post\]/g, emp.email || 'Ej angivet')
              .replace(/\[Telefon\]/g, emp.phone || 'Ej angivet')
              .replace(/\[Adress\]/g, emp.address1 || 'Ej angivet')
              .replace(/\[Postnummer\]/g, emp.post_code || 'Ej angivet')
              .replace(/\[Ort\]/g, emp.city || 'Ej angivet')
              .replace(/\[Anställningsdatum\]/g, emp.employment_date ? new Date(emp.employment_date).toLocaleDateString('sv-SE') : 'Ej angivet')
              .replace(/\[Månadslön\]/g, emp.monthly_salary ? `${emp.monthly_salary} SEK` : 'Enligt överenskommelse')
              .replace(/\[Timlön\]/g, emp.hourly_wage ? `${emp.hourly_wage} SEK` : 'Enligt överenskommelse');
          }
          
          return {
            id: p.id,
            employee_id: employeeId,
            contract_id: p.step?.id || p.id,
            signed_at: p.completed_at,
            signature_data: { signature: p.step_data.signature },
            created_at: p.completed_at,
            contract_title: cleanTitle,
            contract_type: (p.step?.content?.contract_type || 'custom') as 'employment' | 'nda' | 'custom',
            contract_content: contractContent,
          };
        });

      console.log('✅ Contracts loaded:', signedContracts.length);
      return signedContracts;
    },
    enabled: !!employeeId,
    staleTime: 60000, // 1 minute
  });
}

/**
 * Hook för att hämta ett specifikt avtal
 * Hämtar från employee_onboarding_progress
 */
export function useContract(contractId?: string) {
  return useQuery({
    queryKey: ['contract', contractId],
    queryFn: async (): Promise<SignedContract | null> => {
      if (!contractId) return null;

      console.log('📄 Fetching contract:', contractId);

      const { data, error } = await supabase
        .from('employee_onboarding_progress')
        .select(`
          id,
          status,
          step_data,
          completed_at,
          step:onboarding_steps(
            id,
            step_type,
            title,
            content
          )
        `)
        .eq('id', contractId)
        .single();

      if (error) {
        console.error('❌ Failed to fetch contract:', error);
        throw error;
      }

      if (!data || (data as any).step?.step_type !== 'contract_signing') {
        console.error('❌ Not a contract signing step');
        return null;
      }

      const p = data as any;
      const cleanTitle = (p.step?.title || 'Avtal').replace(/^Signera\s+/i, '');

      const contract: SignedContract = {
        id: p.id,
        employee_id: '', // Not available from this query
        contract_id: p.step?.id || p.id,
        signed_at: p.completed_at,
        signature_data: { signature: p.step_data?.signature },
        created_at: p.completed_at,
        contract_title: cleanTitle,
        contract_type: (p.step?.content?.contract_type || 'custom') as 'employment' | 'nda' | 'custom',
        contract_content: p.step?.content?.contract_text || '',
      };

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
