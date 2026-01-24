import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Badge, Button, Card, CardContent, ProgressBar, Text } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';

interface OnboardingHeaderCardProps {
  title: string;
  welcomeName?: string;
  status: 'pending' | 'invited' | 'in_progress' | 'completed';
  completedSteps: number;
  totalSteps: number;
  progressPercentage: number;
  isPending: boolean;
  onStart: () => void;
}

export function OnboardingHeaderCard({
  title,
  welcomeName,
  status,
  completedSteps,
  totalSteps,
  progressPercentage,
  isPending,
  onStart,
}: OnboardingHeaderCardProps) {
  const { isDark } = useTheme();
  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';
  const accentColor = isDark ? '#6BBD68' : '#489A45';

  return (
    <Card variant="elevated" style={styles.headerCard}>
      <CardContent>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text variant="h2" style={{ color: textColor }}>
              {title}
            </Text>
            <Text variant="body" style={{ color: mutedColor, marginTop: 4 }}>
              {welcomeName ? `Välkommen ${welcomeName}!` : 'Välkommen!'}
            </Text>
          </View>
          <Badge variant={status === 'completed' ? 'success' : status === 'in_progress' ? 'warning' : 'default'}>
            {status === 'completed' ? 'Klar' : status === 'in_progress' ? 'Pågår' : 'Ej startad'}
          </Badge>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text variant="body-sm" style={{ color: mutedColor }}>
              Framsteg
            </Text>
            <Text variant="body-sm" style={{ color: textColor, fontWeight: '600' }}>
              {completedSteps} av {totalSteps} slutförda
            </Text>
          </View>
          <ProgressBar progress={progressPercentage} style={styles.progressBar} />
        </View>

        {status !== 'completed' && (
          <View style={[styles.startButtonContainer, { borderTopColor: isDark ? '#2E2E2E' : '#E5E5E5' }]}>
            <Button
              variant="primary"
              onPress={onStart}
              disabled={isPending}
              style={{ backgroundColor: accentColor }}
            >
              {isPending ? 'Startar...' : status === 'in_progress' ? 'Fortsätt Onboarding' : 'Starta Onboarding'}
            </Button>
          </View>
        )}
      </CardContent>
    </Card>
  );
}

const styles = StyleSheet.create({
  headerCard: {
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  progressSection: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  startButtonContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
  },
});

export default OnboardingHeaderCard;
