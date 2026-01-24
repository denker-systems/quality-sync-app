import React from 'react';
import { 
  View, 
  ScrollView, 
  Pressable, 
  Modal, 
  StyleSheet,
} from 'react-native';
import { MotiView } from 'moti';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  LayoutDashboard, 
  Calendar, 
  ClipboardList, 
  FileText,
  User,
  Building2,
  Settings,
  LogOut,
} from 'lucide-react-native';
import { MenuHeader, MenuSection } from './menu';
import type { MenuItemData } from './menu';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRole } from '@/hooks/useRole';
import { SPRING_CONFIGS, TIMING_CONFIGS } from '@/lib/animations';

interface MenuSectionData {
  title: string;
  items: MenuItemData[];
}

interface FullscreenMenuProps {
  visible: boolean;
  onClose: () => void;
  onNavigate?: (screen: string) => void;
  onLogout?: () => void;
}

const getMenuSections = (t: (key: string) => string, canManageOnboarding: boolean): MenuSectionData[] => [
  {
    title: t('menu.mainMenu'),
    items: [
      { key: 'dashboard', icon: LayoutDashboard, title: t('menu.dashboard'), subtitle: t('menu.dashboardSubtitle') },
      { key: 'schedule', icon: Calendar, title: t('menu.mySchedule'), subtitle: t('menu.scheduleSubtitle') },
      { key: 'onboarding', icon: ClipboardList, title: t('menu.onboarding'), subtitle: t('menu.onboardingSubtitle') },
      { key: 'contracts', icon: FileText, title: t('menu.myContracts'), subtitle: t('menu.contractsSubtitle') },
    ],
  },
  ...(canManageOnboarding ? [{
    title: t('menu.admin') || 'Administration',
    items: [
      { key: 'onboarding-admin', icon: Settings, title: t('menu.onboardingAdmin') || 'Onboarding Settings', subtitle: t('menu.onboardingAdminSubtitle') || 'Configure onboarding steps' },
    ],
  }] : []),
  {
    title: t('menu.hrPersonal'),
    items: [
      { key: 'profile', icon: User, title: t('menu.myProfile'), subtitle: t('menu.profileSubtitle') },
      { key: 'company', icon: Building2, title: t('menu.company'), subtitle: t('menu.companySubtitle') },
    ],
  },
  {
    title: t('menu.settings'),
    items: [
      { key: 'settings', icon: Settings, title: t('menu.settings'), subtitle: t('menu.settingsSubtitle') },
    ],
  },
  {
    title: '',
    items: [
      { key: 'logout', icon: LogOut, title: t('menu.logout'), subtitle: '' },
    ],
  },
];

export function FullscreenMenu({ 
  visible, 
  onClose, 
  onNavigate,
  onLogout,
}: FullscreenMenuProps) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { canManageOnboarding } = useRole();
  const menuSections = getMenuSections(t, canManageOnboarding);

  const handleItemPress = (key: string) => {
    if (key === 'logout') {
      onLogout?.();
      onClose();
    } else {
      onNavigate?.(key);
      onClose();
    }
  };

  const backgroundColor = isDark ? '#0F0F0F' : '#FFFFFF';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <MotiView
        style={styles.overlay}
        from={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        exit={{ opacity: 0 }}
        transition={TIMING_CONFIGS.fast}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />
        <MotiView 
          style={[
            styles.menuContainer,
            { 
              backgroundColor,
              paddingTop: insets.top,
              paddingBottom: Math.max(insets.bottom, 20),
              paddingLeft: insets.left,
              paddingRight: insets.right,
            },
          ]}
          from={{ translateX: 400 }}
          animate={{ translateX: visible ? 0 : 400 }}
          exit={{ translateX: 400 }}
          transition={SPRING_CONFIGS.smooth}
        >
          <MenuHeader
            title={t('menu.title')}
            onClose={onClose}
          />

          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {menuSections.map((section, index) => (
              <MenuSection
                key={section.title || `section-${index}`}
                title={section.title}
                items={section.items}
                onItemPress={handleItemPress}
              />
            ))}
          </ScrollView>
        </MotiView>
      </MotiView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});

export default FullscreenMenu;
