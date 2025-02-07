
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export type UserRole = 'admin' | 'free' | 'premium';

const isValidUserRole = (role: any): role is UserRole => {
  return role === 'admin' || role === 'free' || role === 'premium';
};

export function useUserRole() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setRole(null);
          setIsAdmin(false);
          return;
        }

        // Get user role from user_roles table directly
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (roleError) {
          console.error('Role Error:', roleError);
          throw new Error('Failed to fetch user role');
        }

        if (!roleData || !isValidUserRole(roleData.role)) {
          console.error('Invalid role received:', roleData);
          throw new Error('Invalid role received from server');
        }

        setRole(roleData.role);
        setIsAdmin(roleData.role === 'admin');

      } catch (err: any) {
        console.error('Error in useUserRole:', err);
        setError(err.message);
        setRole(null);
        setIsAdmin(false);
        toast.error("Failed to verify user role");
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
