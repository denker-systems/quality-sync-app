import React from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MotiView } from 'moti';
import { ScreenLayout } from '@/components/common';
import { Text, Card, CardContent, Avatar, Badge, Button } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { SPRING_CONFIGS, STAGGER_DELAYS } from '@/constants/animations';
import { Award, Zap, TrendingUp } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { useMyEmployee } from '@/hooks/useMyEmployee';
import { useCompanyData } from '@/hooks/useCompanyData';
import { useMyOnboarding } from '@/hooks/useOnboarding';
import { useMyContracts } from '@/hooks/useContracts';
import { useMyShifts } from '@/hooks/useMyShifts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';
import { useNavigation } from '@react-navigation/native';
import { 
  Calendar, 
  FileText, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Building2,
  ChevronRight,
  Star,
  LogOut,
  Settings,
  Edit,
} from 'lucide-react-native';

interface MenuItemProps {
  icon: React.ComponentType<{ size: number; color: string }>;
  title: string;
  subtitle?: string;
  onPress: () => void;
  rightContent?: React.ReactNode;
}

function MenuItem({ icon: Icon, title, subtitle, onPress, rightContent }: MenuItemProps) {
  const { isDark } = useTheme();
  const iconBgColor = isDark ? 'rgba(107,189,104,0.15)' : '#F0F0F0';
  const iconColor = isDark ? '#A8D5A2' : '#666666';
  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';

  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.menuIcon, { backgroundColor: iconBgColor }]}>
        <Icon size={20} color={iconColor} />
      </View>
      <View style={styles.menuText}>
        <Text variant="body-lg" style={{ color: textColor }}>{title}</Text>
        {subtitle && <Text variant="body-sm" style={{ color: mutedColor }}>{subtitle}</Text>}
      </View>
      {rightContent || <ChevronRight size={20} color={mutedColor} />}
    </TouchableOpacity>
  );
}

export const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  
  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';
  const accentColor = isDark ? '#6BBD68' : '#489A45';
  const cardBg = isDark ? '#1A1A1A' : '#FFFFFF';
  
  const { data: employee, isLoading: employeeLoading } = useMyEmployee();
  const { company, loading: companyLoading } = useCompanyData();
  const { data: onboardingData } = useMyOnboarding(employee?.id);
  const { data: contracts } = useMyContracts(employee?.id);
  const { data: shifts } = useMyShifts();
  
  // Fallback: Get user_profiles data if no employee
  const { data: userProfile } = useQuery({
    queryKey: ['user-profile', user?.id],
    enabled: !!user?.id && !employee,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('first_name, last_name, email, company_id')
        .eq('id', user!.id)
        .single();
      if (error) throw error;
      return data as { first_name: string | null; last_name: string | null; email: string | null; company_id: string | null };
    },
  });

  const getInitials = () => {
    const firstName = employee?.first_name || userProfile?.first_name;
    const lastName = employee?.last_name || userProfile?.last_name;
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || '?';
  };

  const getDisplayName = () => {
    if (employee?.full_name) return employee.full_name;
    if (employee?.first_name || employee?.last_name) {
      return `${employee.first_name || ''} ${employee.last_name || ''}`.trim();
    }
    // Fallback to user_profiles
    if (userProfile?.first_name || userProfile?.last_name) {
      return `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim();
    }
    return user?.email || t('common.user');
  };

  const handleLogout = async () => {
    await signOut();
  };

  const isLoading = employeeLoading || companyLoading;

  if (isLoading) {
    return (
      <ScreenLayout title={t('profile.title')} scrollable={false} isRoot={true}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={accentColor} />
          <Text variant="body" style={{ color: mutedColor, marginTop: 16 }}>
            {t('common.loadingProfile')}
          </Text>
        </View>
      </ScreenLayout>
    );
  }

  const completedOnboarding = onboardingData?.progress?.filter(p => p.status === 'completed').length || 0;
  const totalOnboarding = onboardingData?.steps?.length || 1;
  const onboardingProgress = (completedOnboarding / totalOnboarding) * 100;
  const level = Math.floor((shifts?.length || 0) / 5) + 1;
  const xpProgress = ((shifts?.length || 0) % 5) * 20;

  return (
    <ScreenLayout title={t('profile.title')} isRoot={true}>
      {/* Profile Header Card with Level & XP */}
      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={SPRING_CONFIGS.bouncy}
      >
        <View style={styles.profileHeaderContainer}>
          {/* Avatar with Level Badge */}
          <View style={styles.avatarWrapper}>
            <View style={[styles.avatarBorder, { borderColor: isDark ? '#2A2A2A' : '#FFFFFF' }]}>
              <Avatar name={getDisplayName()} size="xl" />
            </View>
            <View style={[styles.levelBadge, { backgroundColor: accentColor }]}>
              <Text variant="tiny" style={{ color: '#FFFFFF', fontWeight: '700' }}>LVL {level}</Text>
            </View>
          </View>
          
          {/* Card with curved top */}
          <View style={[styles.profileCard, { backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF' }]}>
            <View style={styles.profileCardContent}>
              <Text variant="h2" style={{ color: textColor, textAlign: 'center' }}>
                {getDisplayName()}
              </Text>
              <Text variant="body" style={{ color: mutedColor, textAlign: 'center', marginTop: 4 }}>
                {user?.email}
              </Text>
              
              {/* XP Progress Bar */}
              <View style={styles.xpContainer}>
                <View style={styles.xpHeader}>
                  <View style={styles.xpLabel}>
                    <Zap size={14} color="#F59E0B" />
                    <Text variant="body-sm" style={{ color: mutedColor }}>Experience</Text>
                  </View>
                  <Text variant="body-sm" style={{ color: accentColor, fontWeight: '600' }}>
                    {shifts?.length || 0} / {level * 5} XP
                  </Text>
                </View>
                <View style={[styles.progressBar, { backgroundColor: isDark ? '#2A2A2A' : '#E5E5E5' }]}>
                  <MotiView
                    from={{ width: '0%' }}
                    animate={{ width: `${xpProgress}%` }}
                    transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 300 }}
                    style={[styles.progressFill, { backgroundColor: accentColor }]}
                  />
                </View>
              </View>
              
              {/* Edit button */}
              <TouchableOpacity 
                style={[styles.editButton, { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }]}
                onPress={() => navigation.navigate('EditProfile')}
              >
                <Edit size={14} color={textColor} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </MotiView>

      {/* Achievements Section */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ ...SPRING_CONFIGS.bouncy, delay: STAGGER_DELAYS.medium }}
      >
        <View style={styles.section}>
          <Text variant="h3" style={[styles.sectionTitle, { color: textColor }]}>
            🏆 {t('profile.achievements')}
          </Text>
          <Card variant="elevated">
            <CardContent>
              <View style={styles.achievementsGrid}>
                <View style={styles.achievementItem}>
                  <View style={[styles.achievementIcon, { backgroundColor: onboardingProgress >= 100 ? '#FEF3C7' : (isDark ? '#2A2A2A' : '#F5F5F5') }]}>
                    <Award size={24} color={onboardingProgress >= 100 ? '#F59E0B' : mutedColor} />
                  </View>
                  <Text variant="tiny" style={{ color: mutedColor, textAlign: 'center', marginTop: 4 }}>Onboarding</Text>
                </View>
                <View style={styles.achievementItem}>
                  <View style={[styles.achievementIcon, { backgroundColor: (shifts?.length || 0) >= 5 ? '#EDF5EC' : (isDark ? '#2A2A2A' : '#F5F5F5') }]}>
                    <TrendingUp size={24} color={(shifts?.length || 0) >= 5 ? accentColor : mutedColor} />
                  </View>
                  <Text variant="tiny" style={{ color: mutedColor, textAlign: 'center', marginTop: 4 }}>5 Shifts</Text>
                </View>
                <View style={styles.achievementItem}>
                  <View style={[styles.achievementIcon, { backgroundColor: (contracts?.length || 0) >= 1 ? '#DBEAFE' : (isDark ? '#2A2A2A' : '#F5F5F5') }]}>
                    <FileText size={24} color={(contracts?.length || 0) >= 1 ? '#3B82F6' : mutedColor} />
                  </View>
                  <Text variant="tiny" style={{ color: mutedColor, textAlign: 'center', marginTop: 4 }}>Contract</Text>
                </View>
                <View style={[styles.achievementItem, { opacity: 0.5 }]}>
                  <View style={[styles.achievementIcon, { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }]}>
                    <Award size={24} color={mutedColor} />
                  </View>
                  <Text variant="tiny" style={{ color: mutedColor, textAlign: 'center', marginTop: 4 }}>Locked</Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>
      </MotiView>

      {/* Account Section */}
      <View style={styles.section}>
        <Text variant="h3" style={[styles.sectionTitle, { color: textColor }]}>
          {t('profile.account')}
        </Text>
        <Text variant="body-sm" style={[styles.sectionSubtitle, { color: mutedColor }]}>
          {t('profile.manageInfo')}
        </Text>
        
        <Card variant="elevated">
          <CardContent style={styles.menuContainer}>
            <MotiView
              from={{ opacity: 0, translateX: -30, scale: 0.9 }}
              animate={{ opacity: 1, translateX: 0, scale: 1 }}
              transition={{ ...SPRING_CONFIGS.bouncy, delay: STAGGER_DELAYS.medium }}
            >
              <MenuItem
                icon={Calendar}
                title={t('profile.mySchedule')}
                subtitle={shifts?.length ? `${shifts.length} ${t('profile.upcomingShifts')}` : t('profile.viewShifts')}
                onPress={() => navigation.navigate('Schedule')}
                rightContent={shifts?.length ? (
                  <Badge variant="success">{shifts.length}</Badge>
                ) : undefined}
              />
            </MotiView>
            <View style={[styles.divider, { backgroundColor: isDark ? '#2E2E2E' : '#E5E5E5' }]} />
            
            <MotiView
              from={{ opacity: 0, translateX: -30, scale: 0.9 }}
              animate={{ opacity: 1, translateX: 0, scale: 1 }}
              transition={{ ...SPRING_CONFIGS.bouncy, delay: STAGGER_DELAYS.medium * 2 }}
            >
              <MenuItem
                icon={Star}
                title={t('profile.onboarding')}
                subtitle={
                  onboardingData?.onboarding?.status === 'completed' 
                    ? t('profile.completed') 
                    : t('profile.inProgress')
                }
                onPress={() => navigation.navigate('Onboarding')}
                rightContent={
                  onboardingData?.onboarding?.status === 'completed' 
                    ? <Badge variant="success">✓</Badge>
                    : <Badge variant="warning">
                        {`${onboardingData?.progress?.filter(p => p.status === 'completed').length || 0}/${onboardingData?.steps?.length || 0}`}
                      </Badge>
                }
              />
            </MotiView>
            <View style={[styles.divider, { backgroundColor: isDark ? '#2E2E2E' : '#E5E5E5' }]} />
            
            <MotiView
              from={{ opacity: 0, translateX: -30, scale: 0.9 }}
              animate={{ opacity: 1, translateX: 0, scale: 1 }}
              transition={{ ...SPRING_CONFIGS.bouncy, delay: STAGGER_DELAYS.medium * 3 }}
            >
              <MenuItem
                icon={FileText}
                title={t('profile.contracts')}
                subtitle={`${contracts?.length || 0} ${t('profile.signedContracts')}`}
                onPress={() => navigation.navigate('Contracts')}
                rightContent={contracts?.length ? (
                  <Badge variant="default">{contracts.length}</Badge>
                ) : undefined}
              />
            </MotiView>
          </CardContent>
        </Card>
      </View>

      {/* Contact Info Section */}
      <View style={styles.section}>
        <Text variant="h3" style={[styles.sectionTitle, { color: textColor }]}>
          {t('profile.contactInfo')}
        </Text>
        
        <Card variant="elevated">
          <CardContent style={styles.menuContainer}>
            {/* Email - always show from employee or user */}
            <View style={styles.infoRow}>
              <Mail size={18} color={mutedColor} />
              <View style={styles.infoText}>
                <Text variant="body-sm" style={{ color: mutedColor }}>{t('profile.email')}</Text>
                <Text variant="body" style={{ color: textColor }}>
                  {employee?.email || user?.email || '-'}
                </Text>
              </View>
            </View>
            
            {/* Phone - show if available */}
            {employee?.phone && (
              <>
                <View style={[styles.divider, { backgroundColor: isDark ? '#2E2E2E' : '#E5E5E5' }]} />
                <View style={styles.infoRow}>
                  <Phone size={18} color={mutedColor} />
                  <View style={styles.infoText}>
                    <Text variant="body-sm" style={{ color: mutedColor }}>{t('profile.phone')}</Text>
                    <Text variant="body" style={{ color: textColor }}>{employee.phone}</Text>
                  </View>
                </View>
              </>
            )}
            
            {/* Role */}
            <View style={[styles.divider, { backgroundColor: isDark ? '#2E2E2E' : '#E5E5E5' }]} />
            <View style={styles.infoRow}>
              <Briefcase size={18} color={mutedColor} />
              <View style={styles.infoText}>
                <Text variant="body-sm" style={{ color: mutedColor }}>{t('profile.role')}</Text>
                <Text variant="body" style={{ color: textColor }}>{employee?.role || t('profile.employee')}</Text>
              </View>
            </View>
            
            {/* Company */}
            {company && (
              <>
                <View style={[styles.divider, { backgroundColor: isDark ? '#2E2E2E' : '#E5E5E5' }]} />
                <View style={styles.infoRow}>
                  <Building2 size={18} color={mutedColor} />
                  <View style={styles.infoText}>
                    <Text variant="body-sm" style={{ color: mutedColor }}>{t('profile.company')}</Text>
                    <Text variant="body" style={{ color: textColor }}>{company.name}</Text>
                  </View>
                </View>
              </>
            )}
          </CardContent>
        </Card>
      </View>

    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeaderContainer: {
    marginTop: 60,
    marginBottom: 24,
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'absolute',
    top: -50,
    left: '50%',
    marginLeft: -50,
    zIndex: 2,
  },
  avatarBorder: {
    padding: 4,
    borderRadius: 60,
    borderWidth: 4,
    backgroundColor: '#FFFFFF',
  },
  levelBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileCard: {
    width: '100%',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileCardContent: {
    alignItems: 'center',
  },
  xpContainer: {
    width: '100%',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  xpLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  achievementsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  achievementItem: {
    alignItems: 'center',
    width: 70,
  },
  achievementIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  sectionSubtitle: {
    marginBottom: 12,
  },
  menuContainer: {
    paddingVertical: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    flex: 1,
    marginLeft: 12,
  },
  divider: {
    height: 1,
    marginLeft: 52,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingLeft: 8,
  },
  infoText: {
    flex: 1,
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 32,
  },
});
