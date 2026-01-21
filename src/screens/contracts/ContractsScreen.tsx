import React from 'react';
import { StyleSheet, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ScreenLayout, EmptyState } from '@/components/common';
import { Text, Card, CardContent, Badge } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { useMyEmployee } from '@/hooks/useMyEmployee';
import { useMyContracts, SignedContract } from '@/hooks/useContracts';
import { FileText, Calendar, Eye, CheckCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export const ContractsScreen = () => {
  const navigation = useNavigation();
  const { isDark } = useTheme();
  const { data: employee } = useMyEmployee();
  const { data: contracts, isLoading, error } = useMyContracts(employee?.id);
  
  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';
  const accentColor = isDark ? '#6BBD68' : '#489A45';

  const getTypeText = (type: string) => {
    switch (type) {
      case 'employment': return 'Anställning';
      case 'nda': return 'Sekretess';
      case 'custom': return 'Övrigt';
      default: return 'Avtal';
    }
  };

  const handleViewContract = (contract: SignedContract) => {
    (navigation as any).navigate('ContractViewer', { contractId: contract.id });
  };

  if (isLoading) {
    return (
      <ScreenLayout title="Avtal" scrollable={false}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={accentColor} />
          <Text variant="body" style={{ color: mutedColor, marginTop: 16 }}>
            Laddar avtal...
          </Text>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout title="Avtal">

      {contracts && contracts.length > 0 ? (
        <View style={styles.contractsList}>
          {contracts.map((contract) => (
            <TouchableOpacity
              key={contract.id}
              onPress={() => handleViewContract(contract)}
              activeOpacity={0.7}
            >
              <Card variant="elevated" style={styles.contractCard}>
                <CardContent>
                  <View style={styles.contractHeader}>
                    <View style={styles.contractTitleRow}>
                      <FileText size={20} color={accentColor} />
                      <Text variant="body-lg" style={{ color: textColor, flex: 1 }}>
                        {contract.contract_title}
                      </Text>
                    </View>
                    <Eye size={16} color={mutedColor} />
                  </View>

                  <View style={styles.contractMeta}>
                    <Badge variant="default">{getTypeText(contract.contract_type)}</Badge>
                    <View style={styles.dateRow}>
                      <Calendar size={14} color={mutedColor} />
                      <Text variant="body-sm" style={{ color: mutedColor }}>
                        Signerat {new Date(contract.signed_at).toLocaleDateString('sv-SE')}
                      </Text>
                    </View>
                  </View>

                  {contract.pdf_url && (
                    <View style={styles.pdfIndicator}>
                      <CheckCircle size={14} color="#10b981" />
                      <Text variant="body-sm" style={{ color: '#10b981' }}>
                        PDF tillgänglig
                      </Text>
                    </View>
                  )}
                </CardContent>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <EmptyState
          icon={FileText}
          title="Inga avtal hittades"
          description="Dina anställningsavtal och dokument kommer att visas här när de blir tillgängliga."
        />
      )}
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    borderRadius: 8,
  },
  headerSubtext: {
    color: '#6b7280',
    marginTop: 4,
  },
  contractsList: {
    gap: 12,
  },
  contractCard: {
    marginBottom: 12,
  },
  contractHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  contractTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  contractTitle: {
    flex: 1,
  },
  contractMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    color: '#6b7280',
  },
  pdfIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  pdfText: {
    color: '#10b981',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
    minHeight: 300,
  },
  emptyTitle: {
    textAlign: 'center',
    marginTop: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
  },
});
