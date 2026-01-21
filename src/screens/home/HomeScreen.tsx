import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { 
  Calendar, 
  ClipboardList, 
  FileText, 
  User,
  ChevronRight,
  Bell,
  Home,
} from 'lucide-react-native';
import { ScreenLayout } from '@/components/common';
import { MenuButton } from '@/components/common/MenuButton';
import { Text, Card, CardContent } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { useMyEmployee } from '@/hooks/useMyEmployee';

interface QuickActionProps {
  icon: React.ComponentType<{ size: number; color: string }>;
  title: string;
  subtitle: string;
  onPress: () => void;
}

function QuickAction({ icon: Icon, title, subtitle, onPress }: QuickActionProps) {
  const { isDark } = useTheme();
  const iconBgColor = isDark ? 'rgba(107,189,104,0.15)' : '#EDF5EC';
  const iconColor = isDark ? '#A8D5A2' : '#489A45';
  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card variant="elevated" style={styles.quickActionCard}>
        <CardContent style={styles.quickActionContent}>
          <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
            <Icon size={24} color={iconColor} />
          </View>
          <View style={styles.quickActionText}>
            <Text variant="body-lg" style={{ color: textColor }}>{title}</Text>
            <Text variant="body-sm" style={{ color: mutedColor }}>{subtitle}</Text>
          </View>
          <ChevronRight size={20} color={mutedColor} />
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
}

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { data: employee } = useMyEmployee();

  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';
  const accentColor = isDark ? '#6BBD68' : '#489A45';

  return (
    <ScreenLayout title="Hem" showBack={false} headerRight={<MenuButton />}>
      {/* Quick Actions */}
      <View style={styles.section}>
        <Text variant="h3" style={[styles.sectionTitle, { color: textColor }]}>
          Snabbval
        </Text>

        <QuickAction
          icon={Calendar}
          title="Mitt Schema"
          subtitle="Se kommande skift och pass"
          onPress={() => navigation.navigate('Schedule')}
        />

        <QuickAction
          icon={ClipboardList}
          title="Onboarding"
          subtitle="Slutför din introduktion"
          onPress={() => navigation.navigate('Onboarding')}
        />

        <QuickAction
          icon={FileText}
          title="Mina Avtal"
          subtitle="Kontrakt och dokument"
          onPress={() => navigation.navigate('Contracts')}
        />

        <QuickAction
          icon={User}
          title="Min Profil"
          subtitle="Personuppgifter och inställningar"
          onPress={() => navigation.navigate('Profile')}
        />
      </View>

      {/* Stats Card */}
      <View style={styles.section}>
        <Text variant="h3" style={[styles.sectionTitle, { color: textColor }]}>
          Denna vecka
        </Text>

        <Card variant="elevated">
          <CardContent>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text variant="display" style={{ color: accentColor }}>3</Text>
                <Text variant="body-sm" style={{ color: mutedColor }}>Skift</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: isDark ? '#333' : '#E5E5E5' }]} />
              <View style={styles.statItem}>
                <Text variant="display" style={{ color: accentColor }}>24</Text>
                <Text variant="body-sm" style={{ color: mutedColor }}>Timmar</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: isDark ? '#333' : '#E5E5E5' }]} />
              <View style={styles.statItem}>
                <Text variant="display" style={{ color: accentColor }}>2</Text>
                <Text variant="body-sm" style={{ color: mutedColor }}>Dagar kvar</Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    marginLeft: 16,
  },
  notificationBadge: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  quickActionCard: {
    marginBottom: 12,
  },
  quickActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionText: {
    flex: 1,
    marginLeft: 12,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E5E5',
  },
});

export default HomeScreen;
