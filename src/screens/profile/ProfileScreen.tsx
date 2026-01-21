import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, RefreshControl } from 'react-native';
import { Avatar, Card, Text, List, Button, Divider, ActivityIndicator, Dialog, Portal } from 'react-native-paper';
import { useAuth } from '@/hooks/useAuth';
import { useMyEmployee } from '@/hooks/useMyEmployee';
import { useCompanyData } from '@/hooks/useCompanyData';

export const ProfileScreen = () => {
  const { user, signOut } = useAuth();
  const { data: employee, isLoading, refetch } = useMyEmployee();
  const { company } = useCompanyData();
  const [refreshing, setRefreshing] = useState(false);
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);

  const getInitials = () => {
    if (employee?.first_name && employee?.last_name) {
      return `${employee.first_name[0]}${employee.last_name[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || '?';
  };

  const getDisplayName = () => {
    if (employee?.full_name) return employee.full_name;
    if (employee?.first_name || employee?.last_name) {
      return `${employee.first_name || ''} ${employee.last_name || ''}`.trim();
    }
    return user?.email || 'Användare';
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    setLogoutDialogVisible(false);
    await signOut();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0056b3" />
        <Text style={styles.loadingText}>Laddar profil...</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <Card style={styles.card}>
          <Card.Content style={styles.headerContent}>
            <Avatar.Text 
              size={80} 
              label={getInitials()} 
              style={styles.avatar}
            />
            <Text variant="headlineSmall" style={styles.name}>
              {getDisplayName()}
            </Text>
            {company && (
              <View style={styles.companyBadge}>
                <List.Icon icon="office-building" color="#997328" />
                <Text variant="bodyMedium" style={styles.companyName}>
                  {company.name}
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Kontaktinformation
            </Text>
            <Divider style={styles.divider} />
            
            {employee?.email && (
              <List.Item
                title="Email"
                description={employee.email}
                left={props => <List.Icon {...props} icon="email" />}
                titleStyle={styles.listTitle}
                descriptionStyle={styles.listDescription}
              />
            )}
            
            {employee?.phone && (
              <List.Item
                title="Telefon"
                description={employee.phone}
                left={props => <List.Icon {...props} icon="phone" />}
                titleStyle={styles.listTitle}
                descriptionStyle={styles.listDescription}
              />
            )}
            
            <List.Item
              title="Roll"
              description={employee?.role || 'Sjuksköterska'}
              left={props => <List.Icon {...props} icon="briefcase" />}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
            />

            {employee?.personal_identity_number && (
              <List.Item
                title="Personnummer"
                description={employee.personal_identity_number}
                left={props => <List.Icon {...props} icon="card-account-details" />}
                titleStyle={styles.listTitle}
                descriptionStyle={styles.listDescription}
              />
            )}
          </Card.Content>
        </Card>

        <Button 
          mode="outlined" 
          onPress={() => setLogoutDialogVisible(true)}
          style={styles.logoutButton}
          icon="logout"
          textColor="#ef4444"
        >
          Logga ut
        </Button>
      </ScrollView>

      <Portal>
        <Dialog visible={logoutDialogVisible} onDismiss={() => setLogoutDialogVisible(false)}>
          <Dialog.Title>Logga ut</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">Är du säker på att du vill logga ut?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setLogoutDialogVisible(false)}>Avbryt</Button>
            <Button onPress={handleLogout} textColor="#ef4444">Logga ut</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    color: '#6c757d',
  },
  card: {
    margin: 16,
    marginBottom: 8,
  },
  headerContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  avatar: {
    backgroundColor: '#0056b3',
    marginBottom: 16,
  },
  name: {
    fontWeight: 'bold',
    color: '#1f1f1f',
    marginBottom: 8,
  },
  companyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff8e1',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginTop: 8,
  },
  companyName: {
    color: '#997328',
    fontWeight: '500',
    marginLeft: -8,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#1f1f1f',
    marginBottom: 8,
  },
  divider: {
    marginBottom: 8,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f1f1f',
  },
  listDescription: {
    fontSize: 14,
    color: '#6c757d',
  },
  logoutButton: {
    margin: 16,
    marginTop: 8,
    borderColor: '#ef4444',
  },
});
