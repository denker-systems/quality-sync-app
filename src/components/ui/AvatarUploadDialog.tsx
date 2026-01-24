/**
 * Avatar Upload Dialog
 * 
 * Dialog for uploading profile picture with camera or gallery
 */

import React, { useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { Modal, Pressable } from 'react-native';
import { MotiView } from 'moti';
import { Text, Button, Card, CardContent } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { Camera, Image as ImageIcon, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { supabase } from '@/config/supabase';
import { decode } from 'base64-arraybuffer';
import { SPRING_CONFIGS, TIMING_CONFIGS } from '@/lib/animations';

interface AvatarUploadDialogProps {
  visible: boolean;
  onClose: () => void;
  onUploadComplete: (avatarUrl: string) => void;
  employeeId?: string;
}

export function AvatarUploadDialog({ 
  visible, 
  onClose, 
  onUploadComplete,
  employeeId,
}: AvatarUploadDialogProps) {
  const { isDark } = useTheme();
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';
  const accentColor = isDark ? '#6BBD68' : '#489A45';
  const surface = isDark ? '#1A1A1A' : '#FFFFFF';

  const pickFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Behörighet krävs', 'Vi behöver tillgång till dina foton.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Fel', 'Kunde inte välja bild');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Behörighet krävs', 'Vi behöver tillgång till kameran.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Fel', 'Kunde inte ta foto');
    }
  };

  const uploadAvatar = async () => {
    if (!selectedImage || !employeeId) return;

    try {
      setUploading(true);

      // Read file as base64
      const base64 = await FileSystem.readAsStringAsync(selectedImage, {
        encoding: 'base64',
      });

      const fileName = `${employeeId}_${Date.now()}.jpg`;
      const filePath = fileName;

      console.log('📤 Uploading avatar to Supabase Storage:', { fileName, employeeId });

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, decode(base64), {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (error) {
        console.error('❌ Upload error:', error);
        Alert.alert('Fel', `Kunde inte ladda upp bilden: ${error.message}`);
        return;
      }

      console.log('✅ Upload successful:', data);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log('✅ Avatar uploaded:', urlData.publicUrl);

      // Update employee with avatar URL
      const { error: updateError } = await (supabase as any)
        .from('employees')
        .update({ avatar_url: urlData.publicUrl })
        .eq('id', employeeId);

      if (updateError) {
        console.error('Error updating employee:', updateError);
      }

      onUploadComplete(urlData.publicUrl);
      setSelectedImage(null);
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Fel', 'Kunde inte ladda upp bilden');
    } finally {
      setUploading(false);
    }
  };

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
          style={[styles.dialog, { backgroundColor: surface }]}
          from={{ opacity: 0, scale: 0.9, translateY: 20 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          exit={{ opacity: 0, scale: 0.95, translateY: 10 }}
          transition={SPRING_CONFIGS.snappy}
        >
          <View style={[styles.dialogHeader, { backgroundColor: accentColor }]}>
            <Text variant="h2" style={{ color: '#FFFFFF' }}>
              Ladda upp profilbild
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.dialogContent}>
            {selectedImage ? (
              <View style={styles.previewContainer}>
                <Image source={{ uri: selectedImage }} style={styles.preview} />
                <TouchableOpacity 
                  onPress={() => setSelectedImage(null)}
                  style={[styles.removeButton, { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }]}
                >
                  <X size={16} color={textColor} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  onPress={takePhoto}
                  style={[styles.option, { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }]}
                  activeOpacity={0.7}
                >
                  <Camera size={32} color={accentColor} />
                  <Text variant="body" style={{ color: textColor, marginTop: 8 }}>
                    Ta foto
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={pickFromGallery}
                  style={[styles.option, { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }]}
                  activeOpacity={0.7}
                >
                  <ImageIcon size={32} color={accentColor} />
                  <Text variant="body" style={{ color: textColor, marginTop: 8 }}>
                    Välj från galleri
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {selectedImage && (
              <Button
                variant="primary"
                onPress={uploadAvatar}
                disabled={uploading}
                style={[styles.uploadButton, { backgroundColor: accentColor }]}
              >
                {uploading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  'Ladda upp'
                )}
              </Button>
            )}
          </View>
        </MotiView>
      </MotiView>
    </Modal>
  );
}

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  closeButton: {
    padding: 4,
  },
  dialogContent: {
    padding: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  option: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  previewContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 16,
  },
  preview: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButton: {
    width: '100%',
    paddingVertical: 14,
  },
});

export default AvatarUploadDialog;
