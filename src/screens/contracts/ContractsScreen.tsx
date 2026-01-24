import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { MotiPressable } from 'moti/interactions';
import Animated from 'react-native-reanimated';
import { ScreenLayout, EmptyState } from '@/components/common';
import { Text, Card, CardContent, Badge } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { AnimatedEntrance, AnimatedListItem, SPRING_CONFIGS, useLiftPress, STAGGER_DELAYS } from '@/lib/animations';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMyEmployee } from '@/hooks/useMyEmployee';
import { useMyContracts, SignedContract } from '@/hooks/useContracts';
import { FileText, Calendar, Eye, CheckCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export const ContractsScreen = () => {
  const navigation = useNavigation();
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { data: employee } = useMyEmployee();
  const { data: contracts, isLoading, error } = useMyContracts(employee?.id);
  
  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';
  const accentColor = isDark ? '#6BBD68' : '#489A45';

  const getTypeText = (type: string) => {
    switch (type) {
      case 'employment': return t('contracts.employment');
      case 'nda': return t('contracts.nda');
      case 'custom': return t('contracts.custom');
      default: return t('contracts.contract');
    }
  };

  const handleViewContract = (contract: SignedContract) => {
    (navigation as any).navigate('ContractViewer', { contractId: contract.id });
  };

  if (isLoading) {
    return (
      <ScreenLayout title={t('contracts.title')} scrollable={false}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={accentColor} />
          <Text variant="body" style={{ color: mutedColor, marginTop: 16 }}>
            {t('contracts.loading')}
          </Text>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout title={t('contracts.title')} isRoot={true}>
      {contracts && contracts.length > 0 ? (
        <>
          {/* Progress Header */}
          <AnimatedEntrance preset="fadeInUpSubtle">
            <Card variant="elevated" style={styles.progressCard}>
              <CardContent>
                <View style={styles.progressHeader}>
                  <View style={styles.progressInfo}>
                    <Text variant="h2" style={{ color: accentColor }}>{contracts.length}</Text>
                    <Text variant="body-sm" style={{ color: mutedColor }}>{t('contracts.totalSigned')}</Text>
                  </View>
                  <View style={[styles.completionBadge, { backgroundColor: isDark ? 'rgba(107,189,104,0.15)' : '#EDF5EC' }]}>
                    <CheckCircle size={24} color={accentColor} />
                    <Text variant="body" style={{ color: accentColor, fontWeight: '600', marginLeft: 8 }}>100%</Text>
                  </View>
                </View>
              </CardContent>
            </Card>
          </AnimatedEntrance>

          <View style={styles.contractsList}>
            {contracts.map((contract, index) => (
            <AnimatedListItem key={contract.id} index={index} staggerDelay={STAGGER_DELAYS.medium}>
              {/* @ts-expect-error sharedTransitionTag is supported at runtime */}
              <Animated.View sharedTransitionTag={`contract-${contract.id}`}>
                <MotiPressable
                  onPress={() => handleViewContract(contract)}
                  animate={useLiftPress()}
                  transition={SPRING_CONFIGS.snappy}
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
                            {t('contracts.signed')} {new Date(contract.signed_at).toLocaleDateString('sv-SE')}
                          </Text>
                        </View>
                      </View>

                      {contract.pdf_url && (
                        <View style={styles.pdfIndicator}>
                          <CheckCircle size={14} color="#10b981" />
                          <Text variant="body-sm" style={{ color: '#10b981' }}>
                            {t('contracts.pdfAvailable')}
                          </Text>
                        </View>
                      )}
                    </CardContent>
                  </Card>
                </MotiPressable>
              </Animated.View>
            </AnimatedListItem>
          ))}
          </View>
        </>
      ) : (
        <EmptyState
          icon={FileText}
          title={t('contracts.noContracts')}
          description={t('contracts.noContractsDesc')}
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
  progressCard: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressInfo: {
    alignItems: 'flex-start',
  },
  completionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
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
