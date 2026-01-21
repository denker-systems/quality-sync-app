import React from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Text, Card, Surface, Divider, ActivityIndicator } from 'react-native-paper';
import { SafeAreaWrapper } from '@/components/SafeAreaWrapper';
import { useMyShifts, MyShift } from '@/hooks/useMyShifts';
import { Calendar, Clock, Coffee, MapPin } from 'lucide-react-native';

const ShiftCard = ({ shift }: { shift: MyShift }) => {
  const fromDate = new Date(shift.from_time);
  const toDate = new Date(shift.to_time);
  
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
    <Card style={[styles.shiftCard, isToday && styles.todayCard, isPast && styles.pastCard]}>
      <Card.Content>
        <View style={styles.shiftHeader}>
          <View style={styles.dateContainer}>
            <Calendar size={16} color="#0056b3" />
            <Text variant="titleMedium" style={styles.dateText}>
              {formatDate(fromDate)}
            </Text>
            {isToday && (
              <Surface style={styles.todayBadge}>
                <Text style={styles.todayBadgeText}>Idag</Text>
              </Surface>
            )}
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.shiftDetails}>
          <View style={styles.detailRow}>
            <Clock size={16} color="#6c757d" />
            <Text variant="bodyMedium" style={styles.detailText}>
              {formatTime(fromDate)} - {formatTime(toDate)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Coffee size={16} color="#6c757d" />
            <Text variant="bodyMedium" style={styles.detailText}>
              {shift.breaks_duration} min rast
            </Text>
          </View>

          {shift.unit && shift.unit !== '-' && (
            <View style={styles.detailRow}>
              <MapPin size={16} color="#6c757d" />
              <Text variant="bodyMedium" style={styles.detailText}>
                {shift.unit}
              </Text>
            </View>
          )}
        </View>

        <Surface style={styles.durationBadge}>
          <Text style={styles.durationText}>
            {workHours}h {workMins > 0 ? `${workMins}m` : ''} arbetstid
          </Text>
        </Surface>
      </Card.Content>
    </Card>
  );
};

export const ScheduleScreen = () => {
  const { data: shifts, isLoading, error, refetch } = useMyShifts();
  const [refreshing, setRefreshing] = React.useState(false);

  console.log('📅 SCHEDULE_SCREEN render:', {
    isLoading,
    shiftsCount: shifts?.length || 0,
    error: error?.message,
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Separera kommande och tidigare skift
  const now = new Date();
  const upcomingShifts = (shifts || []).filter(s => new Date(s.from_time) >= now);
  const pastShifts = (shifts || []).filter(s => new Date(s.from_time) < now).slice(-5);

  if (isLoading) {
    return (
      <SafeAreaWrapper>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0056b3" />
          <Text style={styles.loadingText}>Laddar schema...</Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  if (error) {
    return (
      <SafeAreaWrapper>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Kunde inte ladda schema</Text>
          <Text style={styles.errorDetail}>{error.message}</Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.header}>
          <Calendar size={24} color="#0056b3" />
          <Text variant="headlineSmall" style={styles.headerTitle}>
            Mitt Schema
          </Text>
        </View>

        {upcomingShifts.length === 0 && pastShifts.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Calendar size={48} color="#6c757d" />
              <Text variant="titleMedium" style={styles.emptyTitle}>
                Inga skift
              </Text>
              <Text variant="bodyMedium" style={styles.emptyText}>
                Du har inga schemalagda skift just nu.
              </Text>
            </Card.Content>
          </Card>
        ) : (
          <>
            {upcomingShifts.length > 0 && (
              <View style={styles.section}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Kommande skift ({upcomingShifts.length})
                </Text>
                {upcomingShifts.map((shift, index) => (
                  <ShiftCard key={shift.shift_id || index} shift={shift} />
                ))}
              </View>
            )}

            {pastShifts.length > 0 && (
              <View style={styles.section}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Tidigare skift
                </Text>
                {pastShifts.map((shift, index) => (
                  <ShiftCard key={shift.shift_id || index} shift={shift} />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaWrapper>
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
