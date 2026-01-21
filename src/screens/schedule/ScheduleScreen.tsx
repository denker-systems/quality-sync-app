import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { ScreenLayout, EmptyState } from '@/components/common';
import { Text, Card, CardContent } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { useMyShifts, MyShift } from '@/hooks/useMyShifts';
import { Calendar, Clock, Coffee, MapPin } from 'lucide-react-native';

const ShiftCard = ({ shift }: { shift: MyShift }) => {
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
      month: 'long' 
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
                <Text variant="tiny" style={{ color: '#FFFFFF' }}>Idag</Text>
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
              {shift.breaks_duration} min rast
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

        <View style={[styles.durationBadge, { backgroundColor: isDark ? 'rgba(107,189,104,0.15)' : '#EDF5EC' }]}>
          <Text variant="body-sm" style={{ color: accentColor }}>
            {workHours}h {workMins > 0 ? `${workMins}m` : ''} arbetstid
          </Text>
        </View>
      </CardContent>
    </Card>
  );
};

export const ScheduleScreen = () => {
  const { isDark } = useTheme();
  const { data: shifts, isLoading, error, refetch } = useMyShifts();
  const [refreshing, setRefreshing] = React.useState(false);
  
  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const now = new Date();
  const upcomingShifts = (shifts || []).filter(s => new Date(s.from_time) >= now);
  const pastShifts = (shifts || []).filter(s => new Date(s.from_time) < now).slice(-5);

  if (isLoading) {
    return (
      <ScreenLayout title="Schema" scrollable={false}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={isDark ? '#6BBD68' : '#489A45'} />
          <Text variant="body" style={{ color: mutedColor, marginTop: 16 }}>
            Laddar schema...
          </Text>
        </View>
      </ScreenLayout>
    );
  }

  if (error) {
    return (
      <ScreenLayout title="Schema" scrollable={false}>
        <EmptyState
          icon={Calendar}
          title="Kunde inte ladda schema"
          description={error.message}
        />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout title="Schema">

      {upcomingShifts.length === 0 && pastShifts.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="Inga skift"
          description="Du har inga schemalagda skift just nu."
        />
      ) : (
        <>
          {upcomingShifts.length > 0 && (
            <View style={styles.section}>
              <Text variant="h3" style={{ color: textColor, marginBottom: 12 }}>
                Kommande skift ({upcomingShifts.length})
              </Text>
              {upcomingShifts.map((shift, index) => (
                <ShiftCard key={shift.shift_id || index} shift={shift} />
              ))}
            </View>
          )}

          {pastShifts.length > 0 && (
            <View style={styles.section}>
              <Text variant="h3" style={{ color: textColor, marginBottom: 12 }}>
                Tidigare skift
              </Text>
              {pastShifts.map((shift, index) => (
                <ShiftCard key={shift.shift_id || index} shift={shift} />
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
    paddingHorizontal: 16,
    marginBottom: 24,
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
  emptyCard: {
    margin: 16,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    marginTop: 16,
    color: '#1f2937',
  },
  emptyText: {
    marginTop: 8,
    color: '#6c757d',
    textAlign: 'center',
  },
});

export default ScheduleScreen;
