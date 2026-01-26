/**
 * DevConnectionModal - Shows connection info when QR code doesn't work
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Clipboard, Platform } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { useTheme } from '@/contexts/ThemeContext';
import { X, Copy, CheckCircle, Wifi, Smartphone } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';
import Constants from 'expo-constants';

interface DevConnectionModalProps {
  visible: boolean;
  onClose: () => void;
}

export function DevConnectionModal({ visible, onClose }: DevConnectionModalProps) {
  const { isDark } = useTheme();
  const [copied, setCopied] = useState(false);
  const [connectionUrl, setConnectionUrl] = useState<string>('');

  const bgColor = isDark ? '#171717' : '#F5F5F5';
  const cardBg = isDark ? '#262626' : '#FFFFFF';
  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#666666';
  const accentColor = isDark ? '#60A5FA' : '#3B82F6';
  const successColor = isDark ? '#22C55E' : '#16A34A';
  const qrBgColor = isDark ? '#FFFFFF' : '#FFFFFF';

  useEffect(() => {
    // Get the actual dev server URL from Expo
    const getDevUrl = () => {
      try {
        // Try to get the URL from Constants
        const hostUri = Constants.expoConfig?.hostUri;
        if (hostUri) {
          // Format: exp://IP:PORT
          const url = `exp://${hostUri}`;
          setConnectionUrl(url);
        } else {
          // Fallback to localhost
          setConnectionUrl('exp://localhost:8081');
        }
      } catch (error) {
        console.error('Failed to get dev URL:', error);
        setConnectionUrl('exp://localhost:8081');
      }
    };

    if (visible) {
      getDevUrl();
    }
  }, [visible]);

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tunnelCommand = 'npx expo start --tunnel';

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.container, { backgroundColor: bgColor }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: isDark ? '#404040' : '#E5E5E5' }]}>
            <View style={styles.headerContent}>
              <Wifi size={24} color={accentColor} />
              <Text variant="headlineSmall" style={[styles.title, { color: textColor }]}>
                Utvecklingsanslutning
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={mutedColor} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* QR Code */}
            {connectionUrl && (
              <View style={styles.qrContainer}>
                <Card style={[styles.qrCard, { backgroundColor: qrBgColor }]}>
                  <Card.Content style={styles.qrContent}>
                    <QRCode
                      value={connectionUrl}
                      size={200}
                      backgroundColor={qrBgColor}
                      color="#000000"
                    />
                  </Card.Content>
                </Card>
                <Text variant="bodySmall" style={[styles.qrLabel, { color: mutedColor }]}>
                  Scanna med Expo Go eller telefonens kamera
                </Text>
              </View>
            )}

            <Text variant="bodyMedium" style={[styles.description, { color: mutedColor }]}>
              Om QR-koden inte fungerar, använd någon av metoderna nedan:
            </Text>

            {/* Method 1: Phone Camera */}
            <Card style={[styles.methodCard, { backgroundColor: isDark ? '#404040' : '#F9F9F9' }]}>
              <Card.Content>
                <View style={styles.methodHeader}>
                  <Smartphone size={20} color={accentColor} />
                  <Text variant="titleMedium" style={[styles.methodTitle, { color: textColor }]}>
                    Metod 1: Telefonens kamera
                  </Text>
                </View>
                <Text variant="bodySmall" style={[styles.methodStep, { color: mutedColor }]}>
                  1. Öppna din telefons vanliga kamera-app
                </Text>
                <Text variant="bodySmall" style={[styles.methodStep, { color: mutedColor }]}>
                  2. Rikta mot QR-koden i terminalen
                </Text>
                <Text variant="bodySmall" style={[styles.methodStep, { color: mutedColor }]}>
                  3. Klicka på notifikationen → "Öppna i Expo Go"
                </Text>
              </Card.Content>
            </Card>

            {/* Method 2: Manual URL */}
            <Card style={[styles.methodCard, { backgroundColor: isDark ? '#404040' : '#F9F9F9' }]}>
              <Card.Content>
                <View style={styles.methodHeader}>
                  <Copy size={20} color={accentColor} />
                  <Text variant="titleMedium" style={[styles.methodTitle, { color: textColor }]}>
                    Metod 2: Manuell URL
                  </Text>
                </View>
                <Text variant="bodySmall" style={[styles.methodStep, { color: mutedColor }]}>
                  1. Öppna Expo Go → "Enter URL manually"
                </Text>
                <Text variant="bodySmall" style={[styles.methodStep, { color: mutedColor }]}>
                  2. Klistra in URL från terminalen (exp://...)
                </Text>

                <TouchableOpacity
                  style={[
                    styles.urlContainer,
                    { backgroundColor: cardBg, borderColor: isDark ? '#525252' : '#E5E5E5' },
                  ]}
                  onPress={() => copyToClipboard(connectionUrl)}
                >
                  <Text style={[styles.urlText, { color: textColor }]}>{connectionUrl}</Text>
                  {copied ? (
                    <CheckCircle size={18} color={successColor} />
                  ) : (
                    <Copy size={18} color={mutedColor} />
                  )}
                </TouchableOpacity>
                <Text variant="bodySmall" style={[styles.note, { color: mutedColor }]}>
                  💡 Kolla din terminal för rätt IP-adress
                </Text>
              </Card.Content>
            </Card>

            {/* Method 3: Tunnel */}
            <Card style={[styles.methodCard, { backgroundColor: isDark ? '#404040' : '#F9F9F9' }]}>
              <Card.Content>
                <View style={styles.methodHeader}>
                  <Wifi size={20} color={accentColor} />
                  <Text variant="titleMedium" style={[styles.methodTitle, { color: textColor }]}>
                    Metod 3: Tunnel Mode
                  </Text>
                </View>
                <Text variant="bodySmall" style={[styles.methodStep, { color: mutedColor }]}>
                  Om du är på olika nätverk, kör i terminalen:
                </Text>
                <TouchableOpacity
                  style={[
                    styles.commandContainer,
                    { backgroundColor: cardBg, borderColor: isDark ? '#525252' : '#E5E5E5' },
                  ]}
                  onPress={() => copyToClipboard(tunnelCommand)}
                >
                  <Text style={[styles.commandText, { color: textColor }]}>{tunnelCommand}</Text>
                  <Copy size={16} color={mutedColor} />
                </TouchableOpacity>
              </Card.Content>
            </Card>

            <Button mode="contained" onPress={onClose} style={styles.closeButtonBottom}>
              Stäng
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 16,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  qrCard: {
    padding: 16,
    alignItems: 'center',
  },
  qrContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrLabel: {
    marginTop: 12,
    textAlign: 'center',
  },
  description: {
    marginBottom: 16,
    textAlign: 'center',
  },
  methodCard: {
    marginBottom: 12,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  methodTitle: {
    fontWeight: '600',
  },
  methodStep: {
    marginBottom: 4,
    paddingLeft: 8,
  },
  urlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
  },
  urlText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 11,
    flex: 1,
  },
  commandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
  },
  commandText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 11,
    flex: 1,
  },
  note: {
    marginTop: 8,
    fontStyle: 'italic',
  },
  closeButtonBottom: {
    marginTop: 16,
  },
});
