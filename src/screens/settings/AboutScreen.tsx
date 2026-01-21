import React from 'react';
import { View, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenLayout } from '@/components/common';
import { Text, Card, CardContent } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Info, 
  FileText, 
  Shield,
  Mail,
  ExternalLink,
} from 'lucide-react-native';

export function AboutScreen() {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const navigation = useNavigation<any>();
  
  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';
  const accentColor = isDark ? '#6BBD68' : '#489A45';
  const iconBgColor = isDark ? 'rgba(107,189,104,0.15)' : '#EDF5EC';

  const handleBackToSettings = () => {
    navigation.navigate('Settings');
  };

  const handleOpenLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScreenLayout title={t('about.title')} onBackPress={handleBackToSettings}>
      {/* App Info */}
      <View style={styles.headerSection}>
        <View style={[styles.appIcon, { backgroundColor: iconBgColor }]}>
          <Info size={32} color={accentColor} />
        </View>
        <Text variant="h2" style={{ color: textColor, marginTop: 16 }}>
          Quality Sync
        </Text>
        <Text variant="body" style={{ color: mutedColor, marginTop: 4 }}>
          {t('about.version')} 1.0.0 (Build 1)
        </Text>
      </View>

      {/* Links */}
      <View style={styles.section}>
        <Card variant="elevated">
          <CardContent style={styles.cardContent}>
            <TouchableOpacity 
              style={styles.linkItem}
              onPress={() => handleOpenLink('https://qualitysync.se/privacy')}
            >
              <View style={[styles.linkIcon, { backgroundColor: iconBgColor }]}>
                <Shield size={18} color={accentColor} />
              </View>
              <Text variant="body-lg" style={[styles.linkText, { color: textColor }]}>
                {t('about.privacyPolicy')}
              </Text>
              <ExternalLink size={18} color={mutedColor} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: isDark ? '#2E2E2E' : '#E5E5E5' }]} />

            <TouchableOpacity 
              style={styles.linkItem}
              onPress={() => handleOpenLink('https://qualitysync.se/terms')}
            >
              <View style={[styles.linkIcon, { backgroundColor: iconBgColor }]}>
                <FileText size={18} color={accentColor} />
              </View>
              <Text variant="body-lg" style={[styles.linkText, { color: textColor }]}>
                {t('about.termsOfService')}
              </Text>
              <ExternalLink size={18} color={mutedColor} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: isDark ? '#2E2E2E' : '#E5E5E5' }]} />

            <TouchableOpacity 
              style={styles.linkItem}
              onPress={() => handleOpenLink('mailto:support@qualitysync.se')}
            >
              <View style={[styles.linkIcon, { backgroundColor: iconBgColor }]}>
                <Mail size={18} color={accentColor} />
              </View>
              <Text variant="body-lg" style={[styles.linkText, { color: textColor }]}>
                {t('about.contactSupport')}
              </Text>
              <ExternalLink size={18} color={mutedColor} />
            </TouchableOpacity>
          </CardContent>
        </Card>
      </View>

      {/* Credits */}
      <View style={styles.creditsContainer}>
        <Text variant="body-sm" style={{ color: mutedColor }}>
          {t('about.copyright')}
        </Text>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: 12,
  },
  cardContent: {
    paddingVertical: 4,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  linkIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkText: {
    flex: 1,
    marginLeft: 12,
  },
  divider: {
    height: 1,
  },
  creditsContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
});

export default AboutScreen;
