import React, { useEffect } from 'react';
import { StyleSheet, View, ScrollView, Image, Linking } from 'react-native';
import { Text, Button, Surface } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { FileText, Video as VideoIcon, Image as ImageIcon, ExternalLink } from 'lucide-react-native';

interface CustomStepProps {
  content: {
    title?: string;
    description?: string;
    body_text?: string;
    media_url?: string;
    media_type?: 'image' | 'video' | 'document' | 'link';
    button_text?: string;
    button_url?: string;
  };
  stepData: Record<string, any>;
  onComplete: (data: Record<string, any>) => void;
  onSave: (data: Record<string, any>) => void;
  submitRef?: React.MutableRefObject<(() => void) | null>;
}

/**
 * CustomStep - Anpassat steg med flexibelt innehåll
 * Stöder: text, bilder, video, dokument och externa länkar
 */
export const CustomStep: React.FC<CustomStepProps> = ({
  content,
  onComplete,
  submitRef,
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';
  const accentColor = isDark ? '#6BBD68' : '#489A45';

  const handleContinue = () => {
    onComplete({ viewed: true, viewed_at: new Date().toISOString() });
  };

  useEffect(() => {
    if (submitRef) {
      submitRef.current = handleContinue;
    }
    return () => {
      if (submitRef) {
        submitRef.current = null;
      }
    };
  }, [submitRef]);

  const handleOpenLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  const renderMedia = () => {
    if (!content.media_url) return null;

    switch (content.media_type) {
      case 'image':
        return (
          <View style={styles.mediaContainer}>
            <Image 
              source={{ uri: content.media_url }}
              style={styles.image}
              resizeMode="contain"
            />
            {content.title && (
              <Text variant="body-sm" style={[styles.caption, { color: mutedColor }]}>
                {content.title}
              </Text>
            )}
          </View>
        );

      case 'video':
        return (
          <Surface style={styles.mediaCard} elevation={0}>
            <VideoIcon size={48} color={accentColor} />
            <Text variant="body" style={{ color: textColor, marginTop: 8 }}>
              {content.title || t('onboarding.custom.video')}
            </Text>
            <Button 
              variant="outline" 
              onPress={() => handleOpenLink(content.media_url!)}
              style={styles.mediaButton}
            >
              {t('onboarding.custom.openVideo')}
            </Button>
          </Surface>
        );

      case 'document':
        return (
          <Surface style={styles.mediaCard} elevation={0}>
            <FileText size={48} color="#3b82f6" />
            <Text variant="body" style={{ color: textColor, marginTop: 8 }}>
              {content.title || t('onboarding.custom.document')}
            </Text>
            <Button 
              variant="outline" 
              onPress={() => handleOpenLink(content.media_url!)}
              style={styles.mediaButton}
            >
              <ExternalLink size={16} color={accentColor} style={{ marginRight: 8 }} />
              {t('onboarding.custom.open')}
            </Button>
          </Surface>
        );

      case 'link':
        return (
          <Surface style={styles.mediaCard} elevation={0}>
            <ExternalLink size={48} color="#3b82f6" />
            <Text variant="body" style={{ color: textColor, marginTop: 8 }}>
              {content.title || t('onboarding.custom.externalLink')}
            </Text>
            <Text variant="body-sm" style={{ color: mutedColor, marginTop: 4 }}>
              {content.media_url}
            </Text>
            <Button 
              variant="outline" 
              onPress={() => handleOpenLink(content.media_url!)}
              style={styles.mediaButton}
            >
              {t('onboarding.custom.visit')}
            </Button>
          </Surface>
        );

      default:
        return null;
    }
  };

  const hasContent = content.title || content.body_text || content.media_url;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Surface style={styles.card} elevation={0}>
        {/* Rubrik */}
        {content.title && (
          <View style={styles.titleContainer}>
            <Text variant="h2" style={[styles.title, { color: textColor }]}>
              {content.title}
            </Text>
            {content.description && (
              <Text variant="body-lg" style={[styles.description, { color: mutedColor }]}>
                {content.description}
              </Text>
            )}
          </View>
        )}

        {/* Media */}
        {renderMedia()}

        {/* Brödtext */}
        {content.body_text && (
          <View style={styles.bodyTextContainer}>
            <Text variant="body" style={[styles.bodyText, { color: textColor }]}>
              {content.body_text}
            </Text>
          </View>
        )}

        {/* Call-to-action knapp */}
        {content.button_url && (
          <View style={styles.ctaContainer}>
            <Button 
              variant="primary"
              onPress={() => handleOpenLink(content.button_url!)}
            >
              {content.button_text || t('onboarding.custom.readMore')}
            </Button>
          </View>
        )}

        {/* Fallback om inget innehåll finns */}
        {!hasContent && (
          <View style={styles.emptyState}>
            <FileText size={64} color={mutedColor} style={{ opacity: 0.5 }} />
            <Text variant="body-lg" style={[styles.emptyTitle, { color: textColor }]}>
              {t('onboarding.custom.emptyTitle')}
            </Text>
            <Text variant="body-sm" style={{ color: mutedColor, textAlign: 'center', marginTop: 8 }}>
              {t('onboarding.custom.emptyDescription')}
            </Text>
          </View>
        )}
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  titleContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  description: {
    marginTop: 8,
    textAlign: 'center',
  },
  mediaContainer: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 12,
  },
  caption: {
    marginTop: 8,
    textAlign: 'center',
  },
  mediaCard: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  mediaButton: {
    marginTop: 16,
  },
  bodyTextContainer: {
    marginBottom: 24,
  },
  bodyText: {
    lineHeight: 24,
  },
  ctaContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  emptyState: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 18,
  },
});
