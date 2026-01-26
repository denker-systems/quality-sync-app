import React, { useState } from 'react';
import { View, StyleSheet, Switch, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { ScreenLayout } from '@/components/common';
import { Text, Card, CardContent, Badge } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/config/supabase';
import { Fingerprint, Smartphone, Shield, CheckCircle } from 'lucide-react-native';

export function SecurityScreen() {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';
  const accentColor = isDark ? '#6BBD68' : '#489A45';
  const iconBgColor = isDark ? 'rgba(107,189,104,0.15)' : '#EDF5EC';

  // Fetch MFA factors from Supabase
  const { data: mfaFactors, isLoading: mfaLoading } = useQuery({
    queryKey: ['mfa-factors', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) throw error;
      return data?.totp || [];
    },
  });

  const hasMfaEnabled = mfaFactors && mfaFactors.length > 0;
  const verifiedFactors = mfaFactors?.filter((f: any) => f.status === 'verified') || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sv-SE');
  };

  const handleBackToSettings = () => {
    navigation.navigate('Settings');
  };

  return (
    <ScreenLayout title={t('security.title')} onBackPress={handleBackToSettings}>
      {/* Biometric */}
      <View style={styles.section}>
        <Card variant="elevated">
          <CardContent style={styles.cardContent}>
            <View style={styles.settingsItem}>
              <View style={[styles.settingsIcon, { backgroundColor: iconBgColor }]}>
                <Fingerprint size={20} color={accentColor} />
              </View>
              <View style={styles.settingsText}>
                <Text variant="body-lg" style={{ color: textColor }}>
                  {t('security.biometric')}
                </Text>
                <Text variant="body-sm" style={{ color: mutedColor }}>
                  {t('security.biometricSubtitle')}
                </Text>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={setBiometricEnabled}
                trackColor={{ false: '#767577', true: accentColor }}
                thumbColor="#FFFFFF"
              />
            </View>
          </CardContent>
        </Card>
      </View>

      {/* Two-Factor Authentication */}
      <View style={styles.section}>
        <Card variant="elevated">
          <CardContent style={styles.cardContent}>
            <View style={styles.settingsItem}>
              <View style={[styles.settingsIcon, { backgroundColor: iconBgColor }]}>
                <Smartphone size={20} color={accentColor} />
              </View>
              <View style={styles.settingsText}>
                <Text variant="body-lg" style={{ color: textColor }}>
                  {t('security.twoFactor')}
                </Text>
                <Text variant="body-sm" style={{ color: mutedColor }}>
                  {hasMfaEnabled
                    ? t('security.twoFactorEnabled')
                    : t('security.twoFactorRecommended')}
                </Text>
              </View>
              {mfaLoading ? (
                <ActivityIndicator size="small" color={accentColor} />
              ) : hasMfaEnabled ? (
                <Badge variant="success">{t('security.active')}</Badge>
              ) : (
                <Badge variant="default">{t('security.inactive')}</Badge>
              )}
            </View>

            {/* Show registered MFA devices */}
            {verifiedFactors.length > 0 && (
              <View style={styles.mfaDevices}>
                {verifiedFactors.map((factor: any) => (
                  <View
                    key={factor.id}
                    style={[styles.mfaDevice, { borderColor: isDark ? '#2E2E2E' : '#E5E5E5' }]}
                  >
                    <View style={styles.mfaDeviceInfo}>
                      <CheckCircle size={16} color={accentColor} />
                      <Text variant="body" style={{ color: textColor, marginLeft: 8 }}>
                        {factor.friendly_name || 'Google Authenticator'}
                      </Text>
                    </View>
                    <Text variant="body-sm" style={{ color: mutedColor }}>
                      {t('security.added')} {formatDate(factor.created_at)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </CardContent>
        </Card>
      </View>

      {/* Security Info */}
      <View style={styles.infoContainer}>
        <Shield size={24} color={mutedColor} />
        <Text variant="body-sm" style={{ color: mutedColor, textAlign: 'center', marginTop: 8 }}>
          {t('security.securityInfo')}
        </Text>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 12,
  },
  cardContent: {
    paddingVertical: 4,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsText: {
    flex: 1,
    marginLeft: 12,
  },
  infoContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  mfaDevices: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  mfaDevice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  mfaDeviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default SecurityScreen;
