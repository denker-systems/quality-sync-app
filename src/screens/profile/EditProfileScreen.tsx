import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Card, ActivityIndicator } from 'react-native-paper';
import { SafeAreaWrapper } from '@/components/SafeAreaWrapper';
import { useMyEmployee } from '@/hooks/useMyEmployee';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '@/config/supabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Save, ArrowLeft } from 'lucide-react-native';

export const EditProfileScreen = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { data: employee, isLoading } = useMyEmployee();
  
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

  if (isLoading) {
    return (
      <SafeAreaWrapper>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0056b3" />
          <Text style={styles.loadingText}>Laddar profil...</Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Button 
              mode="text" 
              onPress={() => navigation.goBack()}
              icon={() => <ArrowLeft size={20} color="#0056b3" />}
            >
              Tillbaka
            </Button>
          </View>

          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <User size={20} color="#0056b3" />
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Personuppgifter
                </Text>
              </View>

              <TextInput
                label="Förnamn"
                value={formData.first_name}
                onChangeText={(value) => updateField('first_name', value)}
                mode="outlined"
                style={styles.input}
              />

              <TextInput
                label="Efternamn"
                value={formData.last_name}
                onChangeText={(value) => updateField('last_name', value)}
                mode="outlined"
                style={styles.input}
              />

              <TextInput
                label="Telefon"
                value={formData.phone}
                onChangeText={(value) => updateField('phone', value)}
                mode="outlined"
                keyboardType="phone-pad"
                style={styles.input}
              />

              <TextInput
                label="Email"
                value={formData.email}
                onChangeText={(value) => updateField('email', value)}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Adress
                </Text>
              </View>

              <TextInput
                label="Adress 1"
                value={formData.address1}
                onChangeText={(value) => updateField('address1', value)}
                mode="outlined"
                style={styles.input}
              />

              <TextInput
                label="Adress 2"
                value={formData.address2}
                onChangeText={(value) => updateField('address2', value)}
                mode="outlined"
                style={styles.input}
              />

              <View style={styles.row}>
                <TextInput
                  label="Postnummer"
                  value={formData.post_code}
                  onChangeText={(value) => updateField('post_code', value)}
                  mode="outlined"
                  keyboardType="numeric"
                  style={[styles.input, styles.postCode]}
                />

                <TextInput
                  label="Ort"
                  value={formData.city}
                  onChangeText={(value) => updateField('city', value)}
                  mode="outlined"
                  style={[styles.input, styles.city]}
                />
              </View>
            </Card.Content>
          </Card>

          <Button
            mode="contained"
            onPress={handleSave}
            loading={updateProfile.isPending}
            disabled={updateProfile.isPending}
            style={styles.saveButton}
            icon={() => <Save size={18} color="#ffffff" />}
          >
            Spara ändringar
          </Button>

          {updateProfile.isError && (
            <Text style={styles.errorText}>
              Kunde inte spara ändringar. Försök igen.
            </Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  input: {
    marginBottom: 12,
    backgroundColor: '#ffffff',
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
    backgroundColor: '#0056b3',
  },
  errorText: {
    textAlign: 'center',
    color: '#ef4444',
    marginHorizontal: 16,
    marginBottom: 16,
  },
});

export default EditProfileScreen;
