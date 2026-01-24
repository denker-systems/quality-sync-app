import React, { useMemo } from 'react';
import { ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';
import { MotiPressable } from 'moti/interactions';
import { Text, OnboardingPathNode, OnboardingStepDialog } from '@/components/ui';
import type { OnboardingProgress, OnboardingStep } from '@/hooks/useOnboarding';

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

export function OnboardingPathMap({
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
  const openIndex = useMemo(() => steps.findIndex((step) => step.id === openStepId), [steps, openStepId]);
  const openStep = openIndex >= 0 ? steps[openIndex] : null;

  return (
    <View style={styles.stepsSection}>
      <Text variant="h3" style={[styles.sectionTitle, { color: textColor }]}>
        Din onboarding‑resa
      </Text>
      <View style={styles.pathContainer} pointerEvents="box-none">
        {openStepId && (
          <Pressable style={styles.bubbleOverlay} onPress={onCloseBubble} />
        )}
        {steps.map((step, index) => {
          const stepProgress = progressMap.get(step.id);
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

          return (
            <View
              key={step.id}
              style={[styles.stepRow, { transform: [{ translateX: horizontalOffset }] }]}
            >
              <MotiPressable
                disabled={!canAccess}
                onPress={() => canAccess && onToggleBubble(step.id)}
                animate={({ pressed }) => {
                  'worklet';
                  return {
                    scale: pressed || isOpen ? 1.25 : 1,
                    opacity: pressed ? 0.95 : 1,
                  };
                }}
                transition={{ type: 'spring', damping: 16, stiffness: 200 }}
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
                  {step.title || `Steg ${index + 1}`}
                </Text>
              </MotiPressable>

            </View>
          );
        })}
      </View>
      <OnboardingStepDialog
        visible={!!openStep && openIndex >= 0}
        title={openStep?.title || `Steg ${openIndex + 1}`}
        description={openStep?.description}
        actionLabel="Öppna"
        onAction={() => openIndex >= 0 && onOpenStep(openIndex)}
        onClose={onCloseBubble}
      />
    </View>
  );
}

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
