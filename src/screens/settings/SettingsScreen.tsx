import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenLayout } from '@/components/common';
import { Text, Card, CardContent } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  Palette, 
  Bell, 
  Lock, 
  Info,
  Key,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react-native';

interface SettingsItemProps {
  icon: React.ComponentType<{ size: number; color: string }>;
  title: string;
  subtitle: string;
  onPress: () => void;
  rightContent?: React.ReactNode;
}

function SettingsItem({ icon: Icon, title, subtitle, onPress, rightContent }: SettingsItemProps) {
  const { isDark } = useTheme();
  const iconBgColor = isDark ? 'rgba(107,189,104,0.15)' : '#EDF5EC';
  const iconColor = isDark ? '#A8D5A2' : '#489A45';
  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';

  return (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.settingsIcon, { backgroundColor: iconBgColor }]}>
        <Icon size={20} color={iconColor} />
      </View>
      <View style={styles.settingsText}>
        <Text variant="body-lg" style={{ color: textColor }}>{title}</Text>
        <Text variant="body-sm" style={{ color: mutedColor }}>{subtitle}</Text>
      </View>
      {rightContent || <ChevronRight size={20} color={mutedColor} />}
    </TouchableOpacity>
  );
}

export function SettingsScreen() {
  const { isDark, toggleTheme } = useTheme();
  const navigation = useNavigation<any>();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';
  const accentColor = isDark ? '#6BBD68' : '#489A45';

  const handleSecurity = () => {
    navigation.navigate('Security');
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  const handleAbout = () => {
    navigation.navigate('About');
  };

  return (
    <ScreenLayout title="Inställningar" showBack={false}>
      {/* Appearance - Theme Toggle */}
      <View style={styles.section}>
        <Card variant="elevated">
          <CardContent style={styles.cardContent}>
            <View style={styles.settingsItem}>
              <View style={[styles.settingsIcon, { backgroundColor: isDark ? 'rgba(107,189,104,0.15)' : '#EDF5EC' }]}>
                <Palette size={20} color={accentColor} />
              </View>
              <View style={styles.settingsText}>
                <Text variant="body-lg" style={{ color: textColor }}>Utseende</Text>
                <Text variant="body-sm" style={{ color: mutedColor }}>{isDark ? 'Mörkt tema' : 'Ljust tema'}</Text>
              </View>
              <View style={styles.themeButtons}>
                <TouchableOpacity 
                  onPress={() => isDark && toggleTheme()}
                  style={[
                    styles.themeButton, 
                    !isDark && styles.themeButtonActive,
                    { backgroundColor: !isDark ? accentColor : (isDark ? '#2A2A2A' : '#F5F5F5') }
                  ]}
                >
                  <Sun size={16} color={!isDark ? '#FFFFFF' : mutedColor} />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => !isDark && toggleTheme()}
                  style={[
                    styles.themeButton, 
                    isDark && styles.themeButtonActive,
                    { backgroundColor: isDark ? accentColor : (isDark ? '#2A2A2A' : '#F5F5F5') }
                  ]}
                >
                  <Moon size={16} color={isDark ? '#FFFFFF' : mutedColor} />
                </TouchableOpacity>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>

      {/* Notifications - Toggle */}
      <View style={styles.section}>
        <Card variant="elevated">
          <CardContent style={styles.cardContent}>
            <View style={styles.settingsItem}>
              <View style={[styles.settingsIcon, { backgroundColor: isDark ? 'rgba(107,189,104,0.15)' : '#EDF5EC' }]}>
                <Bell size={20} color={accentColor} />
              </View>
              <View style={styles.settingsText}>
                <Text variant="body-lg" style={{ color: textColor }}>Notifikationer</Text>
                <Text variant="body-sm" style={{ color: mutedColor }}>
                  {notificationsEnabled ? 'Aktiverad' : 'Inaktiverad'}
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#767577', true: accentColor }}
                thumbColor="#FFFFFF"
              />
            </View>
          </CardContent>
        </Card>
      </View>

      {/* Security - Navigate to screen */}
      <View style={styles.section}>
        <Card variant="elevated">
          <CardContent style={styles.cardContent}>
            <SettingsItem
              icon={Lock}
              title="Säkerhet"
              subtitle="Biometri, 2FA"
              onPress={handleSecurity}
            />
          </CardContent>
        </Card>
      </View>

      {/* Change Password - Navigate to screen */}
      <View style={styles.section}>
        <Card variant="elevated">
          <CardContent style={styles.cardContent}>
            <SettingsItem
              icon={Key}
              title="Byt lösenord"
              subtitle="Uppdatera ditt lösenord"
              onPress={handleChangePassword}
            />
          </CardContent>
        </Card>
      </View>

      {/* About - Navigate to screen */}
      <View style={styles.section}>
        <Card variant="elevated">
          <CardContent style={styles.cardContent}>
            <SettingsItem
              icon={Info}
              title="Om appen"
              subtitle="Version, licenser"
              onPress={handleAbout}
            />
          </CardContent>
        </Card>
      </View>

      {/* Version info */}
      <View style={styles.versionContainer}>
        <Text variant="body-sm" style={{ color: mutedColor, textAlign: 'center' }}>
          Quality Sync v1.0.0
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
  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  themeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeButtonActive: {
    // Active state handled by backgroundColor
  },
  versionContainer: {
    marginTop: 24,
    marginBottom: 32,
  },
});

export default SettingsScreen;
