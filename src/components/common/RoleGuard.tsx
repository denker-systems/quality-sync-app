import React, { ReactNode } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRole, UserRole } from '@/hooks/useRole';
import { useTheme } from '@/contexts/ThemeContext';
import { Text } from '@/components/ui';
import { ShieldX } from 'lucide-react-native';

interface RoleGuardProps {
  children: ReactNode;
  allow?: UserRole[];
  disallow?: UserRole[];
  fallback?: ReactNode;
  showAccessDenied?: boolean;
}

/**
 * RoleGuard - Protects content based on user role
 * 
 * Usage:
 * - allow: Only these roles can see the content
 * - disallow: These roles cannot see the content
 * - fallback: Custom component to show when access is denied
 * - showAccessDenied: Show default access denied message (default: true)
 */
export function RoleGuard({
  children,
  allow,
  disallow,
  fallback,
  showAccessDenied = true,
}: RoleGuardProps) {
  const { role, loading } = useRole();
  const { isDark } = useTheme();

  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';
  const bgColor = isDark ? '#262626' : '#F5F5F5';

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <ActivityIndicator size="large" color={isDark ? '#6BBD68' : '#489A45'} />
      </View>
    );
  }

  const currentRole = role ?? null;
  const isDenied = disallow ? disallow.includes(currentRole) : false;
  const isNotAllowed = allow ? !allow.includes(currentRole) : false;

  if (isDenied || isNotAllowed) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showAccessDenied) {
      return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
          <ShieldX size={48} color={mutedColor} />
          <Text variant="h3" style={[styles.title, { color: textColor }]}>
            Access Denied
          </Text>
          <Text variant="body" style={[styles.description, { color: mutedColor }]}>
            You don't have permission to view this content.
          </Text>
        </View>
      );
    }

    return null;
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  title: {
    marginTop: 8,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
});
