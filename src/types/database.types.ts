// This file will be copied from fortnox-quinyx-sync
// For now, we use a minimal Database type
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

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
        Insert: {
          id?: string;
          first_name?: string | null;
          last_name?: string | null;
          company_name?: string | null;
          email?: string | null;
          role?: string;
          company_id?: string | null;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string | null;
          last_name?: string | null;
          company_name?: string | null;
          email?: string | null;
          role?: string;
          company_id?: string | null;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
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
        Insert: {
          id?: string;
          name?: string;
          organization_number?: string | null;
          contact_email?: string | null;
          address?: string | null;
          subscription_plan?: string;
          subscription_status?: string;
          stripe_customer_id?: string | null;
          trial_ends_at?: string | null;
          employee_limit?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          logo_url?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          organization_number?: string | null;
          contact_email?: string | null;
          address?: string | null;
          subscription_plan?: string;
          subscription_status?: string;
          stripe_customer_id?: string | null;
          trial_ends_at?: string | null;
          employee_limit?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          logo_url?: string | null;
        };
        Relationships: [];
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
          mobile_phone: string | null;
          personal_identity_number: string | null;
          personal_number: string | null;
          address1: string | null;
          post_code: string | null;
          city: string | null;
          employment_date: string | null;
          monthly_salary: number | null;
          hourly_wage: number | null;
          hr_status: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          company_id?: string;
          user_id?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          full_name?: string | null;
          email?: string | null;
          phone?: string | null;
          mobile_phone?: string | null;
          personal_identity_number?: string | null;
          personal_number?: string | null;
          address1?: string | null;
          post_code?: string | null;
          city?: string | null;
          employment_date?: string | null;
          monthly_salary?: number | null;
          hourly_wage?: number | null;
          hr_status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          company_id?: string;
          user_id?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          full_name?: string | null;
          email?: string | null;
          phone?: string | null;
          mobile_phone?: string | null;
          personal_identity_number?: string | null;
          personal_number?: string | null;
          address1?: string | null;
          post_code?: string | null;
          city?: string | null;
          employment_date?: string | null;
          monthly_salary?: number | null;
          hourly_wage?: number | null;
          hr_status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      employee_onboarding: {
        Row: {
          id: string;
          employee_id: string;
          user_id: string | null;
          status: string;
          invitation_sent_at: string | null;
          invitation_token: string | null;
          started_at: string | null;
          completed_at: string | null;
          onboarding_data: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          employee_id?: string;
          user_id?: string | null;
          status?: string;
          invitation_sent_at?: string | null;
          invitation_token?: string | null;
          started_at?: string | null;
          completed_at?: string | null;
          onboarding_data?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          employee_id?: string;
          user_id?: string | null;
          status?: string;
          invitation_sent_at?: string | null;
          invitation_token?: string | null;
          started_at?: string | null;
          completed_at?: string | null;
          onboarding_data?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      onboarding_steps: {
        Row: {
          id: string;
          company_id: string;
          step_type: string;
          title: string;
          description: string | null;
          title_sv: string | null;
          title_en: string | null;
          description_sv: string | null;
          description_en: string | null;
          content: Json;
          order_index: number;
          is_required: boolean;
          is_active: boolean;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          company_id?: string;
          step_type?: string;
          title?: string;
          description?: string | null;
          title_sv?: string | null;
          title_en?: string | null;
          description_sv?: string | null;
          description_en?: string | null;
          content?: Json;
          order_index?: number;
          is_required?: boolean;
          is_active?: boolean;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          company_id?: string;
          step_type?: string;
          title?: string;
          description?: string | null;
          title_sv?: string | null;
          title_en?: string | null;
          description_sv?: string | null;
          description_en?: string | null;
          content?: Json;
          order_index?: number;
          is_required?: boolean;
          is_active?: boolean;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      employee_onboarding_progress: {
        Row: {
          id: string;
          onboarding_id: string;
          step_id: string;
          status: string;
          step_data: Json;
          completed_at: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          onboarding_id?: string;
          step_id?: string;
          status?: string;
          step_data?: Json;
          completed_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          onboarding_id?: string;
          step_id?: string;
          status?: string;
          step_data?: Json;
          completed_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
  };
};
