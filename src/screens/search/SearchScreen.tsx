import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenLayout } from '@/components/common';
import { 
  Search, 
  X,
  Calendar,
  FileText,
  User,
  Building2,
  Clock,
  ChevronRight,
} from 'lucide-react-native';
import { Text, Card, CardContent } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';

interface SearchResultProps {
  icon: React.ComponentType<{ size: number; color: string }>;
  title: string;
  subtitle: string;
  type: string;
  onPress: () => void;
}

function SearchResult({ icon: Icon, title, subtitle, type, onPress }: SearchResultProps) {
  const { isDark } = useTheme();
  const iconBgColor = isDark ? 'rgba(107,189,104,0.15)' : '#EDF5EC';
  const iconColor = isDark ? '#A8D5A2' : '#489A45';
  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.resultItem,
        pressed && { opacity: 0.7 }
      ]}
      onPress={onPress}
    >
      <View style={[styles.resultIcon, { backgroundColor: iconBgColor }]}>
        <Icon size={20} color={iconColor} />
      </View>
      <View style={styles.resultText}>
        <Text variant="body-lg" style={{ color: textColor }}>{title}</Text>
        <Text variant="body-sm" style={{ color: mutedColor }}>{subtitle}</Text>
      </View>
      <View style={styles.resultType}>
        <Text variant="caption" style={{ color: mutedColor }}>{type}</Text>
        <ChevronRight size={16} color={mutedColor} />
      </View>
    </Pressable>
  );
}

const quickSearchItems = [
  { icon: Calendar, title: 'Mitt schema', subtitle: 'Se kommande skift', type: 'Schema', screen: 'Schedule' },
  { icon: FileText, title: 'Mina avtal', subtitle: 'Kontrakt och dokument', type: 'Dokument', screen: 'Contracts' },
  { icon: User, title: 'Min profil', subtitle: 'Personuppgifter', type: 'Profil', screen: 'Profile' },
  { icon: Building2, title: 'Företagsinformation', subtitle: 'Kontaktuppgifter', type: 'Info', screen: 'Profile' },
  { icon: Clock, title: 'Tidrapport', subtitle: 'Registrera tid', type: 'Tid', screen: 'Schedule' },
];

export function SearchScreen() {
  const navigation = useNavigation<any>();
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const inputBgColor = isDark ? '#1A1A1A' : '#FFFFFF';
  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';
  const borderColor = isDark ? '#2E2E2E' : '#E5E5E5';

  const filteredItems = searchQuery
    ? quickSearchItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : quickSearchItems;

  const handleSearch = (screen: string) => {
    navigation.navigate(screen);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <ScreenLayout title="Sök" showBack={false}>
      {/* Search Input */}
      <View style={[styles.searchInputContainer, { backgroundColor: inputBgColor, borderColor }]}>
        <Search size={20} color={mutedColor} />
        <TextInput
          style={[styles.searchInput, { color: textColor }]}
          placeholder="Sök i appen..."
          placeholderTextColor={mutedColor}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoFocus={false}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={clearSearch}>
            <X size={20} color={mutedColor} />
          </Pressable>
        )}
      </View>

      {/* Quick Search Section */}
      <View style={styles.section}>
        <Text variant="h3" style={[styles.sectionTitle, { color: textColor }]}>
          {searchQuery ? 'Sökresultat' : 'Snabbsök'}
        </Text>

        <Card variant="elevated">
          <CardContent style={styles.resultsContainer}>
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <React.Fragment key={item.title}>
                  <SearchResult
                    icon={item.icon}
                    title={item.title}
                    subtitle={item.subtitle}
                    type={item.type}
                    onPress={() => handleSearch(item.screen)}
                  />
                  {index < filteredItems.length - 1 && (
                    <View style={[styles.divider, { backgroundColor: borderColor }]} />
                  )}
                </React.Fragment>
              ))
            ) : (
              <View style={styles.noResults}>
                <Search size={48} color={mutedColor} />
                <Text variant="body-lg" style={{ color: mutedColor, marginTop: 16 }}>
                  Inga resultat hittades
                </Text>
                <Text variant="body-sm" style={{ color: mutedColor, marginTop: 4 }}>
                  Försök med andra sökord
                </Text>
              </View>
            )}
          </CardContent>
        </Card>
      </View>

      {/* Recent Searches */}
      {!searchQuery && (
        <View style={styles.section}>
          <Text variant="h3" style={[styles.sectionTitle, { color: textColor }]}>
            Senaste sökningar
          </Text>
          <Card variant="elevated">
            <CardContent>
              <View style={styles.recentSearches}>
                <Text variant="body" style={{ color: mutedColor, textAlign: 'center' }}>
                  Inga senaste sökningar
                </Text>
              </View>
            </CardContent>
          </Card>
        </View>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchHeader: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  resultsContainer: {
    paddingVertical: 0,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  resultIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultText: {
    flex: 1,
    marginLeft: 12,
  },
  resultType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    marginLeft: 52,
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  recentSearches: {
    paddingVertical: 16,
  },
});

export default SearchScreen;
