import React from 'react';
import { StyleSheet, View, Switch, TouchableOpacity } from 'react-native';
import { Text, Card, CardContent, Surface } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { GripVertical, Edit2, Trash2 } from 'lucide-react-native';
import { AdminOnboardingStep, STEP_TYPE_LABELS } from '../types';

interface OnboardingStepCardProps {
  step: AdminOnboardingStep;
  onToggleRequired: (step: AdminOnboardingStep) => void;
  onToggleActive: (step: AdminOnboardingStep) => void;
  onEdit: (step: AdminOnboardingStep) => void;
  onDelete?: (step: AdminOnboardingStep) => void;
  disabled?: boolean;
}

export function OnboardingStepCard({
  step,
  onToggleRequired,
  onToggleActive,
  onEdit,
  onDelete,
  disabled = false,
}: OnboardingStepCardProps) {
  const { isDark } = useTheme();

  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';
  const borderColor = isDark ? '#404040' : '#E5E5E5';
  const accentColor = isDark ? '#6BBD68' : '#489A45';

  return (
    <Surface elevation={1} style={[styles.container, { borderColor }]}>
      <View style={styles.header}>
        <View style={styles.dragHandle}>
          <GripVertical size={20} color={mutedColor} />
        </View>
        <View style={styles.titleContainer}>
          <Text variant="body-lg" style={{ color: textColor, fontWeight: '600' }}>
            {step.title}
          </Text>
          <Text variant="body-sm" style={{ color: mutedColor }}>
            {STEP_TYPE_LABELS[step.step_type] || step.step_type}
          </Text>
        </View>
      </View>

      {step.description && (
        <Text variant="body-sm" style={[styles.description, { color: mutedColor }]}>
          {step.description}
        </Text>
      )}

      <View style={[styles.controls, { borderTopColor: borderColor }]}>
        <View style={styles.toggleContainer}>
          <Text variant="body-sm" style={{ color: mutedColor }}>Required</Text>
          <Switch
            value={step.is_required}
            onValueChange={() => onToggleRequired(step)}
            disabled={disabled}
            trackColor={{ false: '#767577', true: accentColor }}
          />
        </View>

        <View style={styles.toggleContainer}>
          <Text variant="body-sm" style={{ color: mutedColor }}>Active</Text>
          <Switch
            value={step.is_active}
            onValueChange={() => onToggleActive(step)}
            disabled={disabled}
            trackColor={{ false: '#767577', true: accentColor }}
          />
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => onEdit(step)}
            disabled={disabled}
            style={styles.actionButton}
          >
            <Edit2 size={18} color={accentColor} />
          </TouchableOpacity>

          {onDelete && (
            <TouchableOpacity
              onPress={() => onDelete(step)}
              disabled={disabled}
              style={styles.actionButton}
            >
              <Trash2 size={18} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dragHandle: {
    padding: 4,
  },
  titleContainer: {
    flex: 1,
    gap: 2,
  },
  description: {
    marginTop: 8,
    marginLeft: 36,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
  },
});
