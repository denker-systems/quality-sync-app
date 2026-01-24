import React from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import { ScreenLayout, EmptyState } from '@/components/common';
import { Text, Card, CardContent, Button } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { useContract } from '@/hooks/useContracts';
import { WebView } from 'react-native-webview';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { FileText, Download } from 'lucide-react-native';
import type { RootStackParamList } from '@/types';

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

  const hasPdf = !!contract.pdf_url;

  return (
    <ScreenLayout title="Avtal" scrollable={false} noPadding>
      {/* Contract Info */}
      {/* @ts-expect-error sharedTransitionTag is supported at runtime */}
      <Animated.View sharedTransitionTag={`contract-${contractId}`}>
        <Card variant="elevated" style={styles.infoCard}>
          <CardContent style={styles.headerContent}>
            <FileText size={24} color={accentColor} />
            <View style={styles.headerText}>
              <Text variant="body-lg" style={{ color: textColor }}>
                {contract.contract_title}
              </Text>
              <Text variant="body-sm" style={{ color: mutedColor }}>
                Signerat {new Date(contract.signed_at).toLocaleDateString('sv-SE')}
              </Text>
            </View>
          </CardContent>
        </Card>
      </Animated.View>

      {/* PDF Viewer or Content */}
      <View style={styles.contentContainer}>
        {hasPdf ? (
          <WebView
            source={{ uri: contract.pdf_url! }}
            style={styles.webview}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.webviewLoading}>
                <ActivityIndicator size="large" color={accentColor} />
              </View>
            )}
          />
        ) : (
          <View style={styles.textContent}>
            <Text variant="body" style={{ color: textColor, lineHeight: 24 }}>
              {contract.contract_content}
            </Text>
          </View>
        )}
      </View>

      {/* Download Button */}
      {hasPdf && (
        <View style={styles.footer}>
          <Button
            variant="outline"
            onPress={() => console.log('Download PDF:', contract.pdf_url)}
            style={styles.downloadButton}
          >
            Ladda ner PDF
          </Button>
        </View>
      )}
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
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  signedDate: {
    color: '#6b7280',
    marginTop: 2,
  },
  contentContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  webviewLoading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  textContent: {
    flex: 1,
    padding: 16,
  },
  contractText: {
    lineHeight: 24,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  downloadButton: {
    width: '100%',
  },
});
