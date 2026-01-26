import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/config/supabase';

export interface MyShift {
  id?: number;
  shift_id: string;
  employee_id?: string;
  employee_name?: string;
  unit?: string;
  section?: string;
  from_time: string;
  to_time: string;
  shift_type: string;
  breaks_duration: number;
  company_id: string;
}

export const useMyShifts = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['my-shifts', user?.id],
    enabled: !!user?.id,
    queryFn: async (): Promise<MyShift[]> => {
      console.log('📅 SHIFTS: Fetching shifts for user:', user?.id);

      if (!user?.id) return [];

      // 1) Hämta company_id från user_profiles
      const { data: profile, error: profileErr } = await supabase
        .from('user_profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (profileErr) {
        console.error('❌ SHIFTS: Failed to fetch profile:', profileErr);
        throw profileErr;
      }

      const companyId = (profile as any)?.company_id as string | null;
      if (!companyId || !user.email) {
        console.log('ℹ️ SHIFTS: No company_id or email found');
        return [];
      }

      // 2) Hämta employee via email + company_id
      const { data: emp, error: empErr } = await supabase
        .from('employees')
        .select('id, company_id, full_name, first_name, last_name, email')
        .eq('company_id', companyId)
        .eq('email', user.email)
        .maybeSingle();

      if (empErr) {
        console.error('❌ SHIFTS: Failed to fetch employee:', empErr);
        throw empErr;
      }

      const employee = emp as any;
      if (!employee?.id) {
        console.log('ℹ️ SHIFTS: No employee found');
        return [];
      }

      // 3) Fetch shifts for this employee
      const { data, error } = await (supabase as any)
        .from('quinyx_shifts')
        .select(
          `
          id,
          quinyx_shift_id,
          employee_id,
          start_time,
          end_time,
          shift_type,
          department,
          cost_center,
          break_minutes,
          company_id,
          updated_at,
          created_at
        `,
        )
        .eq('company_id', employee.company_id as string)
        .eq('employee_id', employee.id)
        .order('start_time', { ascending: true });

      if (error) {
        console.error('❌ SHIFTS: Failed to fetch shifts:', error);
        throw error;
      }

      const fullName =
        (employee.full_name as string | null) ||
        [employee.first_name, employee.last_name].filter(Boolean).join(' ').trim();

      const shifts = (data || []).map((row: any) => ({
        id: row.id ? Number(row.id) : undefined,
        shift_id: row.quinyx_shift_id || '',
        employee_id: row.employee_id || undefined,
        employee_name: fullName || undefined,
        unit: row.cost_center || '-',
        section: row.cost_center || '-',
        from_time: row.start_time,
        to_time: row.end_time,
        shift_type: row.shift_type || 'SCHEDULED',
        breaks_duration: row.break_minutes || 0,
        company_id: row.company_id || '',
      }));

      console.log('✅ SHIFTS: Loaded', shifts.length, 'shifts');
      return shifts;
    },
  });
};
