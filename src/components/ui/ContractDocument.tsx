/**
 * Contract Document Component
 * 
 * Renders contract content with professional document styling
 * Supports H1-H6 headings and structured formatting
 */

import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/contexts/ThemeContext';

interface ContractDocumentProps {
  content: string;
}

export const ContractDocument = memo(function ContractDocument({ content }: ContractDocumentProps) {
  const { isDark } = useTheme();
  
  const textColor = isDark ? '#FAFAFA' : '#171717';
  const headingColor = isDark ? '#FFFFFF' : '#0F0F0F';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';

  // Parse content into sections
  const lines = content.split('\n');
  
  return (
    <View style={styles.document}>
      {lines.map((line, index) => {
        const trimmedLine = line.trim();
        
        // Skip empty lines
        if (!trimmedLine) {
          return <View key={index} style={styles.spacer} />;
        }

        // H1 - All caps titles (e.g., "ANSTÄLLNINGSAVTAL")
        if (trimmedLine === trimmedLine.toUpperCase() && trimmedLine.length > 3 && !trimmedLine.match(/^\d/)) {
          return (
            <Text key={index} variant="h1" style={[styles.h1, { color: headingColor }]}>
              {trimmedLine}
            </Text>
          );
        }

        // H2 - Numbered sections (e.g., "1. ANSTÄLLNINGENS OMFATTNING")
        if (trimmedLine.match(/^\d+\.\s+[A-ZÅÄÖ]/)) {
          return (
            <Text key={index} variant="h2" style={[styles.h2, { color: headingColor }]}>
              {trimmedLine}
            </Text>
          );
        }

        // H3 - Subsections with letters (e.g., "a) Arbetstid")
        if (trimmedLine.match(/^[a-z]\)|^[A-Z]\)/)) {
          return (
            <Text key={index} variant="h3" style={[styles.h3, { color: headingColor }]}>
              {trimmedLine}
            </Text>
          );
        }

        // H4 - Section labels (e.g., "ARBETSTAGARE:")
        if (trimmedLine.endsWith(':') && trimmedLine.length < 30) {
          return (
            <Text key={index} variant="body-lg" style={[styles.h4, { color: headingColor }]}>
              {trimmedLine}
            </Text>
          );
        }

        // Regular paragraph
        return (
          <Text key={index} variant="body" style={[styles.paragraph, { color: textColor }]}>
            {trimmedLine}
          </Text>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  document: {
    gap: 8,
  },
  spacer: {
    height: 12,
  },
  h1: {
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 1,
  },
  h2: {
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 12,
  },
  h3: {
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  h4: {
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
  },
  paragraph: {
    lineHeight: 24,
    marginBottom: 4,
  },
});

export default ContractDocument;
