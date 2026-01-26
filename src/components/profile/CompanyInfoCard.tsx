import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, List, Divider } from 'react-native-paper';
import { Building2 } from 'lucide-react-native';
import { useCompanyData } from '@/hooks/useCompanyData';

export const CompanyInfoCard = () => {
  const { company, loading } = useCompanyData();

  console.log('🏢 COMPANY_INFO_CARD render:', {
    hasCompany: !!company,
    companyName: company?.name,
    loading,
  });

  if (loading || !company) {
    return null;
  }

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <Building2 size={20} color="#997328" />
          <Text variant="titleMedium" style={styles.title}>
            Mitt Företag
          </Text>
        </View>

        <Divider style={styles.divider} />

        <List.Item
          title="Företagsnamn"
          description={company.name || '-'}
          left={(props) => <List.Icon {...props} icon="office-building" />}
          titleStyle={styles.listTitle}
          descriptionStyle={styles.listDescription}
        />

        {company.address && (
          <List.Item
            title="Adress"
            description={company.address}
            left={(props) => <List.Icon {...props} icon="map-marker" />}
            titleStyle={styles.listTitle}
            descriptionStyle={styles.listDescription}
          />
        )}

        {company.contact_email && (
          <List.Item
            title="Kontakt Email"
            description={company.contact_email}
            left={(props) => <List.Icon {...props} icon="email" />}
            titleStyle={styles.listTitle}
            descriptionStyle={styles.listDescription}
          />
        )}

        {company.organization_number && (
          <List.Item
            title="Organisationsnummer"
            description={company.organization_number}
            left={(props) => <List.Icon {...props} icon="identifier" />}
            titleStyle={styles.listTitle}
            descriptionStyle={styles.listDescription}
          />
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  title: {
    color: '#997328',
    fontWeight: '600',
  },
  divider: {
    marginBottom: 8,
  },
  listTitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  listDescription: {
    fontSize: 14,
    color: '#1f2937',
  },
});

export default CompanyInfoCard;
