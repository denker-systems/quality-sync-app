import React, { memo, useMemo } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { MotiView } from 'moti';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { SPRING_CONFIGS, TIMING_CONFIGS } from '@/lib/animations';

interface OnboardingStepDialogProps {
  visible: boolean;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  onClose: () => void;
}

export const OnboardingStepDialog = memo(function OnboardingStepDialog({
  visible,
  title,
  description,
  actionLabel,
  onAction,
  onClose,
}: OnboardingStepDialogProps) {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const theme = useMemo(
    () => ({
      textColor: isDark ? '#FAFAFA' : '#171717',
      mutedColor: isDark ? '#A3A3A3' : '#737373',
      surface: isDark ? '#1A1A1A' : '#FFFFFF',
      accentColor: isDark ? '#6BBD68' : '#489A45',
      titleColor: isDark ? '#0F0F0F' : '#FFFFFF',
    }),
    [isDark],
  );

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <MotiView
        style={styles.overlay}
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={TIMING_CONFIGS.fast}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />
        <MotiView
          style={[styles.dialog, { backgroundColor: theme.surface }]}
          from={{ opacity: 0, scale: 0.9, translateY: 20 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          exit={{ opacity: 0, scale: 0.95, translateY: 10 }}
          transition={SPRING_CONFIGS.snappy}
          pointerEvents="auto"
        >
          <View style={[styles.dialogHeader, { backgroundColor: theme.accentColor }]}>
            <Text variant="h2" style={[styles.title, { color: theme.titleColor }]}>
              {title}
            </Text>
          </View>
          <View style={styles.dialogContent}>
            {description ? (
              <Text variant="body" style={[styles.description, { color: theme.mutedColor }]}>
                {description}
              </Text>
            ) : null}
            <Button
              variant="primary"
              onPress={() => {
                onAction?.();
                onClose();
              }}
              style={[styles.actionButton, { backgroundColor: theme.accentColor }]}
            >
              {actionLabel || t('onboarding.openButton')}
            </Button>
          </View>
        </MotiView>
      </MotiView>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  dialog: {
    width: '85%',
    maxWidth: 400,
    borderRadius: 20,
    overflow: 'hidden',
  },
  dialogHeader: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
  },
  dialogContent: {
    padding: 20,
    gap: 16,
  },
  description: {
    lineHeight: 22,
    textAlign: 'center',
  },
  actionButton: {
    width: '100%',
    paddingVertical: 14,
  },
});

export default OnboardingStepDialog;
