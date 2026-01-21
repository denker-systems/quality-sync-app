import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Text, Button, Surface, ActivityIndicator } from 'react-native-paper';
import { SafeAreaWrapper } from '@/components/SafeAreaWrapper';
import { useContract } from '@/hooks/useContracts';
import { WebView } from 'react-native-webview';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { FileText, Download, ArrowLeft } from 'lucide-react-native';
import type { RootStackParamList } from '@/types';

type ContractViewerRouteProp = RouteProp<RootStackParamList, 'ContractViewer'>;

export const ContractViewerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<ContractViewerRouteProp>();
  const { contractId } = route.params;
  
  console.log('📄 CONTRACT_VIEWER_SCREEN render:', { contractId });
  
  const { data: contract, isLoading, error } = useContract(contractId);
  
  console.log('📄 CONTRACT_VIEWER_SCREEN data:', {
    isLoading,
    hasContract: !!contract,
    hasPdf: !!contract?.pdf_url,
    error: error?.message,
  });

  if (isLoading) {
    return (
      <SafeAreaWrapper>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0056b3" />
          <Text style={styles.loadingText}>Laddar avtal...</Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  if (error || !contract) {
    return (
      <SafeAreaWrapper>
        <View style={styles.errorContainer}>
          <FileText size={48} color="#ef4444" />
          <Text variant="headlineSmall" style={styles.errorTitle}>
            Kunde inte ladda avtal
          </Text>
          <Text variant="bodyMedium" style={styles.errorText}>
            {error?.message || 'Avtalet hittades inte.'}
          </Text>
          <Button mode="contained" onPress={() => navigation.goBack()}>
            Tillbaka
          </Button>
        </View>
      </SafeAreaWrapper>
    );
  }

  const hasPdf = !!contract.pdf_url;

  return (
    <SafeAreaWrapper edges={['left', 'right', 'bottom']}>
      {/* Contract Info Header */}
      <Surface style={styles.header} elevation={1}>
        <View style={styles.headerContent}>
          <FileText size={24} color="#0056b3" />
          <View style={styles.headerText}>
            <Text variant="titleMedium" numberOfLines={1}>
              {contract.contract_title}
            </Text>
            <Text variant="bodySmall" style={styles.signedDate}>
              Signerat {new Date(contract.signed_at).toLocaleDateString('sv-SE')}
            </Text>
          </View>
        </View>
      </Surface>

      {/* PDF Viewer or Content */}
      <View style={styles.contentContainer}>
        {hasPdf ? (
          <WebView
            source={{ uri: contract.pdf_url! }}
            style={styles.webview}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.webviewLoading}>
                <ActivityIndicator size="large" color="#0056b3" />
              </View>
            )}
          />
        ) : (
          <View style={styles.textContent}>
            <Text variant="bodyMedium" style={styles.contractText}>
              {contract.contract_content}
            </Text>
          </View>
        )}
      </View>

      {/* Actions */}
      {hasPdf && (
        <Surface style={styles.footer} elevation={2}>
          <Button
            mode="outlined"
            icon={({ size, color }) => <Download size={size} color={color} />}
            onPress={() => {
              // TODO: Implement PDF download
              console.log('Download PDF:', contract.pdf_url);
            }}
            style={styles.downloadButton}
          >
            Ladda ner PDF
          </Button>
        </Surface>
      )}
    </SafeAreaWrapper>
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
