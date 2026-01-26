import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Surface, ActivityIndicator } from 'react-native-paper';
import { Bot, Coins, Zap, Clock, Calendar, TrendingUp } from 'lucide-react-native';
import { useTokenUsage } from '@/hooks/useTokenUsage';

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
}

const StatItem = ({ icon, label, value, subValue }: StatItemProps) => (
  <Surface style={styles.statItem}>
    <View style={styles.statIcon}>{icon}</View>
    <View style={styles.statContent}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </Text>
      {subValue && <Text style={styles.statSubValue}>{subValue}</Text>}
    </View>
  </Surface>
);

export const AITokenUsageCard = () => {
  const { data: stats, isLoading } = useTokenUsage();

  console.log('🤖 AI_TOKEN_USAGE_CARD render:', {
    hasStats: !!stats,
    totalRequests: stats?.totalRequests,
    isLoading,
  });

  if (isLoading) {
    return (
      <Card style={styles.card}>
        <Card.Content style={styles.loadingContent}>
          <ActivityIndicator size="small" color="#0056b3" />
        </Card.Content>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  // Inga AI-förfrågningar än
  if (stats.totalRequests === 0) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Bot size={20} color="#0056b3" />
            <Text variant="titleMedium" style={styles.title}>
              AI-användning
            </Text>
          </View>
          <View style={styles.emptyContent}>
            <Bot size={40} color="#9ca3af" />
            <Text style={styles.emptyText}>Ingen AI-användning ännu</Text>
            <Text style={styles.emptySubText}>
              Börja chatta med AI-assistenten för att se statistik
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  }

  // Estimerad kostnad (grov beräkning)
  const estimatedCost = (
    stats.totalPromptTokens * 0.0000025 +
    stats.totalCompletionTokens * 0.00001
  ).toFixed(4);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('sv-SE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <Bot size={20} color="#0056b3" />
          <Text variant="titleMedium" style={styles.title}>
            AI-användning
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <StatItem
            icon={<Coins size={16} color="#0056b3" />}
            label="Totalt tokens"
            value={stats.totalTokensUsed}
            subValue={`~$${estimatedCost}`}
          />
          <StatItem
            icon={<Zap size={16} color="#0056b3" />}
            label="Förfrågningar"
            value={stats.totalRequests}
            subValue={`${stats.avgTokensPerRequest} tokens/svar`}
          />
          <StatItem
            icon={<Clock size={16} color="#0056b3" />}
            label="Svarstid (snitt)"
            value={`${(stats.avgResponseTimeMs / 1000).toFixed(1)}s`}
          />
          <StatItem
            icon={<Calendar size={16} color="#22c55e" />}
            label="Idag"
            value={stats.tokensToday}
            subValue={`${stats.requestsToday} förfrågningar`}
          />
          <StatItem
            icon={<TrendingUp size={16} color="#3b82f6" />}
            label="Denna månad"
            value={stats.tokensThisMonth}
            subValue={`${stats.requestsThisMonth} förfrågningar`}
          />
          <StatItem
            icon={<Bot size={16} color="#0056b3" />}
            label="Första användning"
            value={formatDate(stats.firstRequestAt)}
          />
        </View>

        <View style={styles.breakdown}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>
              Input: {stats.totalPromptTokens.toLocaleString()}
            </Text>
            <Text style={styles.breakdownLabel}>
              Output: {stats.totalCompletionTokens.toLocaleString()}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressInput,
                { width: `${(stats.totalPromptTokens / stats.totalTokensUsed) * 100}%` },
              ]}
            />
            <View
              style={[
                styles.progressOutput,
                { width: `${(stats.totalCompletionTokens / stats.totalTokensUsed) * 100}%` },
              ]}
            />
          </View>
          <View style={styles.breakdownLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#3b82f6' }]} />
              <Text style={styles.legendText}>Input</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#22c55e' }]} />
              <Text style={styles.legendText}>Output</Text>
            </View>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    marginBottom: 8,
  },
  loadingContent: {
    padding: 24,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  title: {
    color: '#1f2937',
    fontWeight: '600',
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    marginTop: 12,
    color: '#6b7280',
    fontSize: 14,
  },
  emptySubText: {
    marginTop: 4,
    color: '#9ca3af',
    fontSize: 12,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    width: '48%',
  },
  statIcon: {
    padding: 6,
    backgroundColor: '#ffffff',
    borderRadius: 6,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 10,
    color: '#6b7280',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  statSubValue: {
    fontSize: 10,
    color: '#9ca3af',
  },
  breakdown: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  breakdownLabel: {
    fontSize: 11,
    color: '#6b7280',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  progressInput: {
    height: '100%',
    backgroundColor: '#3b82f6',
  },
  progressOutput: {
    height: '100%',
    backgroundColor: '#22c55e',
  },
  breakdownLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 10,
    color: '#6b7280',
  },
});

export default AITokenUsageCard;
