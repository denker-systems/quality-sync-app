import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';
import { PartyPopper, ArrowRight } from 'lucide-react-native';

interface WelcomeStepProps {
  content: Record<string, any>;
  stepData: Record<string, any>;
  onComplete: (data: Record<string, any>) => void;
  onSave: (data: Record<string, any>) => void;
  employeeName?: string;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({
  content,
  onComplete,
  employeeName,
}) => {
  console.log('👋 WELCOME_STEP render:', { employeeName, content });
  
  const handleStart = () => {
    console.log('🚀 WELCOME_STEP handleStart clicked');
    onComplete({ started: true, started_at: new Date().toISOString() });
  };
  return (
    <View style={styles.container}>
      <Surface style={styles.card} elevation={2}>
        <View style={styles.iconContainer}>
          <PartyPopper size={64} color="#997328" />
        </View>
        
        <Text variant="headlineMedium" style={styles.title}>
          Välkommen{employeeName ? `, ${employeeName}` : ''}!
        </Text>
        
        <Text variant="bodyLarge" style={styles.description}>
          {content?.welcome_message || 
            'Vi är glada att ha dig med i teamet! Denna onboarding kommer hjälpa dig att komma igång.'}
        </Text>

        {content?.company_info && (
          <View style={styles.infoSection}>
            <Text variant="titleMedium" style={styles.infoTitle}>
              Om företaget
            </Text>
            <Text variant="bodyMedium" style={styles.infoText}>
              {content.company_info}
            </Text>
          </View>
        )}

        <View style={styles.checklistContainer}>
          <Text variant="titleMedium" style={styles.checklistTitle}>
            Vad du kommer att göra:
          </Text>
          <View style={styles.checklistItem}>
            <Text variant="bodyMedium">✓ Fylla i dina personuppgifter</Text>
          </View>
          <View style={styles.checklistItem}>
            <Text variant="bodyMedium">✓ Lägga till nödkontakt</Text>
          </View>
          <View style={styles.checklistItem}>
            <Text variant="bodyMedium">✓ Ange bankuppgifter för lön</Text>
          </View>
          <View style={styles.checklistItem}>
            <Text variant="bodyMedium">✓ Signera anställningsavtal</Text>
          </View>
          <View style={styles.checklistItem}>
            <Text variant="bodyMedium">✓ Läsa igenom personalhandboken</Text>
          </View>
        </View>
      </Surface>

      <Button
        mode="contained"
        onPress={handleStart}
        style={styles.button}
        contentStyle={styles.buttonContent}
        icon={({ size, color }) => <ArrowRight size={size} color={color} />}
      >
        Starta onboarding
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  },
  card: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 24,
  },
  infoSection: {
    width: '100%',
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    color: '#4b5563',
  },
  checklistContainer: {
    width: '100%',
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 8,
  },
  checklistTitle: {
    fontWeight: '600',
    marginBottom: 12,
    color: '#0056b3',
  },
  checklistItem: {
    paddingVertical: 4,
  },
  button: {
    marginTop: 8,
  },
  buttonContent: {
    flexDirection: 'row-reverse',
    paddingVertical: 8,
  },
});
