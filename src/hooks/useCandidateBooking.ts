import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/config/supabase';

export interface CandidateBooking {
  id: string;
  email: string;
  name: string;
  step: number;
  interview_date?: string;
  interview_time?: string;
  note?: string;
  status: string;
}

export const useCandidateBooking = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const bookingQuery = useQuery({
    queryKey: ['candidate-booking', user?.email],
    enabled: !!user?.email,
    queryFn: async (): Promise<CandidateBooking | null> => {
      console.log('📆 BOOKING: Fetching booking for:', user?.email);
      
      if (!user?.email) return null;

      const { data, error } = await (supabase as any)
        .from('job_applications')
        .select(`
          id,
          email,
          first_name,
          last_name,
          status,
          created_at
        `)
        .eq('email', user.email)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('❌ BOOKING: Failed to fetch:', error);
        throw error;
      }

      if (!data) {
        console.log('ℹ️ BOOKING: No application found');
        return null;
      }

      const app = data as any;
      console.log('✅ BOOKING: Found application:', app.status);
      
      // job_applications doesn't have interview fields - this is for future use
      return {
        id: app.id,
        email: app.email || '',
        name: `${app.first_name || ''} ${app.last_name || ''}`.trim(),
        step: 1, // Default - no step column in current schema
        interview_date: undefined,
        interview_time: undefined,
        note: undefined,
        status: app.status || 'pending',
      };
    },
  });

  const confirmInterview = useMutation({
    mutationFn: async ({ candidateId, confirmed }: { candidateId: string; confirmed: boolean }) => {
      console.log('📆 BOOKING: Confirming interview:', { candidateId, confirmed });
      
      const noteText = confirmed 
        ? 'Intervjutid bekräftad av kandidat' 
        : 'Kandidat begär ny intervjutid';

      const { data, error } = await (supabase as any)
        .from('job_applications')
        .update({ 
          notes: noteText,
          updated_at: new Date().toISOString()
        })
        .eq('id', candidateId)
        .select()
        .single();

      if (error) {
        console.error('❌ BOOKING: Failed to confirm:', error);
        throw error;
      }

      console.log('✅ BOOKING: Interview confirmed');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate-booking'] });
    },
  });

  return {
    booking: bookingQuery.data,
    isLoading: bookingQuery.isLoading,
    error: bookingQuery.error,
    confirmInterview,
  };
};
