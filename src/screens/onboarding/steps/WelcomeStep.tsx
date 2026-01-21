import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Button, Surface } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
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
  const { isDark } = useTheme();
  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';
  const accentColor = isDark ? '#6BBD68' : '#489A45';
  
  const handleStart = () => {
    console.log('🚀 WELCOME_STEP handleStart clicked');
    onComplete({ started: true, started_at: new Date().toISOString() });
  };
  return (
    <View style={styles.container}>
      <Surface style={styles.card} elevation={2}>
        <View style={styles.iconContainer}>
          <PartyPopper size={64} color={accentColor} />
        </View>
        
        <Text variant="h2" style={[styles.title, { color: textColor }]}>
          Välkommen{employeeName ? `, ${employeeName}` : ''}!
        </Text>
        
        <Text variant="body-lg" style={[styles.description, { color: mutedColor }]}>
          {content?.welcome_message || 
            'Vi är glada att ha dig med i teamet! Denna onboarding kommer hjälpa dig att komma igång.'}
        </Text>

        {content?.company_info && (
          <View style={[styles.infoSection, { backgroundColor: isDark ? '#1A1A1A' : '#f3f4f6' }]}>
            <Text variant="h4" style={[styles.infoTitle, { color: textColor }]}>
              Om företaget
            </Text>
            <Text variant="body" style={{ color: mutedColor }}>
              {content.company_info}
            </Text>
          </View>
        )}

        <View style={[styles.checklistContainer, { backgroundColor: isDark ? 'rgba(107,189,104,0.1)' : '#EDF5EC' }]}>
          <Text variant="h4" style={[styles.checklistTitle, { color: accentColor }]}>
            Vad du kommer att göra:
          </Text>
          <View style={styles.checklistItem}>
            <Text variant="body" style={{ color: textColor }}>✓ Fylla i dina personuppgifter</Text>
          </View>
          <View style={styles.checklistItem}>
            <Text variant="body" style={{ color: textColor }}>✓ Lägga till nödkontakt</Text>
          </View>
          <View style={styles.checklistItem}>
            <Text variant="body" style={{ color: textColor }}>✓ Ange bankuppgifter för lön</Text>
          </View>
          <View style={styles.checklistItem}>
            <Text variant="body" style={{ color: textColor }}>✓ Signera anställningsavtal</Text>
          </View>
          <View style={styles.checklistItem}>
            <Text variant="body" style={{ color: textColor }}>✓ Läsa igenom personalhandboken</Text>
          </View>
        </View>
      </Surface>

      <Button variant="primary" onPress={handleStart} style={styles.button}>
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
