import React, { useRef } from 'react';
import { 
  View, 
  ScrollView, 
  Pressable, 
  Modal, 
  StyleSheet,
  Animated,
  Dimensions,
  PanResponder,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  LayoutDashboard, 
  Calendar, 
  ClipboardList, 
  FileText,
  User,
  Building2,
  Settings,
} from 'lucide-react-native';
import { MenuHeader, MenuSection } from './menu';
import type { MenuItemData } from './menu';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRole } from '@/hooks/useRole';

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
    title: '',
    items: [
      { key: 'settings', icon: Settings, title: t('menu.settings'), subtitle: t('menu.settingsSubtitle') },
    ],
  },
];

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 100; // Minimum distance to trigger close

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
  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const dragX = useRef(new Animated.Value(0)).current;

  // Pan responder for swipe-to-close
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to horizontal swipes (right direction)
        return Math.abs(gestureState.dx) > 10 && gestureState.dx > 0 && Math.abs(gestureState.dy) < 30;
      },
      onPanResponderGrant: () => {
        dragX.setValue(0);
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow dragging to the right (positive dx)
        if (gestureState.dx > 0) {
          dragX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > SWIPE_THRESHOLD || gestureState.vx > 0.5) {
          // Swipe was fast enough or far enough - close menu
          Animated.timing(dragX, {
            toValue: SCREEN_WIDTH,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onClose();
            dragX.setValue(0);
          });
        } else {
          // Snap back
          Animated.spring(dragX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 100,
            friction: 10,
          }).start();
        }
      },
    })
  ).current;

  React.useEffect(() => {
    if (visible) {
      dragX.setValue(0);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim, dragX]);

  const handleItemPress = (key: string) => {
    onNavigate?.(key);
    onClose();
  };

  const backgroundColor = isDark ? '#0F0F0F' : '#FFFFFF';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <Animated.View 
          {...panResponder.panHandlers}
          style={[
            styles.menuContainer,
            { 
              backgroundColor,
              paddingTop: insets.top + 8,
              paddingBottom: Math.max(insets.bottom, 20),
              paddingLeft: insets.left,
              paddingRight: insets.right,
              transform: [{ translateX: Animated.add(slideAnim, dragX) }],
            },
          ]}
        >
          <MenuHeader
            title={t('menu.title')}
            logoutText={t('menu.logout')}
            onLogout={onLogout}
          />

          <ScrollView 
            style={styles.scrollView}
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
        </Animated.View>
      </View>
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
});

export default FullscreenMenu;
