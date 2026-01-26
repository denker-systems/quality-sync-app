import React, { useMemo, memo, useCallback } from 'react';
import { ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';
import { MotiPressable } from 'moti/interactions';
import { Text, OnboardingPathNode, OnboardingStepDialog } from '@/components/ui';
import type { OnboardingProgress, OnboardingStep } from '@/hooks/useOnboarding';
import { SPRING_CONFIGS } from '@/lib/animations';
import { useLanguage } from '@/contexts/LanguageContext';
import { getOnboardingStepTitle, getOnboardingStepDescription } from '@/utils/onboardingLanguage';

const getStepImage = (stepType: string): ImageSourcePropType | undefined => {
  switch (stepType) {
    case 'welcome':
      return require('../../../../assets/images/onboarding.png');
    case 'personal_info':
      return require('../../../../assets/images/profile.png');
    case 'contract_signing':
    case 'handbook':
      return require('../../../../assets/images/contract.png');
    case 'emergency_contact':
    case 'bank_details':
      return require('../../../../assets/images/schedule.png');
    default:
      return undefined;
  }
};

interface OnboardingPathMapProps {
  steps: OnboardingStep[];
  progressMap: Map<string, OnboardingProgress>;
  hasStarted: boolean;
  activeIndex: number;
  openStepId: string | null;
  onCloseBubble: () => void;
  onToggleBubble: (stepId: string) => void;
  onOpenStep: (index: number) => void;
  textColor: string;
  mutedColor: string;
  accentColor: string;
  isDark: boolean;
}

const StepNode = memo(function StepNode({
  step,
  index,
  stepProgress,
  hasStarted,
  activeIndex,
  openStepId,
  onToggleBubble,
  accentColor,
  textColor,
  t,
  language,
}: {
  step: OnboardingStep;
  index: number;
  stepProgress: OnboardingProgress | undefined;
  hasStarted: boolean;
  activeIndex: number;
  openStepId: string | null;
  onToggleBubble: (stepId: string) => void;
  accentColor: string;
  textColor: string;
  t: (key: string, params?: any) => string;
  language: string;
}) {
  const isCompleted = stepProgress?.status === 'completed';
  const isActive = hasStarted ? !isCompleted && index === activeIndex : index === 0;
  const isLocked = hasStarted ? index > activeIndex : index !== 0;
  const canAccess = hasStarted && !isLocked;
  const status: 'completed' | 'active' | 'locked' | 'upcoming' = isCompleted
    ? 'completed'
    : isActive
      ? 'active'
      : isLocked
        ? 'locked'
        : 'upcoming';
  const offsetDirection = index % 2 === 0 ? -1 : 1;
  const horizontalOffset = offsetDirection * 40;
  const isOpen = openStepId === step.id;

  const handlePress = useCallback(() => {
    if (canAccess) {
      onToggleBubble(step.id);
    }
  }, [canAccess, onToggleBubble, step.id]);

  const animateStyle = useCallback(
    ({ pressed }: { pressed: boolean }) => {
      'worklet';
      return {
        scale: pressed || isOpen ? 1.25 : 1,
        opacity: pressed ? 0.95 : 1,
      };
    },
    [isOpen],
  );

  return (
    <View style={[styles.stepRow, { transform: [{ translateX: horizontalOffset }] }]}>
      <MotiPressable
        disabled={!canAccess}
        onPress={handlePress}
        animate={animateStyle}
        transition={SPRING_CONFIGS.snappy}
        style={styles.stepNodePressable}
      >
        <OnboardingPathNode
          status={status}
          accentColor={accentColor}
          image={getStepImage(step.step_type)}
        />
        <Text
          variant="body-sm"
          style={[styles.stepLabel, { color: textColor, opacity: isLocked ? 0.6 : 1 }]}
        >
          {getOnboardingStepTitle(step, language === 'sv' ? 'sv' : 'en') ||
            t('onboarding.stepNumber', { number: index + 1 })}
        </Text>
      </MotiPressable>
    </View>
  );
});

export const OnboardingPathMap = memo(function OnboardingPathMap({
  steps,
  progressMap,
  hasStarted,
  activeIndex,
  openStepId,
  onCloseBubble,
  onToggleBubble,
  onOpenStep,
  textColor,
  mutedColor,
  accentColor,
  isDark,
}: OnboardingPathMapProps) {
  const { t, language } = useLanguage();
  const openIndex = useMemo(
    () => steps.findIndex((step) => step.id === openStepId),
    [steps, openStepId],
  );
  const openStep = openIndex >= 0 ? steps[openIndex] : null;

  const memoizedSteps = useMemo(
    () =>
      steps.map((step, index) => {
        const stepProgress = progressMap.get(step.id);
        return (
          <StepNode
            key={step.id}
            step={step}
            index={index}
            stepProgress={stepProgress}
            hasStarted={hasStarted}
            activeIndex={activeIndex}
            openStepId={openStepId}
            onToggleBubble={onToggleBubble}
            accentColor={accentColor}
            textColor={textColor}
            t={t}
            language={language}
          />
        );
      }),
    [
      steps,
      progressMap,
      hasStarted,
      activeIndex,
      openStepId,
      onToggleBubble,
      accentColor,
      textColor,
      t,
      language,
    ],
  );

  return (
    <View style={styles.stepsSection}>
      <Text variant="h3" style={[styles.sectionTitle, { color: textColor }]}>
        {t('onboarding.journeyTitle')}
      </Text>
      <View style={styles.pathContainer} pointerEvents="box-none">
        {openStepId && <Pressable style={styles.bubbleOverlay} onPress={onCloseBubble} />}
        {memoizedSteps}
      </View>
      <OnboardingStepDialog
        visible={!!openStep && openIndex >= 0}
        title={openStep ? getOnboardingStepTitle(openStep, language === 'sv' ? 'sv' : 'en') : ''}
        description={
          openStep
            ? getOnboardingStepDescription(openStep, language === 'sv' ? 'sv' : 'en')
            : undefined
        }
        actionLabel={t('onboarding.openButton')}
        onAction={() => openIndex >= 0 && onOpenStep(openIndex)}
        onClose={onCloseBubble}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  stepsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  pathContainer: {
    position: 'relative',
    paddingVertical: 8,
    alignItems: 'center',
  },
  bubbleOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  stepRow: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 24,
    zIndex: 1,
  },
  stepNodePressable: {
    alignItems: 'center',
    gap: 10,
  },
  stepLabel: {
    textAlign: 'center',
  },
});

export default OnboardingPathMap;
