import { useState, useEffect } from 'react';
import { supabase } from '@/config/supabase';
import { useAuth } from './useAuth';

export type UserRole = 'superadmin' | 'admin' | 'manager' | 'employee' | 'user' | null;

interface UseRoleReturn {
  role: UserRole;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isManager: boolean;
  canManageOnboarding: boolean;
}

/**
 * Hook to get the current user's role from user_profiles
 */
export function useRole(): UseRoleReturn {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRole() {
      if (!user?.id) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await (supabase as any)
          .from('user_profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('❌ Failed to fetch user role:', error);
          setRole(null);
        } else {
          setRole((data?.role as UserRole) || 'employee');
        }
      } catch (err) {
        console.error('❌ Exception fetching role:', err);
        setRole(null);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchRole();
    }
  }, [user?.id, authLoading]);

  const isSuperAdmin = role === 'superadmin';
  const isAdmin = role === 'admin' || isSuperAdmin;
  const isManager = role === 'manager' || isAdmin;
  const canManageOnboarding = isAdmin || isSuperAdmin;

  return {
    role,
    loading: loading || authLoading,
    isAdmin,
    isSuperAdmin,
    isManager,
    canManageOnboarding,
  };
}
