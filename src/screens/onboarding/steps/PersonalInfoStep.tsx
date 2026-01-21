import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TextInput } from 'react-native';
import { Text, Button, Surface } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { User } from 'lucide-react-native';

interface PersonalInfoStepProps {
  content: Record<string, any>;
  stepData: Record<string, any>;
  onComplete: (data: Record<string, any>) => void;
  onSave: (data: Record<string, any>) => void;
}

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  content,
  stepData,
  onComplete,
  onSave,
}) => {
  const { isDark } = useTheme();
  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';
  const accentColor = isDark ? '#6BBD68' : '#489A45';
  const inputBg = isDark ? '#1A1A1A' : '#FFFFFF';
  const borderColor = isDark ? '#333' : '#E5E5E5';
  const [formData, setFormData] = useState({
    first_name: stepData?.first_name || '',
    last_name: stepData?.last_name || '',
    personal_number: stepData?.personal_number || '',
    address: stepData?.address || '',
    postal_code: stepData?.postal_code || '',
    city: stepData?.city || '',
    phone: stepData?.phone || '',
    email: stepData?.email || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    console.log('🔍 PERSONAL_INFO_STEP validate:', formData);
    const newErrors: Record<string, string> = {};
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Förnamn krävs';
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Efternamn krävs';
    }
    if (!formData.personal_number.trim()) {
      newErrors.personal_number = 'Personnummer krävs';
    } else if (!/^\d{6,8}-?\d{4}$/.test(formData.personal_number)) {
      newErrors.personal_number = 'Ogiltigt personnummer (ÅÅÅÅMMDD-XXXX)';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Adress krävs';
    }
    if (!formData.postal_code.trim()) {
      newErrors.postal_code = 'Postnummer krävs';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'Ort krävs';
    }
    
    if (Object.keys(newErrors).length > 0) {
      console.warn('⚠️ PERSONAL_INFO_STEP validation failed:', newErrors);
    } else {
      console.log('✅ PERSONAL_INFO_STEP validation passed');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onComplete(formData);
    }
  };

  const handleSave = () => {
    onSave(formData);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const inputStyle = [
    styles.input,
    { backgroundColor: inputBg, borderColor, color: textColor }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Surface style={styles.card} elevation={1}>
        <View style={styles.header}>
          <User size={24} color={accentColor} />
          <Text variant="h3" style={{ color: textColor }}>
            Personuppgifter
          </Text>
        </View>
        
        <Text variant="body" style={[styles.description, { color: mutedColor }]}>
          {content?.description || 'Fyll i dina personuppgifter nedan.'}
        </Text>

        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text variant="body-sm" style={[styles.label, { color: textColor }]}>Förnamn *</Text>
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
            <Text variant="body-sm" style={[styles.label, { color: textColor }]}>Efternamn *</Text>
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

        <Text variant="body-sm" style={[styles.label, { color: textColor }]}>Personnummer *</Text>
        <TextInput
          value={formData.personal_number}
          onChangeText={(text) => updateField('personal_number', text)}
          placeholder="ÅÅÅÅMMDD-XXXX"
          style={[inputStyle, errors.personal_number && styles.inputError]}
          placeholderTextColor={mutedColor}
        />
        {errors.personal_number && (
          <Text variant="body-sm" style={styles.errorText}>{errors.personal_number}</Text>
        )}

        <Text variant="body-sm" style={[styles.label, { color: textColor }]}>Adress *</Text>
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
            <Text variant="body-sm" style={[styles.label, { color: textColor }]}>Postnummer *</Text>
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
            <Text variant="body-sm" style={[styles.label, { color: textColor }]}>Ort *</Text>
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

        <Text variant="body-sm" style={[styles.label, { color: textColor }]}>Telefon</Text>
        <TextInput
          value={formData.phone}
          onChangeText={(text) => updateField('phone', text)}
          keyboardType="phone-pad"
          style={inputStyle}
          placeholderTextColor={mutedColor}
        />

        <Text variant="body-sm" style={[styles.label, { color: textColor }]}>E-post</Text>
        <TextInput
          value={formData.email}
          onChangeText={(text) => updateField('email', text)}
          keyboardType="email-address"
          autoCapitalize="none"
          style={inputStyle}
          placeholderTextColor={mutedColor}
        />
      </Surface>

      <View style={styles.buttonContainer}>
        <Button variant="outline" onPress={handleSave} style={styles.saveButton}>
          Spara utkast
        </Button>
        <Button variant="primary" onPress={handleSubmit} style={styles.submitButton}>
          Fortsätt
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    padding: 16,
    borderRadius: 12,
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
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    marginBottom: 32,
  },
  saveButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
});
