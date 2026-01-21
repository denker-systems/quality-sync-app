import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, TextInput, Button, Surface } from 'react-native-paper';
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
  console.log('👤 PERSONAL_INFO_STEP render:', { stepData });
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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Surface style={styles.card} elevation={1}>
        <View style={styles.header}>
          <User size={24} color="#0056b3" />
          <Text variant="titleLarge" style={styles.title}>
            Personuppgifter
          </Text>
        </View>
        
        <Text variant="bodyMedium" style={styles.description}>
          {content?.description || 'Fyll i dina personuppgifter nedan.'}
        </Text>

        <View style={styles.row}>
          <View style={styles.halfField}>
            <TextInput
              label="Förnamn *"
              value={formData.first_name}
              onChangeText={(text) => updateField('first_name', text)}
              mode="outlined"
              error={!!errors.first_name}
              style={styles.input}
            />
            {errors.first_name && (
              <Text style={styles.errorText}>{errors.first_name}</Text>
            )}
          </View>
          <View style={styles.halfField}>
            <TextInput
              label="Efternamn *"
              value={formData.last_name}
              onChangeText={(text) => updateField('last_name', text)}
              mode="outlined"
              error={!!errors.last_name}
              style={styles.input}
            />
            {errors.last_name && (
              <Text style={styles.errorText}>{errors.last_name}</Text>
            )}
          </View>
        </View>

        <TextInput
          label="Personnummer *"
          value={formData.personal_number}
          onChangeText={(text) => updateField('personal_number', text)}
          mode="outlined"
          placeholder="ÅÅÅÅMMDD-XXXX"
          error={!!errors.personal_number}
          style={styles.input}
        />
        {errors.personal_number && (
          <Text style={styles.errorText}>{errors.personal_number}</Text>
        )}

        <TextInput
          label="Adress *"
          value={formData.address}
          onChangeText={(text) => updateField('address', text)}
          mode="outlined"
          error={!!errors.address}
          style={styles.input}
        />
        {errors.address && (
          <Text style={styles.errorText}>{errors.address}</Text>
        )}

        <View style={styles.row}>
          <View style={styles.halfField}>
            <TextInput
              label="Postnummer *"
              value={formData.postal_code}
              onChangeText={(text) => updateField('postal_code', text)}
              mode="outlined"
              keyboardType="numeric"
              error={!!errors.postal_code}
              style={styles.input}
            />
            {errors.postal_code && (
              <Text style={styles.errorText}>{errors.postal_code}</Text>
            )}
          </View>
          <View style={styles.halfField}>
            <TextInput
              label="Ort *"
              value={formData.city}
              onChangeText={(text) => updateField('city', text)}
              mode="outlined"
              error={!!errors.city}
              style={styles.input}
            />
            {errors.city && (
              <Text style={styles.errorText}>{errors.city}</Text>
            )}
          </View>
        </View>

        <TextInput
          label="Telefon"
          value={formData.phone}
          onChangeText={(text) => updateField('phone', text)}
          mode="outlined"
          keyboardType="phone-pad"
          style={styles.input}
        />

        <TextInput
          label="E-post"
          value={formData.email}
          onChangeText={(text) => updateField('email', text)}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
      </Surface>

      <View style={styles.buttonContainer}>
        <Button mode="outlined" onPress={handleSave} style={styles.saveButton}>
          Spara utkast
        </Button>
        <Button mode="contained" onPress={handleSubmit} style={styles.submitButton}>
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
