import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/config/supabase';

export interface TokenUsageStats {
  totalTokensUsed: number;
  totalPromptTokens: number;
  totalCompletionTokens: number;
  totalRequests: number;
  avgTokensPerRequest: number;
  avgResponseTimeMs: number;
  tokensToday: number;
  requestsToday: number;
  tokensThisMonth: number;
  requestsThisMonth: number;
  firstRequestAt: string | null;
}

export const useTokenUsage = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['token-usage', user?.id],
    enabled: !!user?.id,
    queryFn: async (): Promise<TokenUsageStats | null> => {
      console.log('🤖 TOKEN_USAGE: Fetching stats for user:', user?.id);
      
      if (!user?.id) return null;

      // Hämta token usage från ai_token_usage
      const { data, error } = await (supabase as any)
        .from('ai_token_usage')
        .select('total_tokens, prompt_tokens, completion_tokens, response_time_ms, created_at')
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ TOKEN_USAGE: Failed to fetch:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.log('ℹ️ TOKEN_USAGE: No usage data found');
        return {
          totalTokensUsed: 0,
          totalPromptTokens: 0,
          totalCompletionTokens: 0,
          totalRequests: 0,
          avgTokensPerRequest: 0,
          avgResponseTimeMs: 0,
          tokensToday: 0,
          requestsToday: 0,
          tokensThisMonth: 0,
          requestsThisMonth: 0,
          firstRequestAt: null,
        };
      }

      const today = new Date().toISOString().split('T')[0];
      const thisMonth = new Date().toISOString().slice(0, 7);

      const stats: TokenUsageStats = {
        totalTokensUsed: 0,
        totalPromptTokens: 0,
        totalCompletionTokens: 0,
        totalRequests: data.length,
        avgTokensPerRequest: 0,
        avgResponseTimeMs: 0,
        tokensToday: 0,
        requestsToday: 0,
        tokensThisMonth: 0,
        requestsThisMonth: 0,
        firstRequestAt: null,
      };

      let totalResponseTime = 0;
      let firstDate: string | null = null;

      data.forEach((row: any) => {
        const tokens = row.total_tokens || 0;
        const prompt = row.prompt_tokens || 0;
        const completion = row.completion_tokens || 0;
        const responseTime = row.response_time_ms || 0;
        const createdAt = row.created_at || '';

        stats.totalTokensUsed += tokens;
        stats.totalPromptTokens += prompt;
        stats.totalCompletionTokens += completion;
        totalResponseTime += responseTime;

        if (createdAt.startsWith(today)) {
          stats.tokensToday += tokens;
          stats.requestsToday++;
        }

        if (createdAt.startsWith(thisMonth)) {
          stats.tokensThisMonth += tokens;
          stats.requestsThisMonth++;
        }

        if (!firstDate || createdAt < firstDate) {
          firstDate = createdAt;
        }
      });

      stats.avgTokensPerRequest = Math.round(stats.totalTokensUsed / stats.totalRequests);
      stats.avgResponseTimeMs = Math.round(totalResponseTime / stats.totalRequests);
      stats.firstRequestAt = firstDate;

      console.log('✅ TOKEN_USAGE: Stats loaded:', {
        totalRequests: stats.totalRequests,
        totalTokens: stats.totalTokensUsed,
      });

      return stats;
    },
    staleTime: 60000, // 1 minute
  });
};
