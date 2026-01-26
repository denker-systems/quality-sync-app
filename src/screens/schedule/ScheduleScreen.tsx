import React from 'react';
import { View, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { ScreenLayout, EmptyState } from '@/components/common';
import { Text, Card, CardContent } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMyShifts, MyShift } from '@/hooks/useMyShifts';
import { Calendar, Clock, Coffee, MapPin, Flame, Trophy, Target } from 'lucide-react-native';
import { AnimatedEntrance, AnimatedListItem, STAGGER_DELAYS } from '@/lib/animations';

const ShiftCard = ({ shift, t }: { shift: MyShift; t: (key: string) => string }) => {
  const { isDark } = useTheme();
  const fromDate = new Date(shift.from_time);
  const toDate = new Date(shift.to_time);

  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';
  const accentColor = isDark ? '#6BBD68' : '#489A45';

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('sv-SE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  const durationMinutes = Math.round((toDate.getTime() - fromDate.getTime()) / 60000);
  const workMinutes = durationMinutes - (shift.breaks_duration || 0);
  const workHours = Math.floor(workMinutes / 60);
  const workMins = workMinutes % 60;

  const isToday = fromDate.toDateString() === new Date().toDateString();
  const isPast = fromDate < new Date();

  return (
    <Card
      variant="elevated"
      style={[styles.shiftCard, isToday && styles.todayCard, isPast && styles.pastCard]}
    >
      <CardContent>
        <View style={styles.shiftHeader}>
          <View style={styles.dateContainer}>
            <Calendar size={16} color={accentColor} />
            <Text variant="body-lg" style={[styles.dateText, { color: textColor }]}>
              {formatDate(fromDate)}
            </Text>
            {isToday && (
              <View style={[styles.todayBadge, { backgroundColor: accentColor }]}>
                <Text variant="tiny" style={{ color: '#FFFFFF' }}>
                  {t('common.today')}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.shiftDetails}>
          <View style={styles.detailRow}>
            <Clock size={16} color={mutedColor} />
            <Text variant="body" style={{ color: mutedColor }}>
              {formatTime(fromDate)} - {formatTime(toDate)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Coffee size={16} color={mutedColor} />
            <Text variant="body" style={{ color: mutedColor }}>
              {shift.breaks_duration} {t('schedule.breakMinutes')}
            </Text>
          </View>

          {shift.unit && shift.unit !== '-' && (
            <View style={styles.detailRow}>
              <MapPin size={16} color={mutedColor} />
              <Text variant="body" style={{ color: mutedColor }}>
                {shift.unit}
              </Text>
            </View>
          )}
        </View>

        <View
          style={[
            styles.durationBadge,
            { backgroundColor: isDark ? 'rgba(107,189,104,0.15)' : '#EDF5EC' },
          ]}
        >
          <Text variant="body-sm" style={{ color: accentColor }}>
            {workHours}h {workMins > 0 ? `${workMins}m` : ''} {t('schedule.workTime')}
          </Text>
        </View>
      </CardContent>
    </Card>
  );
};

export const ScheduleScreen = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { data: shifts, isLoading, error } = useMyShifts();

  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';
  const accentColor = isDark ? '#6BBD68' : '#489A45';

  // Calculate streak and stats
  const now = new Date();
  const upcomingShifts = (shifts || []).filter((s) => new Date(s.from_time) >= now);
  const pastShifts = (shifts || []).filter((s) => new Date(s.from_time) < now);
  const thisWeekShifts = upcomingShifts.filter((s) => {
    const shiftDate = new Date(s.from_time);
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return shiftDate <= weekFromNow;
  });

  const totalHoursThisWeek = thisWeekShifts.reduce((acc, shift) => {
    const from = new Date(shift.from_time);
    const to = new Date(shift.to_time);
    const hours = (to.getTime() - from.getTime()) / (1000 * 60 * 60);
    return acc + hours - (shift.breaks_duration || 0) / 60;
  }, 0);

  if (isLoading) {
    return (
      <ScreenLayout title={t('schedule.title')} scrollable={false} isRoot={true}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={isDark ? '#6BBD68' : '#489A45'} />
          <Text variant="body" style={{ color: mutedColor, marginTop: 16 }}>
            {t('common.loadingSchedule')}
          </Text>
        </View>
      </ScreenLayout>
    );
  }

  if (error) {
    return (
      <ScreenLayout title={t('schedule.title')} scrollable={false} isRoot={true}>
        <EmptyState
          icon={Calendar}
          title={t('schedule.couldNotLoad')}
          description={error.message}
        />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout title={t('schedule.title')} isRoot={true}>
      {upcomingShifts.length === 0 && pastShifts.length === 0 ? (
        <AnimatedEntrance preset="scaleIn">
          <View style={styles.emptyStateContainer}>
            <Image
              source={require('../../../assets/images/schedule.png')}
              style={styles.emptyImage}
              resizeMode="contain"
            />
            <Text variant="h2" style={[styles.emptyTitle, { color: textColor }]}>
              {t('schedule.noShifts')}
            </Text>
            <Text variant="body" style={[styles.emptyDescription, { color: mutedColor }]}>
              {t('schedule.noShiftsDesc')}
            </Text>
          </View>
        </AnimatedEntrance>
      ) : (
        <>
          {/* Stats Header */}
          <AnimatedEntrance preset="fadeInUpSubtle">
            <Card variant="elevated" style={styles.statsCard}>
              <CardContent>
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <View
                      style={[
                        styles.statIcon,
                        { backgroundColor: isDark ? 'rgba(239,68,68,0.15)' : '#FEE2E2' },
                      ]}
                    >
                      <Flame size={24} color="#EF4444" />
                    </View>
                    <Text variant="display" style={{ color: '#EF4444' }}>
                      {pastShifts.length}
                    </Text>
                    <Text variant="body-sm" style={{ color: mutedColor }}>
                      {t('schedule.streak')}
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <View
                      style={[
                        styles.statIcon,
                        { backgroundColor: isDark ? 'rgba(107,189,104,0.15)' : '#EDF5EC' },
                      ]}
                    >
                      <Target size={24} color={accentColor} />
                    </View>
                    <Text variant="display" style={{ color: accentColor }}>
                      {thisWeekShifts.length}
                    </Text>
                    <Text variant="body-sm" style={{ color: mutedColor }}>
                      {t('schedule.thisWeek')}
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <View
                      style={[
                        styles.statIcon,
                        { backgroundColor: isDark ? 'rgba(251,191,36,0.15)' : '#FEF3C7' },
                      ]}
                    >
                      <Trophy size={24} color="#F59E0B" />
                    </View>
                    <Text variant="display" style={{ color: '#F59E0B' }}>
                      {Math.round(totalHoursThisWeek)}
                    </Text>
                    <Text variant="body-sm" style={{ color: mutedColor }}>
                      {t('schedule.hours')}
                    </Text>
                  </View>
                </View>
              </CardContent>
            </Card>
          </AnimatedEntrance>

          {upcomingShifts.length > 0 && (
            <View style={styles.section}>
              <Text variant="h3" style={{ color: textColor, marginBottom: 12 }}>
                {t('schedule.upcomingShifts')} ({upcomingShifts.length})
              </Text>
              {upcomingShifts.map((shift, index) => (
                <AnimatedListItem
                  key={shift.shift_id || index}
                  index={index}
                  staggerDelay={STAGGER_DELAYS.fast}
                >
                  <ShiftCard shift={shift} t={t} />
                </AnimatedListItem>
              ))}
            </View>
          )}

          {pastShifts.slice(-5).length > 0 && (
            <View style={styles.section}>
              <Text variant="h3" style={{ color: textColor, marginBottom: 12 }}>
                {t('schedule.pastShifts')}
              </Text>
              {pastShifts.slice(-5).map((shift, index) => (
                <AnimatedListItem
                  key={shift.shift_id || index}
                  index={upcomingShifts.length + index}
                  staggerDelay={STAGGER_DELAYS.fast}
                >
                  <ShiftCard shift={shift} t={t} />
                </AnimatedListItem>
              ))}
            </View>
          )}
        </>
      )}
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ef4444',
    marginBottom: 8,
  },
  errorDetail: {
    color: '#6c757d',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  headerTitle: {
    color: '#1f2937',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  statsCard: {
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  statItem: {
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  emptyTitle: {
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDescription: {
    textAlign: 'center',
    lineHeight: 22,
  },
  sectionTitle: {
    color: '#6c757d',
    marginBottom: 12,
    fontWeight: '500',
  },
  shiftCard: {
    marginBottom: 12,
    backgroundColor: '#ffffff',
  },
  todayCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#0056b3',
  },
  pastCard: {
    opacity: 0.7,
  },
  shiftHeader: {
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    color: '#1f2937',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  todayBadge: {
    backgroundColor: '#0056b3',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  todayBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    marginVertical: 12,
  },
  shiftDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    color: '#4b5563',
  },
  durationBadge: {
    marginTop: 12,
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  durationText: {
    color: '#0056b3',
    fontWeight: '500',
    fontSize: 13,
  },
});

export default ScheduleScreen;
