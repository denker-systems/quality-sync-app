import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TextInput, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Text, Button, Surface } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { User, Upload, FileText, X } from 'lucide-react-native';
import type { OnboardingStep } from '@/hooks/useOnboarding';
import { getOnboardingStepTitle, getOnboardingStepDescription } from '@/utils/onboardingLanguage';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/config/supabase';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';
import { useUpdateMyEmployee } from '@/hooks/useMyEmployee';

interface PersonalInfoStepProps {
  content: Record<string, any>;
  step: OnboardingStep;
  stepData: Record<string, any>;
  onComplete: (data: Record<string, any>) => void;
  onSave: (data: Record<string, any>) => void;
  submitRef?: React.MutableRefObject<(() => void) | null>;
  employee?: any;
}

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  content,
  step,
  stepData,
  onComplete,
  onSave,
  submitRef,
  employee,
}) => {
  const { isDark } = useTheme();
  const { t, language } = useLanguage();
  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';
  const accentColor = isDark ? '#6BBD68' : '#489A45';
  const inputBg = isDark ? '#1A1A1A' : '#FFFFFF';
  const borderColor = isDark ? '#333' : '#E5E5E5';
  
  const updateEmployee = useUpdateMyEmployee();

  useEffect(() => {
    if (submitRef) {
      submitRef.current = handleSubmit;
    }
    return () => {
      if (submitRef) {
        submitRef.current = null;
      }
    };
  }, [submitRef]);

  const [formData, setFormData] = useState({
    first_name: stepData?.first_name || employee?.first_name || '',
    last_name: stepData?.last_name || employee?.last_name || '',
    personal_number: stepData?.personal_number || employee?.personal_identity_number || employee?.personal_number || '',
    address: stepData?.address || employee?.address1 || '',
    postal_code: stepData?.postal_code || employee?.post_code || '',
    city: stepData?.city || employee?.city || '',
    phone: stepData?.phone || employee?.mobile_phone || employee?.phone || employee?.phone1 || '',
    email: stepData?.email || employee?.email || '',
    id_document_url: stepData?.id_document_url || null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ uri: string; name: string; type: string } | null>(null);

  // Update formData when employee data loads
  useEffect(() => {
    if (employee && !stepData) {
      console.log('📋 PERSONAL_INFO_STEP: Pre-filling from employee data', {
        address1: employee.address1,
        post_code: employee.post_code,
        city: employee.city,
      });
      setFormData(prev => ({
        ...prev,
        first_name: prev.first_name || employee.first_name || '',
        last_name: prev.last_name || employee.last_name || '',
        personal_number: prev.personal_number || employee.personal_identity_number || employee.personal_number || '',
        address: prev.address || employee.address1 || '',
        postal_code: prev.postal_code || employee.post_code || '',
        city: prev.city || employee.city || '',
        phone: prev.phone || employee.mobile_phone || employee.phone || employee.phone1 || '',
        email: prev.email || employee.email || '',
      }));
    }
  }, [employee, stepData]);

  const validate = () => {
    console.log('🔍 PERSONAL_INFO_STEP validate:', formData);
    const newErrors: Record<string, string> = {};
    if (!formData.first_name.trim()) {
      newErrors.first_name = t('onboarding.personalInfo.errorFirstName');
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = t('onboarding.personalInfo.errorLastName');
    }
    if (!formData.personal_number.trim()) {
      newErrors.personal_number = t('onboarding.personalInfo.errorPersonalNumber');
    } else if (!/^\d{6,8}-?\d{4}$/.test(formData.personal_number)) {
      newErrors.personal_number = t('onboarding.personalInfo.errorInvalidPersonalNumber');
    }
    if (!formData.address.trim()) {
      newErrors.address = t('onboarding.personalInfo.errorAddress');
    }
    if (!formData.postal_code.trim()) {
      newErrors.postal_code = t('onboarding.personalInfo.errorPostalCode');
    }
    if (!formData.city.trim()) {
      newErrors.city = t('onboarding.personalInfo.errorCity');
    }
    
    if (Object.keys(newErrors).length > 0) {
      console.warn('⚠️ PERSONAL_INFO_STEP validation failed:', newErrors);
    } else {
      console.log('✅ PERSONAL_INFO_STEP validation passed');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      // Update employee data in Supabase first
      if (employee?.id) {
        console.log('📝 PERSONAL_INFO_STEP: Updating employee in Supabase before completing step');
        await updateEmployee.mutateAsync({
          employeeId: employee.id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          personal_identity_number: formData.personal_number,
          address1: formData.address,
          post_code: formData.postal_code,
          city: formData.city,
          mobile_phone: formData.phone,
          email: formData.email,
        });
        console.log('✅ PERSONAL_INFO_STEP: Employee updated in Supabase');
      }

      // Then complete the step (saves to onboarding_progress)
      onComplete(formData);
    } catch (error) {
      console.error('❌ PERSONAL_INFO_STEP: Failed to update employee:', error);
      Alert.alert(t('onboarding.personalInfo.errorTitle'), t('onboarding.personalInfo.errorSave'));
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const file = result.assets[0];
        
        // Validate file size (max 5MB)
        if (file.size && file.size > 5 * 1024 * 1024) {
          Alert.alert(t('onboarding.personalInfo.errorTitle'), t('onboarding.personalInfo.errorFileSize'));
          return;
        }

        await uploadFile(file);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert(t('onboarding.personalInfo.errorTitle'), t('onboarding.personalInfo.errorPickDocument'));
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('onboarding.personalInfo.permissionRequired'), t('onboarding.personalInfo.permissionMessage'));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        await uploadFile({
          uri: asset.uri,
          name: `id_document_${Date.now()}.jpg`,
          mimeType: 'image/jpeg',
          size: asset.fileSize,
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(t('onboarding.personalInfo.errorTitle'), t('onboarding.personalInfo.errorPickImage'));
    }
  };

  const uploadFile = async (file: any) => {
    try {
      setUploading(true);
      console.log('📤 Uploading file:', file.name);

      // Read file as base64
      const base64 = await FileSystem.readAsStringAsync(file.uri, {
        encoding: 'base64',
      });

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `employee-documents/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('employee-documents')
        .upload(filePath, decode(base64), {
          contentType: file.mimeType || 'application/octet-stream',
          upsert: false,
        });

      if (error) {
        console.error('Upload error:', error);
        Alert.alert(t('onboarding.personalInfo.errorTitle'), t('onboarding.personalInfo.errorUpload'));
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('employee-documents')
        .getPublicUrl(filePath);

      console.log('✅ File uploaded:', urlData.publicUrl);

      setUploadedFile({
        uri: file.uri,
        name: file.name,
        type: file.mimeType || 'application/octet-stream',
      });

      setFormData(prev => ({ ...prev, id_document_url: urlData.publicUrl }));
      Alert.alert(t('onboarding.personalInfo.uploadSuccess'), t('onboarding.personalInfo.uploadSuccessMessage'));
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Fel', 'Kunde inte ladda upp filen');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setFormData(prev => ({ ...prev, id_document_url: null }));
  };

  const updateField = (field: string, value: string) => {
    console.log('📝 PERSONAL_INFO_STEP updateField:', { field, value });
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      console.log('📝 Updated formData:', updated);
      return updated;
    });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const inputStyle = [
    styles.input,
    { backgroundColor: inputBg, borderColor, color: textColor }
  ];

  return (
    <>
      <Surface style={styles.card} elevation={0}>
        <View style={styles.header}>
          <User size={24} color={accentColor} />
          <Text variant="h3" style={{ color: textColor }}>
            {getOnboardingStepTitle(step, language === 'sv' ? 'sv' : 'en') || t('onboarding.personalInfo.title')}
          </Text>
        </View>
        
        <Text variant="body" style={[styles.description, { color: mutedColor }]}>
          {getOnboardingStepDescription(step, language === 'sv' ? 'sv' : 'en') || content?.description || t('onboarding.personalInfo.description')}
        </Text>

        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text variant="body-sm" style={[styles.label, { color: textColor }]}>{t('onboarding.personalInfo.firstName')} {t('onboarding.personalInfo.required')}</Text>
            <TextInput
              value={formData.first_name}
              onChangeText={(text) => updateField('first_name', text)}
              style={[inputStyle, errors.first_name && styles.inputError]}
              placeholderTextColor={mutedColor}
            />
            {errors.first_name && (
              <Text variant="body-sm" style={styles.errorText}>{errors.first_name}</Text>
            )}
          </View>
          <View style={styles.halfField}>
            <Text variant="body-sm" style={[styles.label, { color: textColor }]}>{t('onboarding.personalInfo.lastName')} {t('onboarding.personalInfo.required')}</Text>
            <TextInput
              value={formData.last_name}
              onChangeText={(text) => updateField('last_name', text)}
              style={[inputStyle, errors.last_name && styles.inputError]}
              placeholderTextColor={mutedColor}
            />
            {errors.last_name && (
              <Text variant="body-sm" style={styles.errorText}>{errors.last_name}</Text>
            )}
          </View>
        </View>

        <Text variant="body-sm" style={[styles.label, { color: textColor }]}>{t('onboarding.personalInfo.personalNumber')} {t('onboarding.personalInfo.required')}</Text>
        <TextInput
          value={formData.personal_number}
          onChangeText={(text) => updateField('personal_number', text)}
          placeholder={t('onboarding.personalInfo.personalNumberPlaceholder')}
          style={[inputStyle, errors.personal_number && styles.inputError]}
          placeholderTextColor={mutedColor}
        />
        {errors.personal_number && (
          <Text variant="body-sm" style={styles.errorText}>{errors.personal_number}</Text>
        )}

        <Text variant="body-sm" style={[styles.label, { color: textColor }]}>{t('onboarding.personalInfo.address')} {t('onboarding.personalInfo.required')}</Text>
        <TextInput
          value={formData.address}
          onChangeText={(text) => updateField('address', text)}
          style={[inputStyle, errors.address && styles.inputError]}
          placeholderTextColor={mutedColor}
        />
        {errors.address && (
          <Text variant="body-sm" style={styles.errorText}>{errors.address}</Text>
        )}

        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text variant="body-sm" style={[styles.label, { color: textColor }]}>{t('onboarding.personalInfo.postalCode')} {t('onboarding.personalInfo.required')}</Text>
            <TextInput
              value={formData.postal_code}
              onChangeText={(text) => updateField('postal_code', text)}
              keyboardType="numeric"
              style={[inputStyle, errors.postal_code && styles.inputError]}
              placeholderTextColor={mutedColor}
            />
            {errors.postal_code && (
              <Text variant="body-sm" style={styles.errorText}>{errors.postal_code}</Text>
            )}
          </View>
          <View style={styles.halfField}>
            <Text variant="body-sm" style={[styles.label, { color: textColor }]}>{t('onboarding.personalInfo.city')} {t('onboarding.personalInfo.required')}</Text>
            <TextInput
              value={formData.city}
              onChangeText={(text) => updateField('city', text)}
              style={[inputStyle, errors.city && styles.inputError]}
              placeholderTextColor={mutedColor}
            />
            {errors.city && (
              <Text variant="body-sm" style={styles.errorText}>{errors.city}</Text>
            )}
          </View>
        </View>

        <Text variant="body-sm" style={[styles.label, { color: textColor }]}>{t('onboarding.personalInfo.phone')}</Text>
        <TextInput
          value={formData.phone}
          onChangeText={(text) => updateField('phone', text)}
          keyboardType="phone-pad"
          style={inputStyle}
          placeholderTextColor={mutedColor}
        />

        <Text variant="body-sm" style={[styles.label, { color: textColor }]}>{t('onboarding.personalInfo.email')}</Text>
        <TextInput
          value={formData.email}
          onChangeText={(text) => updateField('email', text)}
          keyboardType="email-address"
          autoCapitalize="none"
          style={inputStyle}
          placeholderTextColor={mutedColor}
        />

        {/* ID Document Upload */}
        <View style={styles.uploadSection}>
          <Text variant="body-sm" style={[styles.label, { color: textColor }]}>{t('onboarding.personalInfo.idDocument')}</Text>
          <Text variant="body-sm" style={{ color: mutedColor, marginBottom: 12 }}>
            {t('onboarding.personalInfo.idDocumentDesc')}
          </Text>

          {!uploadedFile && !formData.id_document_url && (
            <View style={styles.uploadButtons}>
              <Button
                variant="outline"
                onPress={pickImage}
                disabled={uploading}
                style={styles.uploadButton}
              >
                <Upload size={16} color={accentColor} />
                <Text variant="body-sm" style={{ color: accentColor, marginLeft: 8 }}>
                  {t('onboarding.personalInfo.chooseImage')}
                </Text>
              </Button>
              <Button
                variant="outline"
                onPress={pickDocument}
                disabled={uploading}
                style={styles.uploadButton}
              >
                <FileText size={16} color={accentColor} />
                <Text variant="body-sm" style={{ color: accentColor, marginLeft: 8 }}>
                  {t('onboarding.personalInfo.chooseDocument')}
                </Text>
              </Button>
            </View>
          )}

          {uploading && (
            <View style={[styles.uploadPreview, { backgroundColor: isDark ? '#1A1A1A' : '#f3f4f6' }]}>
              <ActivityIndicator size="small" color={accentColor} />
              <Text variant="body-sm" style={{ color: mutedColor, marginLeft: 12 }}>
                {t('onboarding.personalInfo.uploading')}
              </Text>
            </View>
          )}

          {(uploadedFile || formData.id_document_url) && !uploading && (
            <View style={[styles.uploadPreview, { backgroundColor: isDark ? '#1A1A1A' : '#f3f4f6' }]}>
              {uploadedFile?.type?.startsWith('image/') && uploadedFile.uri && (
                <Image source={{ uri: uploadedFile.uri }} style={styles.previewImage} />
              )}
              {(!uploadedFile?.type?.startsWith('image/') || !uploadedFile.uri) && (
                <FileText size={32} color={accentColor} />
              )}
              <View style={styles.fileInfo}>
                <Text variant="body-sm" style={{ color: textColor, fontWeight: '600' }}>
                  {uploadedFile?.name || t('onboarding.personalInfo.idDocumentUploaded')}
                </Text>
                <Text variant="body-sm" style={{ color: mutedColor }}>
                  {t('onboarding.personalInfo.uploaded')}
                </Text>
              </View>
              <TouchableOpacity onPress={removeFile} style={styles.removeButton}>
                <X size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Surface>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontWeight: '600',
  },
  description: {
    color: '#6b7280',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  label: {
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 4,
  },
  uploadSection: {
    marginTop: 16,
  },
  uploadButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  fileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  removeButton: {
    padding: 8,
  },
});
