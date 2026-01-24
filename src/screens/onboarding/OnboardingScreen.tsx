import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { ScreenLayout, EmptyState } from '@/components/common';
import { Text, Card, CardContent, Button, Badge, Surface, ProgressBar } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMyEmployee } from '@/hooks/useMyEmployee';
import { useMyOnboarding, useUpdateOnboardingProgress, useUpdateOnboardingStatus, OnboardingStep } from '@/hooks/useOnboarding';
import { CheckCircle, Clock, AlertCircle, Star } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export const OnboardingScreen = () => {
  const navigation = useNavigation();
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { data: employee } = useMyEmployee();
  const { data: onboardingData, isLoading } = useMyOnboarding(employee?.id);
  const updateStatus = useUpdateOnboardingStatus();

  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';
  const accentColor = isDark ? '#6BBD68' : '#489A45';

  const handleStartOnboarding = async () => {
    if (!onboardingData) return;
    const { onboarding, progress } = onboardingData;

    if (onboarding.status === 'pending' || onboarding.status === 'invited') {
      try {
        await updateStatus.mutateAsync({
          onboardingId: onboarding.id,
          status: 'in_progress',
        });
        navigation.navigate('OnboardingStep', { stepIndex: 0 });
      } catch (error) {
        console.error('Failed to start onboarding:', error);
      }
    } else if (onboarding.status === 'in_progress') {
      const firstIncompleteIndex = progress.findIndex(p => p.status !== 'completed');
      const targetIndex = firstIncompleteIndex !== -1 ? firstIncompleteIndex : 0;
      navigation.navigate('OnboardingStep', { stepIndex: targetIndex });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} color="#10b981" />;
      case 'in_progress':
        return <Clock size={20} color="#f59e0b" />;
      default:
        return <AlertCircle size={20} color="#6b7280" />;
    }
  };

  if (isLoading) {
    return (
      <ScreenLayout title={t('onboarding.title')} scrollable={false} isRoot={true}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={accentColor} />
          <Text variant="body" style={{ color: mutedColor, marginTop: 16 }}>
            {t('onboarding.loading')}
          </Text>
        </View>
      </ScreenLayout>
    );
  }

  if (!onboardingData) {
    return (
      <ScreenLayout title={t('onboarding.title')} scrollable={false} isRoot={true}>
        <EmptyState
          icon={Star}
          title={t('onboarding.noOnboarding')}
          description={t('onboarding.noOnboardingDesc')}
          actionLabel={t('common.back')}
          onAction={() => navigation.goBack()}
        />
      </ScreenLayout>
    );
  }

  const { onboarding, steps, progress } = onboardingData;
  const progressMap = new Map(progress.map(p => [p.step_id, p]));
  const completedSteps = steps.filter(step => progressMap.get(step.id)?.status === 'completed').length;
  const totalSteps = steps.length;
  const progressPercentage = totalSteps > 0 ? completedSteps / totalSteps : 0;


  return (
    <ScreenLayout title={t('onboarding.title')} isRoot={true}>
      {/* Header Card */}
      <Card variant="elevated" style={styles.headerCard}>
        <CardContent>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text variant="h2" style={{ color: textColor }}>
                {t('onboarding.title')}
              </Text>
              <Text variant="body" style={{ color: mutedColor, marginTop: 4 }}>
                {employee?.first_name ? `Välkommen ${employee.first_name}!` : 'Välkommen!'}
              </Text>
            </View>
            <Badge variant={onboarding.status === 'completed' ? 'success' : onboarding.status === 'in_progress' ? 'warning' : 'default'}>
              {onboarding.status === 'completed' ? t('onboarding.completed') : 
               onboarding.status === 'in_progress' ? t('onboarding.inProgress') : t('onboarding.pending')}
            </Badge>
          </View>

          {/* Progress Section */}
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

          {/* Start Button - ALLTID visa om inte completed */}
          {onboarding.status !== 'completed' && (
            <View style={[styles.startButtonContainer, { borderTopColor: isDark ? '#2E2E2E' : '#E5E5E5' }]}>
              <Button 
                variant="primary" 
                onPress={handleStartOnboarding}
                disabled={updateStatus.isPending}
                style={{ backgroundColor: accentColor }}
              >
                {updateStatus.isPending ? 'Startar...' : 
                 onboarding.status === 'in_progress' ? 'Fortsätt Onboarding' : 'Starta Onboarding'}
              </Button>
            </View>
          )}
        </CardContent>
      </Card>

      {/* Steps List */}
      <Card variant="elevated" style={styles.stepsCard}>
        <CardContent>
          <Text variant="h3" style={[styles.sectionTitle, { color: textColor }]}>
            Alla steg
          </Text>
          {steps.map((step, index) => {
            const stepProgress = progressMap.get(step.id);
            const isCompleted = stepProgress?.status === 'completed';
            const canAccess = onboarding.status === 'in_progress' || onboarding.status === 'completed';

            return (
              <TouchableOpacity
                key={step.id}
                onPress={() => canAccess && navigation.navigate('OnboardingStep', { stepIndex: index })}
                activeOpacity={canAccess ? 0.7 : 1}
                disabled={!canAccess}
              >
                <Surface
                  elevation={0}
                  style={[
                    styles.stepItem,
                    { backgroundColor: isDark ? '#262626' : '#f9fafb' },
                    isCompleted && { backgroundColor: isDark ? 'rgba(107,189,104,0.1)' : '#EDF5EC' },
                    !canAccess && { opacity: 0.5 },
                  ]}
                >
                  <View style={styles.stepHeader}>
                    {getStatusIcon(stepProgress?.status || 'pending')}
                    <View style={styles.stepInfo}>
                      <Text
                        variant="body-lg"
                        style={[
                          styles.stepTitle,
                          { color: textColor },
                          isCompleted && { fontWeight: '600' },
                        ]}
                      >
                        {step.title || `Steg ${index + 1}`}
                      </Text>
                      {step.description && (
                        <Text variant="body-sm" style={{ color: mutedColor, marginTop: 2 }}>
                          {step.description}
                        </Text>
                      )}
                    </View>
                  </View>
                </Surface>
              </TouchableOpacity>
            );
          })}
        </CardContent>
      </Card>

    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    borderTopColor: '#E5E5E5',
  },
  stepsCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  stepItem: {
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
  },
});
