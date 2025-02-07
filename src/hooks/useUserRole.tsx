
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

        // Get user role with error handling
        const { data: roleData, error: rpcError } = await supabase
          .rpc('check_user_role', {
            user_id: user.id
          });

        if (rpcError) {
          console.error('RPC Error:', rpcError);
          throw new Error('Failed to fetch user role');
        }
        
        // Validate role data
        if (!roleData || !isValidUserRole(roleData)) {
          console.error('Invalid role received:', roleData);
          throw new Error('Invalid role received from server');
        }

        // Set the validated role
        setRole(roleData);
        
        // Strict admin check
        const isUserAdmin = roleData === 'admin';
        setIsAdmin(isUserAdmin);

        // Additional verification for admin status
        if (isUserAdmin) {
          const { data: adminCheck, error: adminError } = await supabase
            .rpc('is_admin');
            
          if (adminError || !adminCheck) {
            console.error('Admin verification failed:', adminError);
            setIsAdmin(false);
            throw new Error('Admin verification failed');
          }
        }

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
