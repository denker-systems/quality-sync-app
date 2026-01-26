import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { ScreenLayout, EmptyState } from '@/components/common';
import { Text } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMyEmployee } from '@/hooks/useMyEmployee';
import { useMyOnboarding, useUpdateOnboardingStatus } from '@/hooks/useOnboarding';
import { Star } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { OnboardingHeaderCard } from './components/OnboardingHeaderCard';
import { OnboardingPathMap } from './components/OnboardingPathMap';

export const OnboardingScreen = () => {
  const navigation = useNavigation();
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { data: employee } = useMyEmployee();
  const { data: onboardingData, isLoading } = useMyOnboarding(employee?.id);
  const updateStatus = useUpdateOnboardingStatus();
  const [openStepId, setOpenStepId] = React.useState<string | null>(null);

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
      const firstIncompleteIndex = progress.findIndex((p) => p.status !== 'completed');
      const targetIndex = firstIncompleteIndex !== -1 ? firstIncompleteIndex : 0;
      navigation.navigate('OnboardingStep', { stepIndex: targetIndex });
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
  const progressMap = new Map(progress.map((p) => [p.step_id, p]));
  const completedSteps = steps.filter(
    (step) => progressMap.get(step.id)?.status === 'completed',
  ).length;
  const totalSteps = steps.length;
  const progressPercentage = totalSteps > 0 ? completedSteps / totalSteps : 0;
  const hasStarted = onboarding.status === 'in_progress' || onboarding.status === 'completed';
  const firstIncompleteIndex = steps.findIndex(
    (step) => progressMap.get(step.id)?.status !== 'completed',
  );
  const activeIndex =
    firstIncompleteIndex === -1 ? Math.max(steps.length - 1, 0) : firstIncompleteIndex;

  return (
    <ScreenLayout title={t('onboarding.title')} isRoot={true}>
      <OnboardingHeaderCard
        title={t('onboarding.title')}
        welcomeName={employee?.first_name || undefined}
        status={onboarding.status}
        completedSteps={completedSteps}
        totalSteps={totalSteps}
        progressPercentage={progressPercentage}
        isPending={updateStatus.isPending}
        onStart={handleStartOnboarding}
      />

      <OnboardingPathMap
        steps={steps}
        progressMap={progressMap}
        hasStarted={hasStarted}
        activeIndex={activeIndex}
        openStepId={openStepId}
        onCloseBubble={() => setOpenStepId(null)}
        onToggleBubble={(stepId) => setOpenStepId(openStepId === stepId ? null : stepId)}
        onOpenStep={(index) => navigation.navigate('OnboardingStep', { stepIndex: index })}
        textColor={textColor}
        mutedColor={mutedColor}
        accentColor={accentColor}
        isDark={isDark}
      />
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
