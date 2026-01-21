import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Badge, Surface } from 'react-native-paper';
import { SafeAreaWrapper } from '@/components/SafeAreaWrapper';
import { useMyEmployee } from '@/hooks/useMyEmployee';
import { useMyContracts, SignedContract } from '@/hooks/useContracts';
import { FileText, Calendar, Eye } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export const ContractsScreen = () => {
  const navigation = useNavigation();
  const { data: employee } = useMyEmployee();
  const { data: contracts, isLoading, error } = useMyContracts(employee?.id);
  const [selectedContract, setSelectedContract] = useState<SignedContract | null>(null);

  console.log('📋 CONTRACTS_SCREEN render:', {
    employeeId: employee?.id,
    isLoading,
    contractsCount: contracts?.length || 0,
    error: error?.message,
  });

  const getTypeText = (type: string) => {
    switch (type) {
      case 'employment':
        return 'Anställning';
      case 'nda':
        return 'Sekretess';
      case 'custom':
        return 'Övrigt';
      default:
        return 'Avtal';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'employment':
        return '#0056b3';
      case 'nda':
        return '#997328';
      case 'custom':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const handleViewContract = (contract: SignedContract) => {
    console.log('👁️ CONTRACTS_SCREEN handleViewContract:', {
      contractId: contract.id,
      title: contract.contract_title,
    });
    setSelectedContract(contract);
    (navigation as any).navigate('ContractViewer', { contractId: contract.id });
  };

  if (isLoading) {
    return (
      <SafeAreaWrapper>
        <View style={styles.loadingContainer}>
          <Text>Laddar avtal...</Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <Surface style={styles.header} elevation={1}>
          <Text variant="headlineMedium">Avtal</Text>
          <Text variant="bodyMedium" style={styles.headerSubtext}>
            Dina anställningsavtal och dokument
          </Text>
        </Surface>

        {/* Contracts List */}
        {contracts && contracts.length > 0 ? (
          <View style={styles.contractsList}>
            {contracts.map((contract) => (
              <TouchableOpacity
                key={contract.id}
                onPress={() => handleViewContract(contract)}
                activeOpacity={0.7}
              >
                <Card style={styles.contractCard}>
                  <Card.Content>
                    <View style={styles.contractHeader}>
                      <View style={styles.contractTitleRow}>
                        <FileText size={20} color="#0056b3" />
                        <Text variant="titleMedium" style={styles.contractTitle}>
                          {contract.contract_title}
                        </Text>
                      </View>
                      <Eye size={16} color="#6b7280" />
                    </View>

                    <View style={styles.contractMeta}>
                      <Badge
                        style={[
                          styles.typeBadge,
                          { backgroundColor: getTypeColor(contract.contract_type) },
                        ]}
                      >
                        {getTypeText(contract.contract_type)}
                      </Badge>
                      <View style={styles.dateRow}>
                        <Calendar size={14} color="#6b7280" />
                        <Text variant="bodySmall" style={styles.dateText}>
                          Signerat {new Date(contract.signed_at).toLocaleDateString('sv-SE')}
                        </Text>
                      </View>
                    </View>

                    {contract.pdf_url && (
                      <View style={styles.pdfIndicator}>
                        <FileText size={14} color="#10b981" />
                        <Text variant="bodySmall" style={styles.pdfText}>
                          PDF tillgänglig
                        </Text>
                      </View>
                    )}
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <FileText size={48} color="#d1d5db" />
            <Text variant="headlineSmall" style={styles.emptyTitle}>
              Inga avtal hittades
            </Text>
            <Text variant="bodyMedium" style={styles.emptyText}>
              Dina anställningsavtal och dokument kommer att visas här när de blir tillgängliga.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaWrapper>
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
