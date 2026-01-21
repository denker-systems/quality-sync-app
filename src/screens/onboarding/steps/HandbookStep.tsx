import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Button, Surface, Checkbox, List } from 'react-native-paper';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react-native';

interface HandbookStepProps {
  content: Record<string, any>;
  stepData: Record<string, any>;
  onComplete: (data: Record<string, any>) => void;
  onSave: (data: Record<string, any>) => void;
}

export const HandbookStep: React.FC<HandbookStepProps> = ({
  content,
  stepData,
  onComplete,
  onSave,
}) => {
  console.log('📚 HANDBOOK_STEP render:', { stepData, readSections: stepData?.read_sections });
  const [hasReadAll, setHasReadAll] = useState(stepData?.has_read_all || false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [readSections, setReadSections] = useState<string[]>(stepData?.read_sections || []);

  interface Section {
    id: string;
    title: string;
    content: string;
  }

  const sections: Section[] = content?.sections || [
    {
      id: 'welcome',
      title: 'Välkommen',
      content: 'Välkommen till företaget! Vi är glada att ha dig med i teamet.',
    },
    {
      id: 'values',
      title: 'Våra värderingar',
      content: 'Vi värdesätter respekt, samarbete och professionalism i allt vi gör.',
    },
    {
      id: 'work_environment',
      title: 'Arbetsmiljö',
      content: 'Vi strävar efter en säker och hälsosam arbetsmiljö för alla anställda.',
    },
    {
      id: 'policies',
      title: 'Policyer',
      content: 'Här hittar du information om våra policyer gällande arbetstid, frånvaro och semester.',
    },
    {
      id: 'it_security',
      title: 'IT & Säkerhet',
      content: 'Information om hantering av företagsdata och IT-säkerhet.',
    },
    {
      id: 'contact',
      title: 'Kontaktinformation',
      content: 'Här hittar du kontaktuppgifter till HR, IT-support och andra avdelningar.',
    },
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const markSectionAsRead = (sectionId: string) => {
    if (!readSections.includes(sectionId)) {
      const newReadSections = [...readSections, sectionId];
      setReadSections(newReadSections);
      
      // Check if all sections are read
      if (newReadSections.length === sections.length) {
        setHasReadAll(true);
      }
    }
  };

  const handleComplete = () => {
    console.log('✅ HANDBOOK_STEP handleComplete:', { readSections, allRead: hasReadAll });
    onComplete({
      has_read_all: true,
      read_sections: readSections,
      completed_at: new Date().toISOString(),
    });
  };

  const handleSave = () => {
    onSave({
      has_read_all: hasReadAll,
      read_sections: readSections,
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Surface style={styles.card} elevation={1}>
        <View style={styles.header}>
          <BookOpen size={24} color="#0056b3" />
          <Text variant="titleLarge" style={styles.title}>
            Personalhandbok
          </Text>
        </View>
        
        <Text variant="bodyMedium" style={styles.description}>
          {content?.description || 'Läs igenom personalhandboken för att lära dig mer om företaget.'}
        </Text>

        <View style={styles.progressContainer}>
          <Text variant="bodySmall" style={styles.progressText}>
            {readSections.length} av {sections.length} avsnitt lästa
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(readSections.length / sections.length) * 100}%` }
              ]} 
            />
          </View>
        </View>
      </Surface>

      {/* Handbook Sections */}
      <Surface style={styles.sectionsCard} elevation={1}>
        {sections.map((section: Section, index: number) => {
          const isExpanded = expandedSections.includes(section.id);
          const isRead = readSections.includes(section.id);

          return (
            <View key={section.id}>
              <List.Item
                title={section.title}
                titleStyle={[
                  styles.sectionTitle,
                  isRead && styles.sectionTitleRead,
                ]}
                description={isRead ? 'Läst' : 'Ej läst'}
                descriptionStyle={[
                  styles.sectionStatus,
                  isRead && styles.sectionStatusRead,
                ]}
                left={() => (
                  <View style={[
                    styles.sectionNumber,
                    isRead && styles.sectionNumberRead,
                  ]}>
                    <Text style={[
                      styles.sectionNumberText,
                      isRead && styles.sectionNumberTextRead,
                    ]}>
                      {isRead ? '✓' : index + 1}
                    </Text>
                  </View>
                )}
                right={() => (
                  isExpanded 
                    ? <ChevronUp size={20} color="#6b7280" />
                    : <ChevronDown size={20} color="#6b7280" />
                )}
                onPress={() => toggleSection(section.id)}
              />
              
              {isExpanded && (
                <View style={styles.sectionContent}>
                  <Text variant="bodyMedium" style={styles.contentText}>
                    {section.content}
                  </Text>
                  {!isRead && (
                    <Button
                      mode="outlined"
                      onPress={() => markSectionAsRead(section.id)}
                      style={styles.markReadButton}
                    >
                      Markera som läst
                    </Button>
                  )}
                </View>
              )}
              
              {index < sections.length - 1 && <View style={styles.divider} />}
            </View>
          );
        })}
      </Surface>

      {/* Confirmation */}
      <Surface style={styles.confirmationCard} elevation={1}>
        <View style={styles.checkboxContainer}>
          <Checkbox
            status={hasReadAll ? 'checked' : 'unchecked'}
            onPress={() => {
              if (readSections.length === sections.length) {
                setHasReadAll(!hasReadAll);
              }
            }}
            disabled={readSections.length < sections.length}
          />
          <Text 
            variant="bodyMedium" 
            style={[
              styles.checkboxLabel,
              readSections.length < sections.length && styles.checkboxLabelDisabled,
            ]}
          >
            Jag har läst och förstått personalhandboken
          </Text>
        </View>
        {readSections.length < sections.length && (
          <Text variant="bodySmall" style={styles.warningText}>
            Läs alla avsnitt för att kunna fortsätta
          </Text>
        )}
      </Surface>

      <View style={styles.buttonContainer}>
        <Button mode="outlined" onPress={handleSave} style={styles.saveButton}>
          Spara utkast
        </Button>
        <Button 
          mode="contained" 
          onPress={handleComplete} 
          style={styles.submitButton}
          disabled={!hasReadAll}
        >
          Slutför
        </Button>
      </View>
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
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontWeight: '600',
  },
  description: {
    color: '#6b7280',
    marginBottom: 16,
  },
  progressContainer: {
    gap: 8,
  },
  progressText: {
    color: '#6b7280',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  sectionsCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '500',
  },
  sectionTitleRead: {
    color: '#10b981',
  },
  sectionStatus: {
    fontSize: 12,
    color: '#9ca3af',
  },
  sectionStatusRead: {
    color: '#10b981',
  },
  sectionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sectionNumberRead: {
    backgroundColor: '#d1fae5',
  },
  sectionNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  sectionNumberTextRead: {
    color: '#10b981',
  },
  sectionContent: {
    padding: 16,
    backgroundColor: '#f9fafb',
  },
  contentText: {
    lineHeight: 24,
    color: '#374151',
  },
  markReadButton: {
    marginTop: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  confirmationCard: {
    padding: 16,
    borderRadius: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    flex: 1,
  },
  checkboxLabelDisabled: {
    color: '#9ca3af',
  },
  warningText: {
    color: '#f59e0b',
    marginLeft: 40,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    marginBottom: 32,
  },
  saveButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
});
