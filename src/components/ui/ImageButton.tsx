import React from 'react';
import { TouchableOpacity, Image, ImageSourcePropType, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Text } from './Text';
import { Card, CardContent } from './Card';

interface ImageButtonProps {
  title: string;
  image?: ImageSourcePropType;
  onPress: () => void;
  disabled?: boolean;
}

export function ImageButton({ title, image, onPress, disabled = false }: ImageButtonProps) {
  const { isDark } = useTheme();
  const bgColor = isDark ? '#262626' : '#FFFFFF';
  const textColor = isDark ? '#FAFAFA' : '#171717';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
      style={styles.button}
    >
      <Card variant="elevated" style={[styles.card, { backgroundColor: bgColor }]}>
        <CardContent style={styles.cardContent}>
          {image && <Image source={image} style={styles.image} resizeMode="contain" />}
          <Text variant="body-lg" style={{ color: textColor, textAlign: 'center' }}>
            {title}
          </Text>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
  },
  card: {
    flex: 1,
    borderRadius: 16,
  },
  cardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  image: {
    width: 140,
    height: 140,
    marginBottom: 8,
  },
});

export default ImageButton;
