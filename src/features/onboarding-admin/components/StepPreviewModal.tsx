import React from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Button, Badge, Surface } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { X, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { AdminOnboardingStep, MockEmployee, PreviewProgress, STEP_TYPE_LABELS } from '../types';
import {
  WelcomeStep,
  PersonalInfoStep,
  EmergencyContactStep,
  BankDetailsStep,
  ContractSigningStep,
  HandbookStep,
} from '@/screens/onboarding/steps';

interface StepPreviewModalProps {
  visible: boolean;
  step: AdminOnboardingStep | null;
  stepIndex: number;
  totalSteps: number;
  progress: PreviewProgress | null;
  mockEmployee: MockEmployee | null;
  onClose: () => void;
  onComplete: (stepData: Record<string, any>) => void;
  onSave: (stepData: Record<string, any>) => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function StepPreviewModal({
  visible,
  step,
  stepIndex,
  totalSteps,
  progress,
  mockEmployee,
  onClose,
  onComplete,
  onSave,
  onPrevious,
  onNext,
}: StepPreviewModalProps) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();

  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';
  const bgColor = isDark ? '#171717' : '#FFFFFF';
  const headerBg = isDark ? '#262626' : '#F5F5F5';
  const accentColor = isDark ? '#6BBD68' : '#489A45';

  if (!step) return null;

  const isCompleted = progress?.status === 'completed';
  const hasPrevious = stepIndex > 0;
  const hasNext = stepIndex < totalSteps - 1;

  const renderStepComponent = () => {
    const commonProps = {
      content: step.content,
      step,
      stepData: progress?.stepData || {},
      onComplete,
      onSave,
    };

    switch (step.step_type) {
      case 'welcome':
        return <WelcomeStep {...commonProps} employeeName={mockEmployee?.first_name} />;
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
              {step.title}
            </Text>
            {step.description && (
              <Text variant="body" style={{ color: mutedColor, marginBottom: 24 }}>
                {step.description}
              </Text>
            )}
            <Button variant="primary" onPress={() => onComplete({})}>
              Mark as Complete
            </Button>
          </View>
        );
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        {/* Header */}
        <Surface
          elevation={1}
          style={[styles.header, { backgroundColor: headerBg, paddingTop: insets.top + 8 }]}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={textColor} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text variant="body-sm" style={{ color: mutedColor }}>
                Step {stepIndex + 1} of {totalSteps}
              </Text>
              <Text variant="h4" style={{ color: textColor }} numberOfLines={1}>
                {step.title || `Step ${stepIndex + 1}`}
              </Text>
            </View>
            <View style={styles.headerRight}>
              {isCompleted ? (
                <Badge variant="success">
                  <View style={styles.badgeContent}>
                    <CheckCircle size={12} color="#059669" />
                    <Text variant="tiny" style={{ color: '#059669', marginLeft: 4 }}>
                      Done
                    </Text>
                  </View>
                </Badge>
              ) : (
                <Badge variant="default">
                  {STEP_TYPE_LABELS[step.step_type] || step.step_type}
                </Badge>
              )}
            </View>
          </View>

          {/* Navigation buttons */}
          <View style={styles.navButtons}>
            <TouchableOpacity
              onPress={onPrevious}
              disabled={!hasPrevious}
              style={[styles.navButton, !hasPrevious && styles.navButtonDisabled]}
            >
              <ChevronLeft size={20} color={hasPrevious ? accentColor : mutedColor} />
              <Text variant="body-sm" style={{ color: hasPrevious ? accentColor : mutedColor }}>
                Previous
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onNext}
              disabled={!hasNext}
              style={[styles.navButton, !hasNext && styles.navButtonDisabled]}
            >
              <Text variant="body-sm" style={{ color: hasNext ? accentColor : mutedColor }}>
                Next
              </Text>
              <ChevronRight size={20} color={hasNext ? accentColor : mutedColor} />
            </TouchableOpacity>
          </View>
        </Surface>

        {/* Content */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
        >
          {renderStepComponent()}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  closeButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerRight: {
    minWidth: 60,
    alignItems: 'flex-end',
  },
  badgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 4,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  defaultStep: {
    padding: 24,
    alignItems: 'center',
  },
});
