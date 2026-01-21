import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenLayout } from '@/components/common';
import { Text, Card, CardContent, Button } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/config/supabase';
import { Key, Eye, EyeOff, Shield } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

export function ChangePasswordScreen() {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const navigation = useNavigation<any>();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';
  const accentColor = isDark ? '#6BBD68' : '#489A45';
  const inputBg = isDark ? '#1A1A1A' : '#FFFFFF';
  const borderColor = isDark ? '#2E2E2E' : '#E5E5E5';

  const handleBackToSettings = () => {
    navigation.navigate('Settings');
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert(t('common.error'), t('changePassword.errorRequired'));
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(t('common.error'), t('changePassword.errorMismatch'));
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert(t('common.error'), t('changePassword.errorTooShort'));
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      Alert.alert(t('changePassword.successTitle'), t('changePassword.successMessage'), [
        { text: 'OK', onPress: () => navigation.navigate('Settings') }
      ]);
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message || t('changePassword.errorRequired'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenLayout title={t('changePassword.title')} onBackPress={handleBackToSettings}>
      <Card variant="elevated" style={styles.card}>
        <CardContent>
          <View style={styles.header}>
            <Key size={24} color={accentColor} />
            <Text variant="h3" style={{ color: textColor, marginLeft: 12 }}>
              {t('changePassword.updatePassword')}
            </Text>
          </View>

          <Text variant="body-sm" style={[styles.label, { color: mutedColor }]}>
            {t('changePassword.newPassword')}
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNew}
              placeholder={t('changePassword.newPasswordPlaceholder')}
              placeholderTextColor={mutedColor}
              style={[styles.input, { backgroundColor: inputBg, borderColor, color: textColor }]}
            />
            <TouchableOpacity 
              style={styles.eyeButton}
              onPress={() => setShowNew(!showNew)}
            >
              {showNew ? (
                <EyeOff size={20} color={mutedColor} />
              ) : (
                <Eye size={20} color={mutedColor} />
              )}
            </TouchableOpacity>
          </View>

          <Text variant="body-sm" style={[styles.label, { color: mutedColor }]}>
            {t('changePassword.confirmPassword')}
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirm}
              placeholder={t('changePassword.confirmPasswordPlaceholder')}
              placeholderTextColor={mutedColor}
              style={[styles.input, { backgroundColor: inputBg, borderColor, color: textColor }]}
            />
            <TouchableOpacity 
              style={styles.eyeButton}
              onPress={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? (
                <EyeOff size={20} color={mutedColor} />
              ) : (
                <Eye size={20} color={mutedColor} />
              )}
            </TouchableOpacity>
          </View>
        </CardContent>
      </Card>

      <Button
        variant="primary"
        onPress={handleChangePassword}
        disabled={isLoading || !newPassword || !confirmPassword}
        style={styles.button}
      >
        {isLoading ? t('changePassword.saving') : t('changePassword.saveButton')}
      </Button>

      <View style={styles.infoContainer}>
        <Shield size={20} color={mutedColor} />
        <Text variant="body-sm" style={{ color: mutedColor, marginLeft: 8, flex: 1 }}>
          {t('changePassword.passwordHint')}
        </Text>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    marginBottom: 6,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  input: {
    padding: 12,
    paddingRight: 48,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  button: {
    marginBottom: 24,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 8,
  },
});

export default ChangePasswordScreen;
