// This file will be copied from fortnox-quinyx-sync
// For now, we use a minimal Database type
export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
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
        };
      };
      companies: {
        Row: {
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
          logo_url: string | null;
        };
      };
      employees: {
        Row: {
          id: string;
          company_id: string;
          user_id: string | null;
          first_name: string | null;
          last_name: string | null;
          full_name: string | null;
          email: string | null;
          phone: string | null;
          personal_identity_number: string | null;
          hr_status: string | null;
        };
      };
    };
  };
};
