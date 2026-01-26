import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MotiView } from 'moti';
import { ScreenLayout } from '@/components/common';
import { Text, Card, CardContent, Avatar, Badge } from '@/components/ui';
import { AvatarUploadDialog } from '@/components/ui/AvatarUploadDialog';
import { useTheme } from '@/contexts/ThemeContext';
import { AnimatedEntrance, SPRING_CONFIGS, STAGGER_DELAYS } from '@/lib/animations';
import { Award, Zap, TrendingUp, Camera } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { useMyEmployee } from '@/hooks/useMyEmployee';
import { useCompanyData } from '@/hooks/useCompanyData';
import { useMyOnboarding } from '@/hooks/useOnboarding';
import { useMyContracts } from '@/hooks/useContracts';
import { useMyShifts } from '@/hooks/useMyShifts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';
import { useNavigation } from '@react-navigation/native';
import {
  Calendar,
  FileText,
  Mail,
  Phone,
  Briefcase,
  Building2,
  ChevronRight,
  Star,
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
        <Text variant="body-lg" style={{ color: textColor }}>
          {title}
        </Text>
        {subtitle && (
          <Text variant="body-sm" style={{ color: mutedColor }}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightContent || <ChevronRight size={20} color={mutedColor} />}
    </TouchableOpacity>
  );
}

export const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [uploadDialogVisible, setUploadDialogVisible] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';
  const accentColor = isDark ? '#6BBD68' : '#489A45';

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
      return data as {
        first_name: string | null;
        last_name: string | null;
        email: string | null;
        company_id: string | null;
      };
    },
  });

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

  const completedOnboarding =
    onboardingData?.progress?.filter((p) => p.status === 'completed').length || 0;
  const totalOnboarding = onboardingData?.steps?.length || 1;
  const onboardingProgress = (completedOnboarding / totalOnboarding) * 100;
  const level = Math.floor((shifts?.length || 0) / 5) + 1;
  const xpProgress = ((shifts?.length || 0) % 5) * 20;

  return (
    <ScreenLayout title={t('profile.title')} isRoot={true}>
      {/* Profile Header Card with Level & XP */}
      <AnimatedEntrance preset="scaleIn">
        <View style={styles.profileHeaderContainer}>
          {/* Avatar with Level Badge */}
          <TouchableOpacity
            style={styles.avatarWrapper}
            onPress={() => setUploadDialogVisible(true)}
            activeOpacity={0.8}
          >
            <View style={[styles.avatarBorder, { borderColor: isDark ? '#2A2A2A' : '#FFFFFF' }]}>
              <Avatar
                name={getDisplayName()}
                size="2xl"
                source={avatarUrl || (employee as any)?.avatar_url}
              />
            </View>
            <View style={[styles.levelBadge, { backgroundColor: accentColor }]}>
              <Text variant="tiny" style={{ color: '#FFFFFF', fontWeight: '700' }}>
                LVL {level}
              </Text>
            </View>
            <View style={[styles.cameraButton, { backgroundColor: accentColor }]}>
              <Camera size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

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
                    <Text variant="body-sm" style={{ color: mutedColor }}>
                      Experience
                    </Text>
                  </View>
                  <Text variant="body-sm" style={{ color: accentColor, fontWeight: '600' }}>
                    {shifts?.length || 0} / {level * 5} XP
                  </Text>
                </View>
                <View
                  style={[styles.progressBar, { backgroundColor: isDark ? '#2A2A2A' : '#E5E5E5' }]}
                >
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
      </AnimatedEntrance>

      {/* Achievements Section */}
      <AnimatedEntrance preset="fadeInUp" delay={STAGGER_DELAYS.medium}>
        <View style={styles.section}>
          <Text variant="h3" style={[styles.sectionTitle, { color: textColor }]}>
            🏆 Achievements
          </Text>
          <Card variant="elevated">
            <CardContent>
              <View style={styles.achievementsGrid}>
                <View style={styles.achievementItem}>
                  <View
                    style={[
                      styles.achievementIcon,
                      {
                        backgroundColor:
                          onboardingProgress >= 100 ? '#FEF3C7' : isDark ? '#2A2A2A' : '#F5F5F5',
                      },
                    ]}
                  >
                    <Award size={24} color={onboardingProgress >= 100 ? '#F59E0B' : mutedColor} />
                  </View>
                  <Text
                    variant="tiny"
                    style={{ color: mutedColor, textAlign: 'center', marginTop: 4 }}
                  >
                    Onboarding
                  </Text>
                </View>
                <View style={styles.achievementItem}>
                  <View
                    style={[
                      styles.achievementIcon,
                      {
                        backgroundColor:
                          (shifts?.length || 0) >= 5 ? '#EDF5EC' : isDark ? '#2A2A2A' : '#F5F5F5',
                      },
                    ]}
                  >
                    <TrendingUp
                      size={24}
                      color={(shifts?.length || 0) >= 5 ? accentColor : mutedColor}
                    />
                  </View>
                  <Text
                    variant="tiny"
                    style={{ color: mutedColor, textAlign: 'center', marginTop: 4 }}
                  >
                    5 Shifts
                  </Text>
                </View>
                <View style={styles.achievementItem}>
                  <View
                    style={[
                      styles.achievementIcon,
                      {
                        backgroundColor:
                          (contracts?.length || 0) >= 1
                            ? '#DBEAFE'
                            : isDark
                              ? '#2A2A2A'
                              : '#F5F5F5',
                      },
                    ]}
                  >
                    <FileText
                      size={24}
                      color={(contracts?.length || 0) >= 1 ? '#3B82F6' : mutedColor}
                    />
                  </View>
                  <Text
                    variant="tiny"
                    style={{ color: mutedColor, textAlign: 'center', marginTop: 4 }}
                  >
                    Contract
                  </Text>
                </View>
                <View style={[styles.achievementItem, { opacity: 0.5 }]}>
                  <View
                    style={[
                      styles.achievementIcon,
                      { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' },
                    ]}
                  >
                    <Award size={24} color={mutedColor} />
                  </View>
                  <Text
                    variant="tiny"
                    style={{ color: mutedColor, textAlign: 'center', marginTop: 4 }}
                  >
                    Locked
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>
      </AnimatedEntrance>

      {/* Avatar Upload Dialog */}
      <AvatarUploadDialog
        visible={uploadDialogVisible}
        onClose={() => setUploadDialogVisible(false)}
        onUploadComplete={(url) => {
          setAvatarUrl(url);
          // Invalidate employee query to refetch with new avatar
          queryClient.invalidateQueries({ queryKey: ['my-employee'] });
          setUploadDialogVisible(false);
        }}
        employeeId={employee?.id}
      />

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
                subtitle={
                  shifts?.length
                    ? `${shifts.length} ${t('profile.upcomingShifts')}`
                    : t('profile.viewShifts')
                }
                onPress={() => navigation.navigate('Schedule')}
                rightContent={
                  shifts?.length ? <Badge variant="success">{shifts.length}</Badge> : undefined
                }
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
                  onboardingData?.onboarding?.status === 'completed' ? (
                    <Badge variant="success">✓</Badge>
                  ) : (
                    <Badge variant="warning">
                      {`${onboardingData?.progress?.filter((p) => p.status === 'completed').length || 0}/${onboardingData?.steps?.length || 0}`}
                    </Badge>
                  )
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
                rightContent={
                  contracts?.length ? (
                    <Badge variant="default">{contracts.length}</Badge>
                  ) : undefined
                }
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
                <Text variant="body-sm" style={{ color: mutedColor }}>
                  {t('profile.email')}
                </Text>
                <Text variant="body" style={{ color: textColor }}>
                  {employee?.email || user?.email || '-'}
                </Text>
              </View>
            </View>

            {/* Phone - show if available */}
            {employee?.phone && (
              <>
                <View
                  style={[styles.divider, { backgroundColor: isDark ? '#2E2E2E' : '#E5E5E5' }]}
                />
                <View style={styles.infoRow}>
                  <Phone size={18} color={mutedColor} />
                  <View style={styles.infoText}>
                    <Text variant="body-sm" style={{ color: mutedColor }}>
                      {t('profile.phone')}
                    </Text>
                    <Text variant="body" style={{ color: textColor }}>
                      {employee.phone}
                    </Text>
                  </View>
                </View>
              </>
            )}

            {/* Role */}
            <View style={[styles.divider, { backgroundColor: isDark ? '#2E2E2E' : '#E5E5E5' }]} />
            <View style={styles.infoRow}>
              <Briefcase size={18} color={mutedColor} />
              <View style={styles.infoText}>
                <Text variant="body-sm" style={{ color: mutedColor }}>
                  {t('profile.role')}
                </Text>
                <Text variant="body" style={{ color: textColor }}>
                  {employee?.role || t('profile.employee')}
                </Text>
              </View>
            </View>

            {/* Company */}
            {company && (
              <>
                <View
                  style={[styles.divider, { backgroundColor: isDark ? '#2E2E2E' : '#E5E5E5' }]}
                />
                <View style={styles.infoRow}>
                  <Building2 size={18} color={mutedColor} />
                  <View style={styles.infoText}>
                    <Text variant="body-sm" style={{ color: mutedColor }}>
                      {t('profile.company')}
                    </Text>
                    <Text variant="body" style={{ color: textColor }}>
                      {company.name}
                    </Text>
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
    marginTop: 70,
    marginBottom: 24,
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'absolute',
    top: -60,
    left: '50%',
    marginLeft: -64,
    zIndex: 2,
  },
  avatarBorder: {
    padding: 4,
    borderRadius: 70,
    borderWidth: 4,
    backgroundColor: '#FFFFFF',
  },
  levelBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileCard: {
    width: '100%',
    paddingTop: 70,
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
