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
  const { data: onboardingData, isLoading, error } = useMyOnboarding(employee?.id);
  const updateProgress = useUpdateOnboardingProgress();
  const updateStatus = useUpdateOnboardingStatus();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';
  const accentColor = isDark ? '#6BBD68' : '#489A45';

  useEffect(() => {
    if (onboardingData?.progress) {
      const firstIncomplete = onboardingData.progress.findIndex(
        p => p.status !== 'completed'
      );
      if (firstIncomplete !== -1) {
        setCurrentStepIndex(firstIncomplete);
      }
    }
  }, [onboardingData]);

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
  const currentStep = steps[currentStepIndex];
  const currentProgress = progress[currentStepIndex];

  const completedSteps = progress.filter(p => p.status === 'completed').length;
  const totalSteps = steps.length;
  const progressPercentage = totalSteps > 0 ? completedSteps / totalSteps : 0;

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'in_progress':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const handleCompleteStep = async () => {
    if (!currentProgress) return;

    try {
      await updateProgress.mutateAsync({
        progressId: currentProgress.id,
        status: 'completed',
        stepData: currentProgress.step_data,
      });

      // Om detta var sista steget, markera onboarding som completed
      if (currentStepIndex === steps.length - 1) {
        await updateStatus.mutateAsync({
          onboardingId: onboarding.id,
          status: 'completed',
        });
      } else {
        // Gå till nästa steg
        setCurrentStepIndex(currentStepIndex + 1);
      }
    } catch (error) {
      console.error('Failed to complete step:', error);
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleStepComplete = async (stepData: Record<string, any>) => {
    console.log('✅ ONBOARDING_SCREEN handleStepComplete:', {
      stepIndex: currentStepIndex,
      stepType: currentStep?.step_type,
      stepData,
    });
    
    if (!currentProgress) {
      console.warn('⚠️ No currentProgress available');
      return;
    }

    try {
      console.log('📤 Updating progress to completed...');
      await updateProgress.mutateAsync({
        progressId: currentProgress.id,
        status: 'completed',
        stepData,
      });

      if (currentStepIndex === steps.length - 1) {
        console.log('🏁 Last step - completing onboarding');
        await updateStatus.mutateAsync({
          onboardingId: onboarding.id,
          status: 'completed',
        });
        navigation.goBack();
      } else {
        console.log('➡️ Moving to next step:', currentStepIndex + 1);
        setCurrentStepIndex(currentStepIndex + 1);
      }
    } catch (err) {
      console.error('❌ Failed to complete step:', err);
    }
  };

  const handleStepSave = async (stepData: Record<string, any>) => {
    console.log('💾 ONBOARDING_SCREEN handleStepSave:', {
      stepIndex: currentStepIndex,
      stepType: currentStep?.step_type,
      stepData,
    });
    
    if (!currentProgress) {
      console.warn('⚠️ No currentProgress available');
      return;
    }

    try {
      await updateProgress.mutateAsync({
        progressId: currentProgress.id,
        status: 'in_progress',
        stepData,
      });
      console.log('✅ Step data saved');
    } catch (err) {
      console.error('❌ Failed to save step:', err);
    }
  };


  return (
    <ScreenLayout>
      {/* Header */}
      <Surface elevation={1} style={styles.header}>
        <View style={styles.headerContent}>
          <Text variant="h2" style={{ color: textColor }}>{t('onboarding.title')}</Text>
          <Badge variant={onboarding.status === 'completed' ? 'success' : 'default'}>
            {onboarding.status === 'completed' ? t('onboarding.completed') : 
             onboarding.status === 'in_progress' ? t('onboarding.inProgress') : t('onboarding.pending')}
          </Badge>
        </View>
        <Text variant="body" style={[styles.headerSubtext, { color: mutedColor }]}>
          {t('onboarding.stepsCompleted').replace('{{completed}}', String(completedSteps)).replace('{{total}}', String(totalSteps))}
        </Text>
        <ProgressBar progress={progressPercentage} style={styles.progressBar} />
      </Surface>

      {/* Steps List */}
      <Card variant="elevated" style={styles.stepsCard}>
        <CardContent>
          <Text variant="h3" style={[styles.sectionTitle, { color: textColor }]}>
            {t('onboarding.allSteps')}
          </Text>
          {steps.map((step, index) => {
            const stepProgress = progress[index];
            const isActive = index === currentStepIndex;

            return (
              <TouchableOpacity
                key={step.id}
                onPress={() => navigation.navigate('OnboardingStep', { stepIndex: index })}
                activeOpacity={0.7}
              >
                <Surface
                  elevation={isActive ? 2 : 0}
                  style={[
                    styles.stepItem,
                    isActive && styles.stepItemActive,
                  ]}
                >
                  <View style={styles.stepHeader}>
                    {getStatusIcon(stepProgress?.status || 'pending')}
                    <Text
                      variant="body-lg"
                      style={[
                        styles.stepTitle,
                        { color: isActive ? accentColor : textColor },
                      ]}
                    >
                      {step.title}
                    </Text>
                  </View>
                  {step.description && (
                    <Text variant="body-sm" style={[styles.stepDescription, { color: mutedColor }]}>
                      {step.description}
                    </Text>
                  )}
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
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  emptyTitle: {
    textAlign: 'center',
    marginTop: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
  },
  backButton: {
    marginTop: 16,
  },
  header: {
    padding: 16,
    borderRadius: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
  },
  headerSubtext: {
    color: '#6b7280',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  stepsCard: {
    marginTop: 8,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  stepItem: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
  },
  stepItemActive: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#0056b3',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepTitle: {
    flex: 1,
  },
  stepTitleActive: {
    fontWeight: '600',
    color: '#0056b3',
  },
  stepDescription: {
    marginTop: 4,
    marginLeft: 28,
    color: '#6b7280',
  },
  currentStepCard: {
    marginTop: 8,
  },
  currentStepTitle: {
    marginBottom: 8,
  },
  currentStepDescription: {
    color: '#6b7280',
    marginBottom: 16,
  },
  stepContent: {
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
  button: {
    flex: 1,
  },
  primaryButton: {
    flex: 2,
  },
  stepContentContainer: {
    marginTop: 8,
  },
});
