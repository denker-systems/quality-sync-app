import React, { useState } from 'react';
import { StyleSheet, View, Modal, SafeAreaView, TouchableOpacity } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { X } from 'lucide-react-native';
import { SignatureCanvas } from './SignatureCanvas';

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
  title = 'Signera Dokument',
  description = 'Rita din signatur nedan för att godkänna dokumentet',
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

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
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={handleCancel} 
            style={styles.closeButton}
            disabled={isProcessing}
          >
            <X size={24} color="#171717" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text variant="headlineMedium" style={styles.title}>
              {title}
            </Text>
            <Text variant="bodyMedium" style={styles.description}>
              {description}
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
        <View style={styles.footer}>
          <Text variant="bodySmall" style={styles.footerText}>
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
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
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
    color: '#171717',
    fontWeight: '600',
  },
  description: {
    color: '#6b7280',
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
    borderTopColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  footerText: {
    color: '#6b7280',
    textAlign: 'center',
  },
});
