import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";

export const MessageLimitIndicator = () => {
  const [monthlyMessages, setMonthlyMessages] = useState(0);
  const { role } = useUserRole();

  useEffect(() => {
    const fetchMessageCount = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || role !== 'free') return;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('monthly_messages')
        .eq('id', user.id)
        .single();

      if (!error && profile) {
        setMonthlyMessages(profile.monthly_messages);
      }
    };

    fetchMessageCount();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('profile_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            return user ? `id=eq.${user.id}` : '';
          },
        },
        (payload) => {
          setMonthlyMessages(payload.new.monthly_messages);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [role]);

  return (
    <div className="mt-2">
      <div className="flex justify-between text-sm text-neutral-500 mb-1">
        <span>Monthly message limit</span>
        <span>{monthlyMessages}/50 messages</span>
      </div>
      <Progress value={(monthlyMessages / 50) * 100} className="h-1" />
    </div>
  );
};