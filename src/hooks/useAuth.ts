import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/config/supabase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // Skip TOKEN_REFRESHED events to prevent unnecessary re-renders
      if (event === 'TOKEN_REFRESHED') {
        return;
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('🔐 useAuth.signIn called');
    console.log('  Email:', email);
    console.log('  Password length:', password.length);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('📡 Supabase response:');
      console.log('  Error:', error);
      console.log('  Data:', data);
      
      if (error) {
        console.error('❌ Login failed:', error.message);
      } else {
        console.log('✅ Login successful');
      }
      
      return { error };
    } catch (err) {
      console.error('💥 Exception during login:', err);
      return { error: err as any };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    session,
    loading,
    signIn,
    signOut,
  };
};
