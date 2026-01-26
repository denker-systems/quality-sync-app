import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ScreenLayout } from '@/components/common';
import { RoleGuard } from '@/components/common/RoleGuard';
import { Text, Card, CardContent, Button, Badge, Surface, ProgressBar } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import {
  Eye,
  RotateCcw,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
} from 'lucide-react-native';
import { useOnboardingSteps } from '../hooks/useOnboardingSteps';
import { useCompanyData } from '@/hooks/useCompanyData';
import { MockEmployee, PreviewProgress, STEP_TYPE_LABELS } from '../types';

/**
 * Create mock employee for preview
 */
function createMockEmployee(companyId: string): MockEmployee {
  return {
    id: 'preview-employee-001',
    first_name: 'Test',
    last_name: 'Employee',
    email: 'test.employee@example.com',
    company_id: companyId,
  };
}

/**
 * OnboardingPreviewScreen - Full-screen preview of onboarding process
 * Uses mock employee data and local state (nothing saved to database)
 */
export function OnboardingPreviewScreen() {
  const navigation = useNavigation<any>();
  const { isDark } = useTheme();
  const { company } = useCompanyData();
  const { data: steps, isLoading } = useOnboardingSteps();

  const [previewProgress, setPreviewProgress] = useState<PreviewProgress[]>([]);
  const [resetKey, setResetKey] = useState(0);

  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';
  const accentColor = isDark ? '#6BBD68' : '#489A45';
  const warningBg = isDark ? '#78350F' : '#FEF3C7';
  const warningText = isDark ? '#FDE68A' : '#92400E';
  const stepItemBg = isDark ? '#262626' : '#f9fafb';

  const mockEmployee = company ? createMockEmployee(company.id) : null;

  // Initialize preview progress when steps are loaded
  useEffect(() => {
    if (steps && steps.length > 0) {
      const initialProgress: PreviewProgress[] = steps
        .filter((s) => s.is_active)
        .map((step) => ({
          stepId: step.id,
          status: 'pending',
          stepData: {},
        }));
      setPreviewProgress(initialProgress);
    }
  }, [steps, resetKey]);

  const activeSteps = steps?.filter((s) => s.is_active) || [];

  const completedSteps = previewProgress.filter((p) => p.status === 'completed').length;
  const totalSteps = activeSteps.length;
  const progressPercentage = totalSteps > 0 ? completedSteps / totalSteps : 0;

  const handleReset = () => {
    setResetKey((prev) => prev + 1);
  };

  const handleClose = () => {
    navigation.goBack();
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

  const handleStepPress = (index: number) => {
    // Construct preview data package to pass to the screen
    // This avoids the screen trying to fetch real data for the admin user
    const previewData = {
      onboarding: {
        id: 'preview-onboarding-id',
        employee_id: mockEmployee?.id || 'preview-employee-id',
        status: 'in_progress' as const,
        onboarding_data: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      steps: activeSteps,
      progress: previewProgress,
    };

    // Navigate to OnboardingStepScreen with preview data
    navigation.navigate('OnboardingStep', {
      stepIndex: index,
      previewData,
    });
  };

  if (isLoading) {
    return (
      <RoleGuard allow={['superadmin', 'admin', 'manager']}>
        <ScreenLayout title="Preview" scrollable={false}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={accentColor} />
            <Text variant="body" style={{ color: mutedColor, marginTop: 16 }}>
              Loading preview...
            </Text>
          </View>
        </ScreenLayout>
      </RoleGuard>
    );
  }

  if (!activeSteps.length) {
    return (
      <RoleGuard allow={['superadmin', 'admin', 'manager']}>
        <ScreenLayout title="Preview">
          <View style={styles.emptyContainer}>
            <Eye size={48} color={mutedColor} />
            <Text variant="h3" style={{ color: textColor, marginTop: 16 }}>
              No Active Steps
            </Text>
            <Text variant="body" style={{ color: mutedColor, textAlign: 'center', marginTop: 8 }}>
              There are no active onboarding steps to preview.
            </Text>
            <Button variant="outline" onPress={handleClose}>
              Go Back
            </Button>
          </View>
        </ScreenLayout>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allow={['superadmin', 'admin', 'manager']}>
      <ScreenLayout title="Preview" scrollable={false} noPadding>
        {/* Preview Mode Banner */}
        <Surface elevation={2} style={[styles.previewBanner, { backgroundColor: warningBg }]}>
          <View style={styles.bannerContent}>
            <Eye size={20} color={warningText} />
            <Text variant="body" style={{ color: warningText, flex: 1, fontWeight: '600' }}>
              PREVIEW MODE - Changes are not saved
            </Text>
            <TouchableOpacity onPress={handleReset} style={styles.bannerButton}>
              <RotateCcw size={18} color={warningText} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleClose} style={styles.bannerButton}>
              <X size={18} color={warningText} />
            </TouchableOpacity>
          </View>
        </Surface>

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          {/* Progress Header */}
          <Surface elevation={1} style={styles.progressHeader}>
            <View style={styles.progressHeaderContent}>
              <Text variant="h3" style={{ color: textColor }}>
                Onboarding Preview
              </Text>
              <Badge variant={completedSteps === totalSteps ? 'success' : 'default'}>
                {`${completedSteps}/${totalSteps} completed`}
              </Badge>
            </View>
            <ProgressBar progress={progressPercentage} style={styles.progressBar} />
          </Surface>

          {/* Steps List */}
          <Card variant="elevated" style={styles.stepsCard}>
            <CardContent>
              <Text variant="h4" style={[styles.sectionTitle, { color: textColor }]}>
                All Steps
              </Text>
              {activeSteps.map((step, index) => {
                const stepProgress = previewProgress[index];

                return (
                  <TouchableOpacity
                    key={step.id}
                    onPress={() => handleStepPress(index)}
                    activeOpacity={0.7}
                  >
                    <Surface
                      elevation={0}
                      style={[
                        styles.stepItem,
                        { backgroundColor: stepItemBg },
                        stepProgress?.status === 'completed' && styles.stepItemCompleted,
                      ]}
                    >
                      <View style={styles.stepHeader}>
                        {getStatusIcon(stepProgress?.status || 'pending')}
                        <View style={styles.stepInfo}>
                          <Text variant="body-lg" style={[styles.stepTitle, { color: textColor }]}>
                            {step.title || `Step ${index + 1}`}
                          </Text>
                          <Text variant="body-sm" style={{ color: mutedColor }}>
                            {STEP_TYPE_LABELS[step.step_type] || step.step_type}
                          </Text>
                        </View>
                        <ChevronRight size={20} color={mutedColor} />
                      </View>
                    </Surface>
                  </TouchableOpacity>
                );
              })}
            </CardContent>
          </Card>
        </ScrollView>
      </ScreenLayout>
    </RoleGuard>
  );
}

const styles = StyleSheet.create({
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
    gap: 12,
  },
  previewBanner: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    marginHorizontal: 16,
    marginTop: 8,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bannerButton: {
    padding: 8,
    borderRadius: 8,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  progressHeader: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  progressHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  stepsCard: {
    marginBottom: 12,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  stepItem: {
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  stepItemCompleted: {
    opacity: 0.8,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepInfo: {
    flex: 1,
    gap: 2,
  },
  stepTitle: {
    fontWeight: '500',
  },
});
