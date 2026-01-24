import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Dimensions, Alert } from 'react-native';
import { Text, Button, Surface, Checkbox, ActivityIndicator } from 'react-native-paper';
import { FileText, PenTool, Check } from 'lucide-react-native';
import { SignatureModal } from '@/components/SignatureModal';
import { useContractTemplate } from '@/hooks/useContracts';
import { useCompanyData } from '@/hooks/useCompanyData';
import { useMyEmployee } from '@/hooks/useMyEmployee';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import type { OnboardingStep } from '@/hooks/useOnboarding';
import { getOnboardingStepTitle, getOnboardingStepDescription } from '@/utils/onboardingLanguage';

interface ContractSigningStepProps {
  content: Record<string, any>;
  step: OnboardingStep;
  stepData: Record<string, any>;
  onComplete: (data: Record<string, any>) => void;
  onSave: (data: Record<string, any>) => void;
  submitRef?: React.MutableRefObject<(() => void) | null>;
}

export const ContractSigningStep: React.FC<ContractSigningStepProps> = ({
  content,
  step,
  stepData,
  onComplete,
  onSave,
  submitRef,
}) => {
  const { isDark } = useTheme();
  const { t, language } = useLanguage();
  console.log('📝 CONTRACT_SIGNING_STEP render:', { stepData, hasRead: stepData?.has_read });
  
  const { company } = useCompanyData();
  const { data: employee } = useMyEmployee();
  const contractType = content?.contract_type || 'employment';
  const hasContentText = !!content?.contract_text;
  
  // Hämta avtalsmall från Supabase om content inte redan har contract_text
  const { data: contractTemplate, isLoading } = useContractTemplate(
    company?.id,
    contractType
  );

  const [hasReadContract, setHasReadContract] = useState(stepData?.has_read || false);
  const [signature, setSignature] = useState<string | null>(stepData?.signature || null);
  const [signatureModalVisible, setSignatureModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filledContent, setFilledContent] = useState<string>('');

  useEffect(() => {
    if (submitRef) {
      submitRef.current = handleSubmit;
    }
    return () => {
      if (submitRef) {
        submitRef.current = null;
      }
    };
  }, [submitRef, hasReadContract, signature]);

  // Bestäm avtalstitel och innehåll
  const contractTitle = content?.contract_title || contractTemplate?.title || 'Anställningsavtal';
  
  // Fyll i medarbetardata i avtalstext
  useEffect(() => {
    let rawContent = '';
    
    // Prioritet 1: content.contract_text från onboarding_steps
    if (content?.contract_text) {
      rawContent = content.contract_text;
    }
    // Prioritet 2: contractTemplate från employee_contracts
    else if (contractTemplate?.content) {
      rawContent = contractTemplate.content;
    }
    // Prioritet 3: Fallback text
    else {
      rawContent = `ANSTÄLLNINGSAVTAL

Detta avtal ingås mellan arbetsgivaren och arbetstagaren enligt villkoren nedan.

1. ANSTÄLLNING
Arbetstagaren anställs tillsvidare med en ömsesidig uppsägningstid enligt lag.

2. ARBETSUPPGIFTER
Arbetstagaren ska utföra de arbetsuppgifter som framgår av befattningsbeskrivningen.

3. ARBETSTID
Ordinarie arbetstid är 40 timmar per vecka.

4. LÖN
Lönen utbetalas månadsvis den 25:e varje månad.

5. SEMESTER
Arbetstagaren har rätt till 25 dagars semester per år.

6. SEKRETESS
Arbetstagaren förbinder sig att inte röja konfidentiell information.`;
    }

    // Ersätt placeholders med medarbetardata
    if (employee && rawContent) {
      const emp = employee as any; // Cast för att komma åt alla fält
      const employeeName = emp.full_name || 
        `${emp.first_name || ''} ${emp.last_name || ''}`.trim() || 
        'Ej angivet';
      
      rawContent = rawContent
        .replace(/\[Namn\]|\[Medarbetarens namn\]/g, employeeName)
        .replace(/\[Personnummer\]|\[XXXXXX-XXXX\]/g, emp.personal_identity_number || 'Ej angivet')
        .replace(/\[E-post\]/g, emp.email || 'Ej angivet')
        .replace(/\[Telefon\]/g, emp.phone || emp.phone1 || 'Ej angivet')
        .replace(/\[Adress\]/g, emp.address1 || emp.address || 'Ej angivet')
        .replace(/\[Postnummer\]/g, emp.post_code || emp.postal_code || 'Ej angivet')
        .replace(/\[Ort\]/g, emp.city || 'Ej angivet')
        .replace(/\[Anställningsdatum\]/g, emp.employment_date || 'Ej angivet')
        .replace(/\[Månadslön\]/g, emp.monthly_salary ? `${emp.monthly_salary} SEK` : 'Enligt överenskommelse');
    }

    setFilledContent(rawContent);
  }, [content, contractTemplate, employee]);

  const contractContent = filledContent;

  const handleSignatureComplete = (signatureData: string) => {
    console.log('✅ CONTRACT_SIGNING_STEP: Signature received from modal');
    setSignature(signatureData);
    setSignatureModalVisible(false);
  };

  const handleClearSignature = () => {
    setSignature(null);
  };

  const handleSign = () => {
    console.log('✍️ CONTRACT_SIGNING_STEP handleSign:', { hasRead: hasReadContract, hasSignature: !!signature });
    
    if (!hasReadContract) {
      console.warn('⚠️ CONTRACT_SIGNING_STEP cannot sign - contract not read');
      Alert.alert(t('onboarding.contract.alertReadFirst'), t('onboarding.contract.alertReadMessage'));
      return false;
    }

    if (!signature) {
      console.warn('⚠️ CONTRACT_SIGNING_STEP cannot sign - no signature');
      Alert.alert(t('onboarding.contract.alertSignatureMissing'), t('onboarding.contract.alertSignatureMessage'));
      return false;
    }

    console.log('✅ CONTRACT_SIGNING_STEP signing contract');
    onComplete({
      has_read: true,
      signature: signature,
      signed_at: new Date().toISOString(),
      contract_title: contractTitle,
    });
    return true;
  };

  const handleSubmit = async () => {
    handleSign();
  };

  return (
    <>
      <Surface style={styles.card} elevation={0}>
        <View style={styles.header}>
          <FileText size={24} color="#0056b3" />
          <Text variant="titleLarge" style={styles.title}>
            {getOnboardingStepTitle(step, language === 'sv' ? 'sv' : 'en') || contractTitle}
          </Text>
        </View>
        
        <Text variant="bodyMedium" style={styles.description}>
          {getOnboardingStepDescription(step, language === 'sv' ? 'sv' : 'en') || t('onboarding.contract.description')}
        </Text>

        {/* Contract Content */}
        <Surface style={styles.contractContainer} elevation={0}>
          <ScrollView 
            style={styles.contractScroll}
            nestedScrollEnabled={true}
          >
            <Text variant="bodyMedium" style={styles.contractText}>
              {contractContent}
            </Text>
          </ScrollView>
        </Surface>

        {/* Read Confirmation */}
        <View style={styles.checkboxContainer}>
          <Checkbox
            status={hasReadContract ? 'checked' : 'unchecked'}
            onPress={() => setHasReadContract(!hasReadContract)}
          />
          <Text 
            variant="bodyMedium" 
            style={styles.checkboxLabel}
            onPress={() => setHasReadContract(!hasReadContract)}
          >
            {t('onboarding.contract.readConfirmation')}
          </Text>
        </View>
      </Surface>

      {/* Signature Section */}
      <Surface style={styles.signatureSection} elevation={0}>
        <View style={styles.header}>
          <PenTool size={24} color="#0056b3" />
          <Text variant="titleMedium" style={styles.title}>
            {t('onboarding.contract.signatureTitle')}
          </Text>
        </View>

        {signature ? (
          <View style={styles.signaturePreview}>
            <View style={styles.signatureImageContainer}>
              <Text variant="bodySmall" style={styles.signatureLabel}>
                {t('onboarding.contract.yourSignature')}
              </Text>
              {/* Display signature preview */}
              <View style={styles.signaturePlaceholder}>
                <Check size={32} color="#10b981" />
                <Text variant="bodyMedium" style={styles.signedText}>
                  {t('onboarding.contract.signed')}
                </Text>
              </View>
            </View>
            <Button 
              mode="outlined" 
              onPress={handleClearSignature}
              style={styles.clearButton}
            >
              {t('onboarding.contract.clearSignature')}
            </Button>
          </View>
        ) : (
          <View style={styles.signatureArea}>
            <Button
              mode="outlined"
              onPress={() => setSignatureModalVisible(true)}
              icon={({ size, color }) => <PenTool size={size} color={color} />}
              style={styles.signButton}
              disabled={!hasReadContract}
            >
              {t('onboarding.contract.openSignatureView')}
            </Button>
            {!hasReadContract && (
              <Text variant="bodySmall" style={styles.warningText}>
                {t('onboarding.contract.mustReadFirst')}
              </Text>
            )}
          </View>
        )}
      </Surface>

      {/* Signature Modal */}
      <SignatureModal
        visible={signatureModalVisible}
        onComplete={handleSignatureComplete}
        onClose={() => setSignatureModalVisible(false)}
        title={t('onboarding.contract.signatureModalTitle')}
        description={t('onboarding.contract.signatureModalDesc')}
      />
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
  contractContainer: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    borderWidth: 0,
    marginBottom: 16,
  },
  contractScroll: {
    maxHeight: 300,
    padding: 16,
  },
  contractText: {
    lineHeight: 24,
    color: '#374151',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    flex: 1,
  },
  signatureSection: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  signaturePreview: {
    alignItems: 'center',
    gap: 12,
  },
  signatureImageContainer: {
    width: '100%',
    alignItems: 'center',
  },
  signatureLabel: {
    color: '#6b7280',
    marginBottom: 8,
  },
  signaturePlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 24,
    backgroundColor: '#d1fae5',
    borderRadius: 8,
    width: '100%',
    justifyContent: 'center',
  },
  signedText: {
    color: '#10b981',
    fontWeight: '600',
  },
  clearButton: {
    marginTop: 8,
  },
  signatureArea: {
    alignItems: 'center',
    gap: 8,
  },
  signButton: {
    width: '100%',
    paddingVertical: 16,
    borderStyle: 'dashed',
  },
  warningText: {
    color: '#f59e0b',
  },
});
