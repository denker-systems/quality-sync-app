import React, { useRef } from 'react';
import { StyleSheet, View, ScrollView, Dimensions } from 'react-native';
import { ScreenLayout } from '@/components/common';
import { Text, Button, Surface, ProgressBar } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMyEmployee } from '@/hooks/useMyEmployee';
import { useMyOnboarding, useUpdateOnboardingProgress, useUpdateOnboardingStatus } from '@/hooks/useOnboarding';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import {
  WelcomeStep,
  PersonalInfoStep,
  EmergencyContactStep,
  BankDetailsStep,
  ContractSigningStep,
  HandbookStep,
} from './steps';
import type { RootStackParamList } from '@/types';

type OnboardingStepScreenRouteProp = RouteProp<RootStackParamList, 'OnboardingStep'>;
type OnboardingStepScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OnboardingStep'>;

export const OnboardingStepScreen = () => {
  const route = useRoute<OnboardingStepScreenRouteProp>();
  const navigation = useNavigation<OnboardingStepScreenNavigationProp>();
  const { isDark } = useTheme();
  const { data: employee } = useMyEmployee();
  const stepSubmitRef = useRef<(() => void) | null>(null);

  // Use preview data if available, otherwise fetch real data
  const { stepIndex, previewData } = route.params;
  const { data: fetchedData } = useMyOnboarding(employee?.id);
  const onboardingData = previewData || fetchedData;

  const updateProgress = useUpdateOnboardingProgress();
  const updateStatus = useUpdateOnboardingStatus();

  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';
  const accentColor = isDark ? '#6BBD68' : '#489A45';

  if (!onboardingData) {
    return (
      <ScreenLayout title="Onboarding" scrollable={false}>
        <View style={styles.loadingContainer}>
          <Text variant="body" style={{ color: mutedColor }}>
            Loading step...
          </Text>
        </View>
      </ScreenLayout>
    );
  }

  const { onboarding, steps, progress } = onboardingData;
  const currentStep = steps[stepIndex];
  const currentProgress = progress[stepIndex];

  if (!currentStep || !currentProgress) {
    return (
      <ScreenLayout title="Onboarding" scrollable={false}>
        <View style={styles.loadingContainer}>
          <Text variant="body" style={{ color: mutedColor }}>
            Step not found
          </Text>
        </View>
      </ScreenLayout>
    );
  }

  const completedSteps = progress.filter(p => p.status === 'completed').length;
  const totalSteps = steps.length;
  const progressPercentage = totalSteps > 0 ? completedSteps / totalSteps : 0;

  const hasPrevious = stepIndex > 0;
  const hasNext = stepIndex < totalSteps - 1;

  const handleStepComplete = async (stepData: Record<string, any>) => {
    console.log('✅ ONBOARDING_STEP_SCREEN handleStepComplete:', {
      stepIndex,
      stepType: currentStep?.step_type,
      stepData,
      isPreview: !!previewData
    });

    // Handle Preview Mode
    if (previewData) {
      if (stepIndex === steps.length - 1) {
        console.log('🏁 PREVIEW: Last step - returning to preview list');
        navigation.goBack();
      } else {
        console.log('➡️ PREVIEW: Moving to next step:', stepIndex + 1);
        navigation.replace('OnboardingStep', { 
          stepIndex: stepIndex + 1,
          previewData 
        });
      }
      return;
    }

    try {
      await updateProgress.mutateAsync({
        progressId: currentProgress.id,
        status: 'completed',
        stepData,
      });

      if (stepIndex === steps.length - 1) {
        console.log('🏁 Last step - completing onboarding');
        await updateStatus.mutateAsync({
          onboardingId: onboarding.id,
          status: 'completed',
        });
        navigation.navigate('Onboarding');
      } else {
        console.log('➡️ Moving to next step:', stepIndex + 1);
        navigation.replace('OnboardingStep', { stepIndex: stepIndex + 1 });
      }
    } catch (err) {
      console.error('❌ Failed to complete step:', err);
    }
  };

  const handleStepSave = async (stepData: Record<string, any>) => {
    console.log('💾 ONBOARDING_STEP_SCREEN handleStepSave:', {
      stepIndex,
      stepType: currentStep?.step_type,
      stepData,
    });

    if (previewData) {
      console.log('🧪 PREVIEW: Step data saved (local only)');
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

  const handlePrevious = () => {
    if (hasPrevious) {
      navigation.replace('OnboardingStep', { 
        stepIndex: stepIndex - 1,
        previewData 
      });
    }
  };

  const handleNext = async () => {
    // Trigger step validation/submission if available
    if (stepSubmitRef.current) {
      stepSubmitRef.current();
    } else if (hasNext) {
      // No validation needed, just navigate
      navigation.replace('OnboardingStep', { 
        stepIndex: stepIndex + 1,
        previewData
      });
    } else {
      // Last step - complete onboarding
      if (!previewData) {
        await updateStatus.mutateAsync({
          onboardingId: onboarding.id,
          status: 'completed',
        });
      }
      navigation.navigate('Onboarding');
    }
  };

  const handleBack = () => {
    // If in preview mode, always go back to preview screen
    if (previewData) {
      navigation.goBack();
    } else if (hasPrevious) {
      handlePrevious();
    } else {
      navigation.goBack();
    }
  };

  const renderStepComponent = () => {
    const commonProps = {
      content: currentStep.content,
      stepData: currentProgress?.step_data || {},
      onComplete: handleStepComplete,
      onSave: handleStepSave,
      submitRef: stepSubmitRef,
    };

    switch (currentStep.step_type) {
      case 'welcome':
        return (
          <WelcomeStep
            {...commonProps}
            employeeName={employee?.first_name || undefined}
          />
        );
      case 'personal_info':
        return <PersonalInfoStep {...commonProps} />;
      case 'emergency_contact':
        return <EmergencyContactStep {...commonProps} />;
      case 'bank_details':
        return <BankDetailsStep {...commonProps} />;
      case 'contract_signing':
        return <ContractSigningStep {...commonProps} />;
      case 'handbook':
        return <HandbookStep {...commonProps} />;
      default:
        return (
          <View style={styles.defaultStep}>
            <Text variant="h3" style={{ color: textColor, marginBottom: 12 }}>
              {currentStep.title}
            </Text>
            {currentStep.description && (
              <Text variant="body" style={{ color: mutedColor, marginBottom: 24 }}>
                {currentStep.description}
              </Text>
            )}
            <Button variant="primary" onPress={() => handleStepComplete({})}>
              Continue
            </Button>
          </View>
        );
    }
  };

  return (
    <ScreenLayout 
      title="Onboarding" 
      scrollable={false} 
      noPadding
      onBackPress={handleBack}
      contentStyle={{ paddingBottom: 0 }}
    >
      <View style={styles.layoutContainer}>
        {/* Header with Progress */}
        <Surface elevation={1} style={styles.header}>
          <View style={styles.headerContent}>
            <Text variant="body-sm" style={{ color: mutedColor }}>
              Step {stepIndex + 1} of {totalSteps}
            </Text>
            <Text variant="h3" style={{ color: textColor }}>
              {currentStep.title}
            </Text>
          </View>
          <ProgressBar 
            progress={progressPercentage} 
            style={styles.progressBar} 
          />
        </Surface>

        {/* Step Content - ScrollView */}
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {renderStepComponent()}
        </ScrollView>

        {/* Navigation Footer */}
        <Surface elevation={2} style={styles.footer}>
          <Button
            variant="outline"
            onPress={handlePrevious}
            disabled={!hasPrevious}
            style={styles.navButton}
          >
            <View style={styles.navButtonContent}>
              <ChevronLeft size={20} color={hasPrevious ? accentColor : mutedColor} />
              <Text variant="body" style={{ color: hasPrevious ? accentColor : mutedColor }}>
                Previous
              </Text>
            </View>
          </Button>

          <Button
            variant="outline"
            onPress={handleNext}
            disabled={!hasNext}
            style={styles.navButton}
          >
            <View style={styles.navButtonContent}>
              <Text variant="body" style={{ color: hasNext ? accentColor : mutedColor }}>
                Next
              </Text>
              <ChevronRight size={20} color={hasNext ? accentColor : mutedColor} />
            </View>
          </Button>
        </Surface>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  layoutContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerContent: {
    gap: 4,
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E5E5',
  },
  content: {
    height: Dimensions.get('window').height * 0.70,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  navButton: {
    flex: 1,
  },
  navButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  defaultStep: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
});
