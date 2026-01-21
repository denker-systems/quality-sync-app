import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ScreenLayout } from '@/components/common';
import { RoleGuard } from '@/components/common/RoleGuard';
import { Text, Surface } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { Settings } from 'lucide-react-native';
import { OnboardingStepsEditor } from '../components/OnboardingStepsEditor';

/**
 * OnboardingAdminScreen - Admin interface for managing onboarding steps
 * Only accessible to admin and superadmin roles
 */
export function OnboardingAdminScreen() {
  const navigation = useNavigation<any>();
  const { isDark } = useTheme();

  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';

  const handlePreview = () => {
    navigation.navigate('OnboardingPreview');
  };

  const handleAddStep = () => {
    // TODO: Implement add step modal/screen
    console.log('Add step pressed');
  };

  const handleEditStep = (step: any) => {
    // TODO: Implement edit step modal/screen
    console.log('Edit step pressed:', step.id);
  };

  return (
    <RoleGuard allow={['superadmin', 'admin']}>
      <ScreenLayout title="Onboarding Management">
        <Surface elevation={1} style={styles.header}>
          <View style={styles.headerContent}>
            <Settings size={24} color={mutedColor} />
            <View style={styles.headerText}>
              <Text variant="h3" style={{ color: textColor }}>
                Onboarding Configuration
              </Text>
              <Text variant="body-sm" style={{ color: mutedColor }}>
                Configure the onboarding process for new employees
              </Text>
            </View>
          </View>
        </Surface>

        <View style={styles.content}>
          <OnboardingStepsEditor
            onPreview={handlePreview}
            onAddStep={handleAddStep}
            onEditStep={handleEditStep}
          />
        </View>
      </ScreenLayout>
    </RoleGuard>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  content: {
    flex: 1,
  },
});
