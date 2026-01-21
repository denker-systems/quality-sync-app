import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, RefreshControl } from 'react-native';
import { Avatar, Card, Text, List, Button, Divider, ActivityIndicator, Dialog, Portal, Badge, useTheme as usePaperTheme } from 'react-native-paper';
import { useAuth } from '@/hooks/useAuth';
import { useMyEmployee } from '@/hooks/useMyEmployee';
import { useCompanyData } from '@/hooks/useCompanyData';
import { useMyOnboarding } from '@/hooks/useOnboarding';
import { useMyContracts } from '@/hooks/useContracts';
import { useMyShifts } from '@/hooks/useMyShifts';
import { useNavigation } from '@react-navigation/native';
import { InterviewBookingCard } from '@/components/profile/InterviewBookingCard';
import { AITokenUsageCard } from '@/components/profile/AITokenUsageCard';
import { CompanyInfoCard } from '@/components/profile/CompanyInfoCard';
import { ThemeListItem } from '@/components/common/ThemeToggle';

export const ProfileScreen = () => {
  const navigation = useNavigation();
  const paperTheme = usePaperTheme();
  const { user, signOut } = useAuth();
  const { data: employee, isLoading: employeeLoading, refetch: refetchEmployee } = useMyEmployee();
  const { company, loading: companyLoading } = useCompanyData();
  const { data: onboardingData, error: onboardingError } = useMyOnboarding(employee?.id);
  const { data: contracts, error: contractsError } = useMyContracts(employee?.id);
  const { data: shifts } = useMyShifts();
  const [refreshing, setRefreshing] = useState(false);
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);

  console.log('👤 PROFILE_SCREEN render:', {
    userId: user?.id,
    employeeId: employee?.id,
    companyId: company?.id,
    onboardingStatus: onboardingData?.onboarding?.status,
    contractsCount: contracts?.length || 0,
    shiftsCount: shifts?.length || 0,
    onboardingError: onboardingError?.message,
    contractsError: contractsError?.message,
  });

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
    await refetchEmployee();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    setLogoutDialogVisible(false);
    await signOut();
  };

  const isLoading = employeeLoading || companyLoading;

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: paperTheme.colors.background }]}>
        <ActivityIndicator size="large" color={paperTheme.colors.primary} />
        <Text style={[styles.loadingText, { color: paperTheme.colors.onSurfaceVariant }]}>Laddar profil...</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView 
        style={[styles.container, { backgroundColor: paperTheme.colors.background }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <Card style={styles.card}>
          <Card.Content style={styles.headerContent}>
            <Avatar.Text 
              size={80} 
              label={getInitials()} 
              style={[styles.avatar, { backgroundColor: paperTheme.colors.primary }]}
            />
            <Text variant="headlineSmall" style={[styles.name, { color: paperTheme.colors.onSurface }]}>
              {getDisplayName()}
            </Text>
            {company && (
              <View style={[styles.companyBadge, { backgroundColor: paperTheme.colors.secondaryContainer }]}>
                <List.Icon icon="office-building" color={paperTheme.colors.secondary} />
                <Text variant="bodyMedium" style={[styles.companyName, { color: paperTheme.colors.secondary }]}>
                  {company.name}
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Interview Booking - only shows if candidate has interview */}
        <InterviewBookingCard />

        {/* Quick Actions */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: paperTheme.colors.onSurface }]}>
              Snabbval
            </Text>
            <Divider style={styles.divider} />
            
            <List.Item
              title="Mitt Schema"
              description={shifts && shifts.length > 0 ? `${shifts.length} kommande skift` : 'Visa dina skift'}
              left={props => <List.Icon {...props} icon="calendar" />}
              right={() => shifts && shifts.length > 0 ? (
                <Badge style={styles.shiftsBadge}>{shifts.length}</Badge>
              ) : null}
              onPress={() => (navigation as any).navigate('Schedule')}
              titleStyle={[styles.listTitle, { color: paperTheme.colors.onSurface }]}
              descriptionStyle={[styles.listDescription, { color: paperTheme.colors.onSurfaceVariant }]}
            />
            
            <List.Item
              title="Redigera Profil"
              description="Uppdatera dina uppgifter"
              left={props => <List.Icon {...props} icon="account-edit" />}
              onPress={() => (navigation as any).navigate('EditProfile')}
              titleStyle={[styles.listTitle, { color: paperTheme.colors.onSurface }]}
              descriptionStyle={[styles.listDescription, { color: paperTheme.colors.onSurfaceVariant }]}
            />
          </Card.Content>
        </Card>

        {/* Onboarding & Contracts Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: paperTheme.colors.onSurface }]}>
              Mina Uppgifter
            </Text>
            <Divider style={styles.divider} />
            
            <List.Item
              title="Onboarding"
              description={
                onboardingData?.onboarding.status === 'completed' 
                  ? 'Slutförd' 
                  : onboardingData?.onboarding.status === 'in_progress'
                  ? 'Pågående'
                  : 'Väntande'
              }
              left={props => <List.Icon {...props} icon="star-circle" />}
              right={() => (
                onboardingData?.onboarding.status === 'completed' ? (
                  <Badge style={styles.completedBadge}>✓</Badge>
                ) : (
                  <Badge style={styles.pendingBadge}>
                    {`${onboardingData?.progress.filter(p => p.status === 'completed').length || 0}/${onboardingData?.steps.length || 0}`}
                  </Badge>
                )
              )}
              onPress={() => (navigation as any).navigate('Onboarding')}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
            />
            
            <List.Item
              title="Avtal"
              description={`${contracts?.length || 0} signerade avtal`}
              left={props => <List.Icon {...props} icon="file-document" />}
              right={() => contracts && contracts.length > 0 ? (
                <Badge style={styles.contractsBadge}>{contracts.length}</Badge>
              ) : null}
              onPress={() => (navigation as any).navigate('Contracts')}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
            />
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

        {/* Company Info */}
        <CompanyInfoCard />

        {/* AI Token Usage */}
        <AITokenUsageCard />

        {/* Settings Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Inställningar
            </Text>
            <Divider style={styles.divider} />
            
            <ThemeListItem />
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

// Note: Using dynamic theming - colors will be applied via paperTheme
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  completedBadge: {
    backgroundColor: '#10b981',
    color: '#ffffff',
  },
  pendingBadge: {
    backgroundColor: '#f59e0b',
    color: '#ffffff',
  },
  contractsBadge: {
    backgroundColor: '#0056b3',
    color: '#ffffff',
  },
  shiftsBadge: {
    backgroundColor: '#22c55e',
    color: '#ffffff',
  },
});
