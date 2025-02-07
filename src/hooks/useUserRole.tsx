
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'free' | 'premium';

export function useUserRole() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setRole(null);
          return;
        }

        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (roleError) throw roleError;
        
        setRole(roleData?.role || 'free');
      } catch (err: any) {
        console.error('Error fetching user role:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch role immediately
    fetchUserRole();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        fetchUserRole();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { role, isLoading, error };
}
