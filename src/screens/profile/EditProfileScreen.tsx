import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, TextInput, ActivityIndicator } from 'react-native';
import { ScreenLayout } from '@/components/common';
import { Text, Card, CardContent, Button } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { useMyEmployee } from '@/hooks/useMyEmployee';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '@/config/supabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Save } from 'lucide-react-native';

export const EditProfileScreen = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { isDark } = useTheme();
  const { data: employee, isLoading } = useMyEmployee();
  
  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';
  const accentColor = isDark ? '#6BBD68' : '#489A45';
  const inputBg = isDark ? '#1A1A1A' : '#FFFFFF';
  const borderColor = isDark ? '#2E2E2E' : '#E5E5E5';
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    address1: '',
    address2: '',
    city: '',
    post_code: '',
  });

  console.log('✏️ EDIT_PROFILE_SCREEN render:', {
    employeeId: employee?.id,
    isLoading,
  });

  useEffect(() => {
    if (employee) {
      const emp = employee as any;
      setFormData({
        first_name: emp.first_name || '',
        last_name: emp.last_name || '',
        phone: emp.phone || '',
        email: emp.email || '',
        address1: emp.address1 || '',
        address2: emp.address2 || '',
        city: emp.city || '',
        post_code: emp.post_code || '',
      });
    }
  }, [employee]);

  const updateProfile = useMutation({
    mutationFn: async (data: typeof formData) => {
      console.log('💾 EDIT_PROFILE: Saving profile:', data);
      
      if (!employee?.id) throw new Error('No employee ID');

      const { error } = await (supabase as any)
        .from('employees')
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          full_name: `${data.first_name} ${data.last_name}`.trim(),
          phone: data.phone,
          email: data.email,
          address1: data.address1,
          address2: data.address2,
          city: data.city,
          post_code: data.post_code,
          updated_at: new Date().toISOString(),
        })
        .eq('id', employee.id);

      if (error) {
        console.error('❌ EDIT_PROFILE: Failed to save:', error);
        throw error;
      }

      console.log('✅ EDIT_PROFILE: Profile saved');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-employee'] });
      navigation.goBack();
    },
  });

  const handleSave = () => {
    updateProfile.mutate(formData);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBackToProfile = () => {
    navigation.navigate('Profile' as never);
  };

  if (isLoading) {
    return (
      <ScreenLayout title="Redigera Profil" onBackPress={handleBackToProfile} scrollable={false}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={accentColor} />
          <Text variant="body" style={{ color: mutedColor, marginTop: 16 }}>
            Laddar profil...
          </Text>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout title="Redigera Profil" onBackPress={handleBackToProfile}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Card variant="elevated" style={styles.card}>
          <CardContent>
            <View style={styles.sectionHeader}>
              <User size={20} color={accentColor} />
              <Text variant="h3" style={{ color: textColor, marginLeft: 8 }}>
                Personuppgifter
              </Text>
            </View>

            <Text variant="body-sm" style={[styles.label, { color: mutedColor }]}>Förnamn</Text>
            <TextInput
              value={formData.first_name}
              onChangeText={(value) => updateField('first_name', value)}
              style={[styles.input, { backgroundColor: inputBg, borderColor, color: textColor }]}
              placeholderTextColor={mutedColor}
            />

            <Text variant="body-sm" style={[styles.label, { color: mutedColor }]}>Efternamn</Text>
            <TextInput
              value={formData.last_name}
              onChangeText={(value) => updateField('last_name', value)}
              style={[styles.input, { backgroundColor: inputBg, borderColor, color: textColor }]}
              placeholderTextColor={mutedColor}
            />

            <Text variant="body-sm" style={[styles.label, { color: mutedColor }]}>Telefon</Text>
            <TextInput
              value={formData.phone}
              onChangeText={(value) => updateField('phone', value)}
              keyboardType="phone-pad"
              style={[styles.input, { backgroundColor: inputBg, borderColor, color: textColor }]}
              placeholderTextColor={mutedColor}
            />

            <Text variant="body-sm" style={[styles.label, { color: mutedColor }]}>Email</Text>
            <TextInput
              value={formData.email}
              onChangeText={(value) => updateField('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              style={[styles.input, { backgroundColor: inputBg, borderColor, color: textColor }]}
              placeholderTextColor={mutedColor}
            />
          </CardContent>
        </Card>

        <Card variant="elevated" style={styles.card}>
          <CardContent>
            <Text variant="h3" style={{ color: textColor, marginBottom: 16 }}>
              Adress
            </Text>

            <Text variant="body-sm" style={[styles.label, { color: mutedColor }]}>Adress 1</Text>
            <TextInput
              value={formData.address1}
              onChangeText={(value) => updateField('address1', value)}
              style={[styles.input, { backgroundColor: inputBg, borderColor, color: textColor }]}
              placeholderTextColor={mutedColor}
            />

            <Text variant="body-sm" style={[styles.label, { color: mutedColor }]}>Adress 2</Text>
            <TextInput
              value={formData.address2}
              onChangeText={(value) => updateField('address2', value)}
              style={[styles.input, { backgroundColor: inputBg, borderColor, color: textColor }]}
              placeholderTextColor={mutedColor}
            />

            <View style={styles.row}>
              <View style={styles.postCode}>
                <Text variant="body-sm" style={[styles.label, { color: mutedColor }]}>Postnummer</Text>
                <TextInput
                  value={formData.post_code}
                  onChangeText={(value) => updateField('post_code', value)}
                  keyboardType="numeric"
                  style={[styles.input, { backgroundColor: inputBg, borderColor, color: textColor }]}
                  placeholderTextColor={mutedColor}
                />
              </View>

              <View style={styles.city}>
                <Text variant="body-sm" style={[styles.label, { color: mutedColor }]}>Ort</Text>
                <TextInput
                  value={formData.city}
                  onChangeText={(value) => updateField('city', value)}
                  style={[styles.input, { backgroundColor: inputBg, borderColor, color: textColor }]}
                  placeholderTextColor={mutedColor}
                />
              </View>
            </View>
          </CardContent>
        </Card>

        <Button
          variant="primary"
          onPress={handleSave}
          disabled={updateProfile.isPending}
          style={styles.saveButton}
        >
          {updateProfile.isPending ? 'Sparar...' : 'Spara ändringar'}
        </Button>

        {updateProfile.isError && (
          <Text variant="body" style={styles.errorText}>
            Kunde inte spara ändringar. Försök igen.
          </Text>
        )}
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#6c757d',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  card: {
    margin: 16,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#1f2937',
    fontWeight: '600',
  },
  label: {
    marginBottom: 6,
  },
  input: {
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  postCode: {
    flex: 1,
  },
  city: {
    flex: 2,
  },
  saveButton: {
    margin: 16,
    marginTop: 8,
  },
  errorText: {
    textAlign: 'center',
    color: '#ef4444',
    marginHorizontal: 16,
    marginBottom: 16,
  },
});

export default EditProfileScreen;
