/**
 * Types for Onboarding Admin Feature
 */

export interface AdminOnboardingStep {
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
  content: Record<string, any>;
  order_index: number;
  is_required: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface MockEmployee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company_id: string;
}

export interface PreviewProgress {
  stepId: string;
  status: 'pending' | 'in_progress' | 'completed';
  stepData: Record<string, any>;
}

export const STEP_TYPE_LABELS: Record<string, string> = {
  welcome: 'Welcome',
  personal_info: 'Personal Information',
  emergency_contact: 'Emergency Contact',
  bank_details: 'Bank Details',
  contract_signing: 'Contract Signing',
  handbook: 'Handbook',
  custom: 'Custom Step',
};

export const STEP_TYPE_LABELS_SV: Record<string, string> = {
  welcome: 'Välkomststeg',
  personal_info: 'Personuppgifter',
  emergency_contact: 'Nödkontakt',
  bank_details: 'Bankuppgifter',
  contract_signing: 'Kontraktssignering',
  handbook: 'Handbok',
  custom: 'Anpassat steg',
};
