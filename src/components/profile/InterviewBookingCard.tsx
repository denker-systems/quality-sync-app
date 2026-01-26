import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Button, Surface } from 'react-native-paper';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react-native';
import { useCandidateBooking } from '@/hooks/useCandidateBooking';

export const InterviewBookingCard = () => {
  const { booking, isLoading, confirmInterview } = useCandidateBooking();

  console.log('📆 INTERVIEW_BOOKING_CARD render:', {
    hasBooking: !!booking,
    step: booking?.step,
    isLoading,
  });

  if (isLoading) {
    return null;
  }

  // Visa bara intervjukortet för kandidater i steg 2 (efter intervjuinbjudan)
  if (!booking || !booking.interview_date || !booking.interview_time || booking.step !== 2) {
    return null;
  }

  const formattedDate = new Date(booking.interview_date).toLocaleDateString('sv-SE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const isConfirmed = booking.note?.includes('bekräftad');

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <Calendar size={20} color="#0056b3" />
          <Text variant="titleMedium" style={styles.title}>
            Intervjuinbjudan
          </Text>
        </View>

        <Text variant="bodyMedium" style={styles.subtitle}>
          Du har blivit inbjuden till en intervju
        </Text>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Calendar size={16} color="#6c757d" />
            <View>
              <Text variant="labelMedium" style={styles.label}>
                Datum
              </Text>
              <Text variant="bodyMedium" style={styles.value}>
                {formattedDate}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Clock size={16} color="#6c757d" />
            <View>
              <Text variant="labelMedium" style={styles.label}>
                Tid
              </Text>
              <Text variant="bodyMedium" style={styles.value}>
                {booking.interview_time}
              </Text>
            </View>
          </View>
        </View>

        {!isConfirmed ? (
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={() => confirmInterview.mutate({ candidateId: booking.id, confirmed: true })}
              loading={confirmInterview.isPending}
              style={styles.confirmButton}
              buttonColor="#22c55e"
              icon={() => <CheckCircle size={18} color="#ffffff" />}
            >
              Bekräfta tid
            </Button>
            <Button
              mode="outlined"
              onPress={() => confirmInterview.mutate({ candidateId: booking.id, confirmed: false })}
              loading={confirmInterview.isPending}
              style={styles.rescheduleButton}
              icon={() => <XCircle size={18} color="#6c757d" />}
            >
              Ny tid
            </Button>
          </View>
        ) : (
          <Surface style={styles.confirmedBadge}>
            <CheckCircle size={20} color="#22c55e" />
            <Text style={styles.confirmedText}>Intervjutid bekräftad</Text>
          </Surface>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    marginBottom: 8,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  title: {
    color: '#1e40af',
    fontWeight: '600',
  },
  subtitle: {
    color: '#6b7280',
    marginBottom: 16,
  },
  details: {
    gap: 12,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  label: {
    color: '#6b7280',
    fontSize: 12,
  },
  value: {
    color: '#1f2937',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  confirmButton: {
    flex: 1,
  },
  rescheduleButton: {
    flex: 1,
  },
  confirmedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#dcfce7',
    borderRadius: 8,
  },
  confirmedText: {
    color: '#166534',
    fontWeight: '500',
  },
});

export default InterviewBookingCard;
