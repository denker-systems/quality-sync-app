import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { useNavigation } from '@react-navigation/native';
import { ScreenLayout } from '@/components/common';
import { Text, Card, CardContent, ImageButton } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { useMyEmployee } from '@/hooks/useMyEmployee';

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { data: employee } = useMyEmployee();

  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';
  const accentColor = isDark ? '#6BBD68' : '#489A45';

  return (
    <ScreenLayout title={t('home.title')} isRoot={true}>
      {/* Quick Actions */}
      <View style={styles.section}>
        <Text variant="h3" style={[styles.sectionTitle, { color: textColor }]}>
          {t('home.quickActions')}
        </Text>

        <View style={styles.gridContainer}>
          <View style={styles.gridRow}>
            <MotiView
              style={styles.gridButton}
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 320, delay: 80 }}
            >
              <ImageButton
                title={t('home.mySchedule')}
                image={require('../../../assets/images/schedule.png')}
                onPress={() => navigation.navigate('Schedule')}
              />
            </MotiView>
            <MotiView
              style={styles.gridButton}
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 320, delay: 140 }}
            >
              <ImageButton
                title={t('home.onboarding')}
                image={require('../../../assets/images/onboarding.png')}
                onPress={() => navigation.navigate('Onboarding')}
              />
            </MotiView>
          </View>
          <View style={styles.gridRow}>
            <MotiView
              style={styles.gridButton}
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 320, delay: 200 }}
            >
              <ImageButton
                title={t('home.myContracts')}
                image={require('../../../assets/images/contract.png')}
                onPress={() => navigation.navigate('Contracts')}
              />
            </MotiView>
            <MotiView
              style={styles.gridButton}
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 320, delay: 260 }}
            >
              <ImageButton
                title={t('home.myProfile')}
                onPress={() => navigation.navigate('Profile')}
              />
            </MotiView>
          </View>
        </View>
      </View>

      {/* Stats Card */}
      <View style={styles.section}>
        <Text variant="h3" style={[styles.sectionTitle, { color: textColor }]}>
          {t('home.thisWeek')}
        </Text>

        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 320, delay: 320 }}
        >
          <Card variant="elevated">
            <CardContent>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text variant="display" style={{ color: accentColor }}>3</Text>
                  <Text variant="body-sm" style={{ color: mutedColor }}>{t('home.shifts')}</Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: isDark ? '#333' : '#E5E5E5' }]} />
                <View style={styles.statItem}>
                  <Text variant="display" style={{ color: accentColor }}>24</Text>
                  <Text variant="body-sm" style={{ color: mutedColor }}>{t('home.hours')}</Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: isDark ? '#333' : '#E5E5E5' }]} />
                <View style={styles.statItem}>
                  <Text variant="display" style={{ color: accentColor }}>2</Text>
                  <Text variant="body-sm" style={{ color: mutedColor }}>{t('home.daysLeft')}</Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </MotiView>
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
    paddingTop: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  gridContainer: {
    gap: 12,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  gridButton: {
    flex: 1,
    aspectRatio: 1,
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
