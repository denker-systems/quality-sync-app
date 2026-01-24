import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, TextInput, Button, Surface, SegmentedButtons } from 'react-native-paper';
import { Phone } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import type { OnboardingStep } from '@/hooks/useOnboarding';
import { getOnboardingStepTitle, getOnboardingStepDescription } from '@/utils/onboardingLanguage';

interface EmergencyContactStepProps {
  content: Record<string, any>;
  step: OnboardingStep;
  stepData: Record<string, any>;
  onComplete: (data: Record<string, any>) => void;
  onSave: (data: Record<string, any>) => void;
  submitRef?: React.MutableRefObject<(() => void) | null>;
}

export const EmergencyContactStep: React.FC<EmergencyContactStepProps> = ({
  content,
  step,
  stepData,
  onComplete,
  onSave,
  submitRef,
}) => {
  const { t, language } = useLanguage();
  console.log('🆘 EMERGENCY_CONTACT_STEP render:', { stepData });
  
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
    contact_name: stepData?.contact_name || '',
    contact_relation: stepData?.contact_relation || 'family',
    contact_phone: stepData?.contact_phone || '',
    contact_email: stepData?.contact_email || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const relationOptions = [
    { value: 'family', label: t('onboarding.emergencyContact.relationFamily') },
    { value: 'friend', label: t('onboarding.emergencyContact.relationFriend') },
    { value: 'other', label: t('onboarding.emergencyContact.relationOther') },
  ];

  const validate = () => {
    console.log('🔍 EMERGENCY_CONTACT_STEP validate:', formData);
    const newErrors: Record<string, string> = {};
    
    if (!formData.contact_name.trim()) {
      newErrors.contact_name = t('onboarding.emergencyContact.errorName');
    }
    if (!formData.contact_phone.trim()) {
      newErrors.contact_phone = t('onboarding.emergencyContact.errorPhone');
    }
    
    if (Object.keys(newErrors).length > 0) {
      console.warn('⚠️ EMERGENCY_CONTACT_STEP validation failed:', newErrors);
    } else {
      console.log('✅ EMERGENCY_CONTACT_STEP validation passed');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    console.log('📤 EMERGENCY_CONTACT_STEP handleSubmit:', formData);
    
    if (validate()) {
      onComplete({ emergency_contact: formData });
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <>
      <Surface style={styles.card} elevation={0}>
        <View style={styles.header}>
          <Phone size={24} color="#0056b3" />
          <Text variant="titleLarge" style={styles.title}>
            {getOnboardingStepTitle(step, language === 'sv' ? 'sv' : 'en') || t('onboarding.emergencyContact.title')}
          </Text>
        </View>
        
        <Text variant="bodyMedium" style={styles.description}>
          {getOnboardingStepDescription(step, language === 'sv' ? 'sv' : 'en') || content?.description || t('onboarding.emergencyContact.description')}
        </Text>

        <View style={styles.infoBox}>
          <Text variant="bodySmall" style={styles.infoText}>
            {t('onboarding.emergencyContact.securityInfo')}
          </Text>
        </View>

        <TextInput
          label={`${t('onboarding.emergencyContact.contactName')} ${t('onboarding.emergencyContact.required')}`}
          value={formData.contact_name}
          onChangeText={(text) => updateField('contact_name', text)}
          mode="outlined"
          error={!!errors.contact_name}
          style={styles.input}
        />
        {errors.contact_name && (
          <Text style={styles.errorText}>{errors.contact_name}</Text>
        )}

        <Text variant="labelLarge" style={styles.label}>{t('onboarding.emergencyContact.relation')}</Text>
        <SegmentedButtons
          value={formData.contact_relation}
          onValueChange={(value) => updateField('contact_relation', value)}
          buttons={relationOptions}
          style={styles.segmented}
        />

        <TextInput
          label={`${t('onboarding.emergencyContact.phone')} ${t('onboarding.emergencyContact.required')}`}
          value={formData.contact_phone}
          onChangeText={(text) => updateField('contact_phone', text)}
          mode="outlined"
          keyboardType="phone-pad"
          error={!!errors.contact_phone}
          style={styles.input}
        />
        {errors.contact_phone && (
          <Text style={styles.errorText}>{errors.contact_phone}</Text>
        )}

        <TextInput
          label={t('onboarding.emergencyContact.email')}
          value={formData.contact_email}
          onChangeText={(text) => updateField('contact_email', text)}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
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
  infoBox: {
    backgroundColor: '#eff6ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    color: '#1e40af',
  },
  label: {
    marginBottom: 8,
    color: '#374151',
  },
  segmented: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 4,
  },
});
