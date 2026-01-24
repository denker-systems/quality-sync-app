import React from 'react';
import { StyleSheet, View, ActivityIndicator, ScrollView, Image } from 'react-native';
import Animated from 'react-native-reanimated';
import { ScreenLayout, EmptyState } from '@/components/common';
import { Text, Card, CardContent, Badge } from '@/components/ui';
import { ContractDocument } from '@/components/ui/ContractDocument';
import { useTheme } from '@/contexts/ThemeContext';
import { useContract } from '@/hooks/useContracts';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { FileText, PenTool, CheckCircle, Calendar } from 'lucide-react-native';
import type { RootStackParamList } from '@/types';
import { AnimatedEntrance } from '@/lib/animations';

type ContractViewerRouteProp = RouteProp<RootStackParamList, 'ContractViewer'>;

export const ContractViewerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<ContractViewerRouteProp>();
  const { contractId } = route.params;
  const { isDark } = useTheme();
  
  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';
  const accentColor = isDark ? '#6BBD68' : '#489A45';
  
  const { data: contract, isLoading, error } = useContract(contractId);

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

  if (error || !contract) {
    return (
      <ScreenLayout title="Avtal" scrollable={false}>
        <EmptyState
          icon={FileText}
          title="Kunde inte ladda avtal"
          description={error?.message || 'Avtalet hittades inte.'}
          actionLabel="Tillbaka"
          onAction={() => navigation.goBack()}
        />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout title="Avtal" scrollable={false} noPadding>
      {/* Contract Info */}
      {/* @ts-expect-error sharedTransitionTag is supported at runtime */}
      <Animated.View sharedTransitionTag={`contract-${contractId}`}>
        <Card variant="elevated" style={styles.infoCard}>
          <CardContent style={styles.headerContent}>
            <View style={[styles.headerImageContainer, { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }]}>
              <Image 
                source={require('../../../assets/images/contract.png')} 
                style={styles.headerImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.headerText}>
              <Text variant="h3" style={{ color: textColor }}>
                {contract.contract_title}
              </Text>
              <View style={styles.headerMeta}>
                <Calendar size={14} color={mutedColor} />
                <Text variant="body-sm" style={{ color: mutedColor }}>
                  Signerat {new Date(contract.signed_at).toLocaleDateString('sv-SE')}
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </Animated.View>

      {/* Contract Content */}
      <ScrollView style={styles.contentScroll} contentContainerStyle={styles.contentScrollInner}>
        {/* Contract Type Badge */}
        <AnimatedEntrance preset="fadeInUp" delay={100}>
          <View style={styles.badgeContainer}>
            <Badge variant="default">
              {contract.contract_type === 'employment' ? 'Anställningsavtal' : 
               contract.contract_type === 'nda' ? 'Sekretessavtal' : 'Avtal'}
            </Badge>
            <View style={styles.dateRow}>
              <Calendar size={14} color={mutedColor} />
              <Text variant="body-sm" style={{ color: mutedColor }}>
                Signerat {new Date(contract.signed_at).toLocaleDateString('sv-SE')}
              </Text>
            </View>
          </View>
        </AnimatedEntrance>

        {/* Contract Content */}
        <AnimatedEntrance preset="fadeInUp" delay={200}>
          <Card variant="elevated" style={styles.contentCard}>
            <CardContent>
              <ContractDocument content={contract.contract_content || ''} />
            </CardContent>
          </Card>
        </AnimatedEntrance>

        {/* Signature Section */}
        {contract.signature_data?.signature && (
          <AnimatedEntrance preset="scaleIn" delay={300}>
            <Card variant="elevated" style={styles.signatureCard}>
              <CardContent>
                <View style={styles.signatureHeader}>
                  <PenTool size={20} color={accentColor} />
                  <Text variant="h3" style={{ color: textColor }}>Digital signatur</Text>
                </View>
                
                {/* Signature Status */}
                <View style={styles.signatureStatus}>
                  <CheckCircle size={20} color={accentColor} />
                  <View style={styles.signatureStatusText}>
                    <Text variant="body" style={{ color: textColor, fontWeight: '600' }}>
                      Signerat digitalt
                    </Text>
                    <Text variant="body-sm" style={{ color: mutedColor }}>
                      {new Date(contract.signed_at).toLocaleString('sv-SE')}
                    </Text>
                  </View>
                </View>

                {/* Signature Image */}
                <View style={styles.signatureImageContainer}>
                  <Text variant="body-sm" style={{ color: mutedColor, marginBottom: 8 }}>Signatur:</Text>
                  <View style={[styles.signatureImageBox, { backgroundColor: isDark ? '#0F0F0F' : '#FFFFFF', borderColor: isDark ? '#3D3D3D' : '#E5E5E5' }]}>
                    <Image
                      source={{ uri: contract.signature_data.signature }}
                      style={styles.signatureImage}
                      resizeMode="contain"
                    />
                  </View>
                </View>
              </CardContent>
            </Card>
          </AnimatedEntrance>
        )}
      </ScrollView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: '#6b7280',
  },
  infoCard: {
    margin: 16,
    marginBottom: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  errorTitle: {
    textAlign: 'center',
  },
  errorText: {
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 8,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  headerImage: {
    width: 56,
    height: 56,
  },
  headerText: {
    flex: 1,
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  signedDate: {
    color: '#6b7280',
    marginTop: 2,
  },
  contentContainer: {
    flex: 1,
  },
  contentScroll: {
    flex: 1,
  },
  contentScrollInner: {
    padding: 16,
    paddingBottom: 32,
  },
  badgeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contentCard: {
    marginBottom: 16,
  },
  signatureCard: {
    marginTop: 8,
  },
  signatureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  signatureStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  signatureStatusText: {
    flex: 1,
  },
  signatureImageContainer: {
    marginTop: 8,
  },
  signatureImageBox: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  signatureImage: {
    width: '100%',
    height: 100,
  },
});
