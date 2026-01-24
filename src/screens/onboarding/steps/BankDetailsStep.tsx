import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, TextInput, Button, Surface, SegmentedButtons } from 'react-native-paper';
import { Building2 } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import type { OnboardingStep } from '@/hooks/useOnboarding';
import { getOnboardingStepTitle, getOnboardingStepDescription } from '@/utils/onboardingLanguage';

interface BankDetailsStepProps {
  content: Record<string, any>;
  step: OnboardingStep;
  stepData: Record<string, any>;
  onComplete: (data: Record<string, any>) => void;
  onSave: (data: Record<string, any>) => void;
  submitRef?: React.MutableRefObject<(() => void) | null>;
}

export const BankDetailsStep: React.FC<BankDetailsStepProps> = ({
  content,
  step,
  stepData,
  onComplete,
  onSave,
  submitRef,
}) => {
  const { t, language } = useLanguage();
  console.log('🏦 BANK_DETAILS_STEP render:', { stepData });
  
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
    bank_name: stepData?.bank_name || '',
    clearing_number: stepData?.clearing_number || '',
    account_number: stepData?.account_number || '',
    account_type: stepData?.account_type || 'bank',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const accountTypeOptions = [
    { value: 'bank', label: t('onboarding.bankDetails.bankAccount') },
    { value: 'bankgiro', label: t('onboarding.bankDetails.bankgiro') },
    { value: 'plusgiro', label: t('onboarding.bankDetails.plusgiro') },
  ];

  const validate = () => {
    console.log('🔍 BANK_DETAILS_STEP validate:', formData);
    const newErrors: Record<string, string> = {};
    
    if (formData.account_type === 'bank') {
      if (!formData.bank_name.trim()) {
        newErrors.bank_name = t('onboarding.bankDetails.errorBankName');
      }
      if (!formData.clearing_number.trim()) {
        newErrors.clearing_number = t('onboarding.bankDetails.errorClearingNumber');
      } else if (!/^\d{4,5}$/.test(formData.clearing_number)) {
        newErrors.clearing_number = t('onboarding.bankDetails.errorInvalidClearingNumber');
      }
    }
    
    if (!formData.account_number.trim()) {
      newErrors.account_number = t('onboarding.bankDetails.errorAccountNumber');
    }
    
    if (Object.keys(newErrors).length > 0) {
      console.warn('⚠️ BANK_DETAILS_STEP validation failed:', newErrors);
    } else {
      console.log('✅ BANK_DETAILS_STEP validation passed');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    console.log('📤 BANK_DETAILS_STEP handleSubmit:', formData);
    
    if (validate()) {
      onComplete({ bank_details: formData });
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
          <Building2 size={24} color="#0056b3" />
          <Text variant="titleLarge" style={styles.title}>
            {getOnboardingStepTitle(step, language === 'sv' ? 'sv' : 'en') || t('onboarding.bankDetails.title')}
          </Text>
        </View>
        
        <Text variant="bodyMedium" style={styles.description}>
          {getOnboardingStepDescription(step, language === 'sv' ? 'sv' : 'en') || content?.description || t('onboarding.bankDetails.description')}
        </Text>

        <View style={styles.infoBox}>
          <Text variant="bodySmall" style={styles.infoText}>
            {t('onboarding.bankDetails.securityInfo')}
          </Text>
        </View>

        <Text variant="labelLarge" style={styles.label}>{t('onboarding.bankDetails.accountType')}</Text>
        <SegmentedButtons
          value={formData.account_type}
          onValueChange={(value) => updateField('account_type', value)}
          buttons={accountTypeOptions}
          style={styles.segmented}
        />

        {formData.account_type === 'bank' && (
          <>
            <TextInput
              label={`${t('onboarding.bankDetails.bankName')} ${t('onboarding.bankDetails.required')}`}
              value={formData.bank_name}
              onChangeText={(text) => updateField('bank_name', text)}
              mode="outlined"
              placeholder={t('onboarding.bankDetails.bankNamePlaceholder')}
              error={!!errors.bank_name}
              style={styles.input}
            />
            {errors.bank_name && (
              <Text style={styles.errorText}>{errors.bank_name}</Text>
            )}

            <TextInput
              label={`${t('onboarding.bankDetails.clearingNumber')} ${t('onboarding.bankDetails.required')}`}
              value={formData.clearing_number}
              onChangeText={(text) => updateField('clearing_number', text)}
              mode="outlined"
              keyboardType="numeric"
              placeholder={t('onboarding.bankDetails.clearingNumberPlaceholder')}
              error={!!errors.clearing_number}
              style={styles.input}
            />
            {errors.clearing_number && (
              <Text style={styles.errorText}>{errors.clearing_number}</Text>
            )}
          </>
        )}

        <TextInput
          label={formData.account_type === 'bank' ? `${t('onboarding.bankDetails.accountNumber')} ${t('onboarding.bankDetails.required')}` : 
                 formData.account_type === 'bankgiro' ? `${t('onboarding.bankDetails.bankgiroNumber')} ${t('onboarding.bankDetails.required')}` : `${t('onboarding.bankDetails.plusgiroNumber')} ${t('onboarding.bankDetails.required')}`}
          value={formData.account_number}
          onChangeText={(text) => updateField('account_number', text)}
          mode="outlined"
          keyboardType="numeric"
          error={!!errors.account_number}
          style={styles.input}
        />
        {errors.account_number && (
          <Text style={styles.errorText}>{errors.account_number}</Text>
        )}
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
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    color: '#92400e',
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
