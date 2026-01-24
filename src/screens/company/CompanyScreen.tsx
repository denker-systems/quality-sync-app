import React from 'react';
import { View, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { ScreenLayout } from '@/components/common';
import { MenuButton } from '@/components/common/MenuButton';
import { Text, Card, CardContent, Badge } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCompanyData } from '@/hooks/useCompanyData';
import { 
  Building2, 
  Mail, 
  MapPin, 
  Hash,
  CreditCard,
  Users,
  Calendar,
  TrendingUp,
  Award,
  CheckCircle,
} from 'lucide-react-native';
import { AnimatedEntrance, AnimatedListItem, SPRING_CONFIGS, STAGGER_DELAYS } from '@/lib/animations';

interface InfoRowProps {
  icon: React.ComponentType<{ size: number; color: string }>;
  label: string;
  value: string | null | undefined;
}

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  const { isDark } = useTheme();
  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';
  const iconColor = isDark ? '#6BBD68' : '#489A45';

  if (!value) return null;

  return (
    <View style={styles.infoRow}>
      <Icon size={18} color={iconColor} />
      <View style={styles.infoText}>
        <Text variant="body-sm" style={{ color: mutedColor }}>{label}</Text>
        <Text variant="body" style={{ color: textColor }}>{value}</Text>
      </View>
    </View>
  );
}

export function CompanyScreen() {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { company, loading, error } = useCompanyData();

  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';
  const accentColor = isDark ? '#6BBD68' : '#489A45';
  const iconBgColor = isDark ? 'rgba(107,189,104,0.15)' : '#EDF5EC';

  if (loading) {
    return (
      <ScreenLayout title={t('company.title')} isRoot={true}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={accentColor} />
          <Text variant="body" style={{ color: mutedColor, marginTop: 16 }}>
            {t('company.loading')}
          </Text>
        </View>
      </ScreenLayout>
    );
  }

  if (error || !company) {
    return (
      <ScreenLayout title={t('company.title')} headerRight={<MenuButton />}>
        <View style={styles.loadingContainer}>
          <Building2 size={48} color={mutedColor} />
          <Text variant="h3" style={{ color: textColor, marginTop: 16 }}>
            {t('company.noCompany')}
          </Text>
          <Text variant="body" style={{ color: mutedColor, marginTop: 8, textAlign: 'center' }}>
            {t('company.noCompanyDesc')}
          </Text>
        </View>
      </ScreenLayout>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('sv-SE');
  };

  const getSubscriptionStatus = (status: string) => {
    switch (status) {
      case 'active': return t('company.subscriptionActive');
      case 'trial': return t('company.subscriptionTrial');
      case 'canceled': return t('company.subscriptionCanceled');
      default: return status;
    }
  };

  return (
    <ScreenLayout title={t('company.title')} isRoot={true}>
      {/* Company Header with Stats */}
      <AnimatedEntrance preset="scaleIn">
        <Card variant="elevated" style={styles.headerCard}>
          <CardContent>
            <View style={styles.headerContent}>
              <View style={[styles.companyIcon, { backgroundColor: iconBgColor }]}>
                <Building2 size={32} color={accentColor} />
              </View>
              <View style={styles.headerText}>
                <Text variant="h2" style={{ color: textColor }}>{company.name}</Text>
                {company.organization_number && (
                  <Text variant="body-sm" style={{ color: mutedColor }}>
                    {t('company.orgNumber')}: {company.organization_number}
                  </Text>
                )}
                {company.is_active && (
                  <View style={{ marginTop: 8 }}>
                    <Badge variant="success">
                      {t('common.active')}
                    </Badge>
                  </View>
                )}
              </View>
            </View>
            
            {/* Company Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: isDark ? 'rgba(107,189,104,0.15)' : '#EDF5EC' }]}>
                  <Users size={20} color={accentColor} />
                </View>
                <Text variant="display" style={{ color: accentColor }}>{company.employee_limit || 0}</Text>
                <Text variant="body-sm" style={{ color: mutedColor }}>{t('company.employees')}</Text>
              </View>
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: isDark ? 'rgba(251,191,36,0.15)' : '#FEF3C7' }]}>
                  <TrendingUp size={20} color="#F59E0B" />
                </View>
                <Text variant="display" style={{ color: '#F59E0B' }}>{company.subscription_plan || 'Starter'}</Text>
                <Text variant="body-sm" style={{ color: mutedColor }}>Plan</Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </AnimatedEntrance>

      {/* Contact Information */}
      <AnimatedListItem index={0} staggerDelay={STAGGER_DELAYS.medium}>
        <View style={styles.section}>
          <Text variant="h3" style={[styles.sectionTitle, { color: textColor }]}>
            {t('company.contactInfo')}
          </Text>
          <Card variant="elevated">
            <CardContent>
              <InfoRow 
                icon={Mail} 
                label={t('company.email')} 
                value={company.contact_email} 
              />
              {company.contact_email && company.address && (
                <View style={[styles.divider, { backgroundColor: isDark ? '#2E2E2E' : '#E5E5E5' }]} />
              )}
              <InfoRow 
                icon={MapPin} 
                label={t('company.address')} 
                value={company.address} 
              />
            </CardContent>
          </Card>
        </View>
      </AnimatedListItem>

      {/* Subscription Information */}
      <AnimatedListItem index={1} staggerDelay={STAGGER_DELAYS.medium}>
        <View style={styles.section}>
          <Text variant="h3" style={[styles.sectionTitle, { color: textColor }]}>
            {t('company.subscription')}
          </Text>
          <Card variant="elevated">
            <CardContent>
            <InfoRow 
              icon={CreditCard} 
              label={t('company.plan')} 
              value={company.subscription_plan} 
            />
            <View style={[styles.divider, { backgroundColor: isDark ? '#2E2E2E' : '#E5E5E5' }]} />
            <InfoRow 
              icon={Hash} 
              label={t('company.status')} 
              value={getSubscriptionStatus(company.subscription_status)} 
            />
            {company.trial_ends_at && (
              <>
                <View style={[styles.divider, { backgroundColor: isDark ? '#2E2E2E' : '#E5E5E5' }]} />
                <InfoRow 
                  icon={Calendar} 
                  label={t('company.trialEnds')} 
                  value={formatDate(company.trial_ends_at)} 
                />
              </>
            )}
            <View style={[styles.divider, { backgroundColor: isDark ? '#2E2E2E' : '#E5E5E5' }]} />
            <InfoRow 
              icon={Users} 
              label={t('company.employeeLimit')} 
              value={`${company.employee_limit} ${t('company.employees')}`} 
            />
          </CardContent>
        </Card>
        </View>
      </AnimatedListItem>

      {/* Company Details */}
      <AnimatedListItem index={2} staggerDelay={STAGGER_DELAYS.medium}>
        <View style={styles.section}>
        <Text variant="h3" style={[styles.sectionTitle, { color: textColor }]}>
          {t('company.other')}
        </Text>
        <Card variant="elevated">
          <CardContent>
            <InfoRow 
              icon={Calendar} 
              label={t('company.registered')} 
              value={formatDate(company.created_at)} 
            />
            <View style={[styles.divider, { backgroundColor: isDark ? '#2E2E2E' : '#E5E5E5' }]} />
            <InfoRow 
              icon={Hash} 
              label={t('company.status')} 
              value={company.is_active ? t('common.active') : t('common.inactive')} 
            />
          </CardContent>
        </Card>
        </View>
      </AnimatedListItem>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  headerCard: {
    marginBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    marginLeft: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  statItem: {
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
  },
  divider: {
    height: 1,
  },
});

export default CompanyScreen;
