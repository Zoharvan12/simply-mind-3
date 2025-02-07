import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";

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
          table: 'profiles'
        },
        async (payload) => {
          const { data: { user } } = await supabase.auth.getUser();
          if (payload.new.id === user?.id) {
            setMonthlyMessages(payload.new.monthly_messages);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [role]);

  const isLimitReached = monthlyMessages >= 50;

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center text-sm text-neutral-500 mb-1">
        <span>Monthly message limit</span>
        <div className="flex items-center gap-2">
          <span>{monthlyMessages}/50 messages</span>
          {isLimitReached && (
            <Button 
              size="sm"
              onClick={() => window.location.href = '/settings'}
              className="bg-primary hover:bg-primary/90 text-white flex items-center gap-1"
            >
              <Crown className="h-3 w-3" />
              Upgrade
            </Button>
          )}
        </div>
      </div>
      <Progress 
        value={(monthlyMessages / 50) * 100} 
        className={`h-1 ${isLimitReached ? 'bg-red-100' : ''}`}
      />
    </div>
  );
};