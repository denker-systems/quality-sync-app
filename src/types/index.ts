// Shared types from fortnox-quinyx-sync
export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  company_name: string | null;
  email: string | null;
  role: string;
  company_id: string | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  organization_number: string | null;
  contact_email: string | null;
  address: string | null;
  subscription_plan: string;
  subscription_status: string;
  stripe_customer_id: string | null;
  trial_ends_at: string | null;
  employee_limit: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  logo_url?: string | null;
}

export interface MyEmployee {
  id: string;
  user_id: string | null;
  company_id: string | null;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  email: string | null;
  phone?: string | null;
  personal_identity_number?: string | null;
  role?: string | null;
  hr_status?: string | null;
}

// Navigation types
export type RootStackParamList = {
  Login: undefined;
  Profile: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
