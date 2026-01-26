import React from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator } from 'react-native';
import { Text, Button } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { Plus, Eye, Settings } from 'lucide-react-native';
import { useOnboardingSteps, useUpdateOnboardingStep } from '../hooks/useOnboardingSteps';
import { OnboardingStepCard } from './OnboardingStepCard';
import { AdminOnboardingStep } from '../types';

interface OnboardingStepsEditorProps {
  companyId?: string;
  onPreview: () => void;
  onAddStep?: () => void;
  onEditStep?: (step: AdminOnboardingStep) => void;
}

export function OnboardingStepsEditor({
  companyId,
  onPreview,
  onAddStep,
  onEditStep,
}: OnboardingStepsEditorProps) {
  const { isDark } = useTheme();
  const { data: steps, isLoading } = useOnboardingSteps(companyId);
  const updateStep = useUpdateOnboardingStep();

  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';
  const accentColor = isDark ? '#6BBD68' : '#489A45';

  const handleToggleRequired = async (step: AdminOnboardingStep) => {
    await updateStep.mutateAsync({
      id: step.id,
      is_required: !step.is_required,
    });
  };

  const handleToggleActive = async (step: AdminOnboardingStep) => {
    await updateStep.mutateAsync({
      id: step.id,
      is_active: !step.is_active,
    });
  };

  const handleEdit = (step: AdminOnboardingStep) => {
    if (onEditStep) {
      onEditStep(step);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={accentColor} />
        <Text variant="body" style={{ color: mutedColor, marginTop: 12 }}>
          Loading steps...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text variant="h3" style={{ color: textColor }}>
            Onboarding Steps
          </Text>
          <Text variant="body-sm" style={{ color: mutedColor }}>
            Manage the steps in the onboarding process
          </Text>
        </View>
        <View style={styles.headerActions}>
          <Button
            variant="outline"
            size="sm"
            onPress={onPreview}
            disabled={!steps || steps.length === 0}
            icon={<Eye size={16} color={accentColor} />}
          >
            Preview
          </Button>
          {onAddStep && (
            <Button
              variant="primary"
              size="sm"
              onPress={onAddStep}
              icon={<Plus size={16} color="#FFF" />}
            >
              Add Step
            </Button>
          )}
        </View>
      </View>

      <ScrollView style={styles.stepsList} showsVerticalScrollIndicator={false}>
        {steps && steps.length > 0 ? (
          steps.map((step) => (
            <OnboardingStepCard
              key={step.id}
              step={step}
              onToggleRequired={handleToggleRequired}
              onToggleActive={handleToggleActive}
              onEdit={handleEdit}
              disabled={updateStep.isPending}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Settings size={48} color={mutedColor} />
            <Text variant="body" style={{ color: mutedColor, textAlign: 'center', marginTop: 12 }}>
              No onboarding steps yet.{'\n'}Click "Add Step" to get started.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  stepsList: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
  },
});
