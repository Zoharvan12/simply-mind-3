
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'free' | 'premium';

export function useUserRole() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setRole(null);
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        // Get user role
        const { data: roleData, error: rpcError } = await supabase
          .rpc('check_user_role', {
            user_id: user.id
          });

        if (rpcError) throw rpcError;
        
        // Set the role from the database
        const userRole = roleData as UserRole;
        setRole(userRole);
        
        // Set admin status based on the role
        setIsAdmin(userRole === 'admin');

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

  return { role, isLoading, error, isAdmin };
}
