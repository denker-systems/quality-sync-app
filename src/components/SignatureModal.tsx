import React, { useState } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button } from 'react-native-paper';
import { X } from 'lucide-react-native';
import { SignatureCanvas } from './SignatureCanvas';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface SignatureModalProps {
  visible: boolean;
  onComplete: (signatureData: string) => void;
  onClose: () => void;
  title?: string;
  description?: string;
}

/**
 * Fullscreen modal for signature capture
 * Provides isolated environment without scroll conflicts
 */
export const SignatureModal: React.FC<SignatureModalProps> = ({
  visible,
  onComplete,
  onClose,
  title,
  description,
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const modalTitle = title || t('signature.modalTitle');
  const modalDescription = description || t('signature.modalDescription');

  const bgColor = isDark ? '#1A1A1A' : '#ffffff';
  const headerBg = isDark ? '#262626' : '#f9fafb';
  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#6b7280';
  const borderColor = isDark ? '#333' : '#e5e7eb';

  const handleSignatureComplete = async (signatureData: string) => {
    console.log('✅ SignatureModal: Signature captured');
    setIsProcessing(true);
    
    try {
      await onComplete(signatureData);
      console.log('✅ SignatureModal: Signature saved successfully');
    } catch (error) {
      console.error('❌ SignatureModal: Failed to save signature:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    console.log('❌ SignatureModal: User cancelled');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleCancel}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: headerBg, borderBottomColor: borderColor }]}>
          <TouchableOpacity 
            onPress={handleCancel} 
            style={styles.closeButton}
            disabled={isProcessing}
          >
            <X size={24} color={textColor} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text variant="titleLarge" style={[styles.title, { color: textColor }]}>
              {modalTitle}
            </Text>
            <Text variant="bodyMedium" style={[styles.description, { color: mutedColor }]}>
              {modalDescription}
            </Text>
          </View>
        </View>

        {/* Signature Canvas */}
        <View style={styles.canvasContainer}>
          <SignatureCanvas
            onComplete={handleSignatureComplete}
            onCancel={handleCancel}
          />
        </View>

        {/* Footer Info */}
        <View style={[styles.footer, { backgroundColor: headerBg, borderTopColor: borderColor }]}>
          <Text variant="bodySmall" style={[styles.footerText, { color: mutedColor }]}>
            Din signatur kommer att sparas säkert och användas för att bekräfta ditt godkännande.
          </Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  closeButton: {
    alignSelf: 'flex-start',
    padding: 8,
    marginBottom: 8,
  },
  headerContent: {
    gap: 4,
  },
  title: {
    fontWeight: '600',
  },
  description: {
  },
  canvasContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  footerText: {
    textAlign: 'center',
  },
});
