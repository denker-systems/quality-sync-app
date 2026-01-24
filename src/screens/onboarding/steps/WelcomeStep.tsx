import React, { useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Text, Button, Surface } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { PartyPopper } from 'lucide-react-native';

interface WelcomeStepProps {
  content: Record<string, any>;
  stepData: Record<string, any>;
  onComplete: (data: Record<string, any>) => void;
  onSave: (data: Record<string, any>) => void;
  employeeName?: string;
  submitRef?: React.MutableRefObject<(() => void) | null>;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({
  content,
  onComplete,
  employeeName,
  submitRef,
}) => {
  const { isDark } = useTheme();
  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';
  const accentColor = isDark ? '#6BBD68' : '#489A45';
  
  const handleStart = () => {
    console.log('🚀 WELCOME_STEP handleStart clicked');
    onComplete({ started: true, started_at: new Date().toISOString() });
  };

  const title = content?.welcome_message || content?.message || 
    'Välkommen till vårt team! Vi är glada att ha dig ombord.';
    
  const description = content?.company_intro || content?.description || 
    'Vi är glada att ha dig ombord och ser fram emot att arbeta med dig.';

  const imageUrl = content?.welcome_image_url;

  useEffect(() => {
    if (submitRef) {
      submitRef.current = handleStart;
    }
    return () => {
      if (submitRef) {
        submitRef.current = null;
      }
    };
  }, [submitRef]);

  return (
    <>
      <Surface style={styles.card} elevation={0}>
        {imageUrl ? (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: imageUrl }} 
              style={styles.welcomeImage}
              resizeMode="contain"
            />
          </View>
        ) : (
          <View style={styles.iconContainer}>
            <PartyPopper size={64} color={accentColor} />
          </View>
        )}
        
        <Text variant="h2" style={[styles.title, { color: textColor }]}>
          {title}
        </Text>
        
        {content?.show_company_info !== false && (
          <Text variant="body-lg" style={[styles.description, { color: mutedColor }]}>
            {description}
          </Text>
        )}
      </Surface>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  iconContainer: {
    marginBottom: 24,
  },
  imageContainer: {
    marginBottom: 24,
    width: '100%',
    alignItems: 'center',
  },
  welcomeImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    textAlign: 'center',
    color: '#6b7280',
    lineHeight: 24,
  },
});
