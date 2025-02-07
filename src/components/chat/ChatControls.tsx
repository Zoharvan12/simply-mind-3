import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { useMessagesStore } from "@/stores/useMessagesStore";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ChatControlsProps {
  onSend: () => void;
}

export const ChatControls = ({ onSend }: ChatControlsProps) => {
  const { role } = useUserRole();
  const [monthlyMessages, setMonthlyMessages] = useState(0);
  const isLimitReached = role === 'free' && monthlyMessages >= 50;

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
        console.log('Initial message count:', profile.monthly_messages);
        setMonthlyMessages(profile.monthly_messages);
      }
    };

    const setupRealtimeSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      console.log('Setting up realtime subscription for user:', user.id);
      const channel = supabase
        .channel('profile_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${user.id}`
          },
          (payload) => {
            if (payload.new && 'monthly_messages' in payload.new) {
              console.log('Profile updated:', payload.new);
              setMonthlyMessages(payload.new.monthly_messages);
            }
          }
        )
        .subscribe();

      return channel;
    };

    fetchMessageCount();
    let channel: ReturnType<typeof supabase.channel>;
    
    setupRealtimeSubscription().then(subscribedChannel => {
      if (subscribedChannel) {
        channel = subscribedChannel;
      }
    });

    return () => {
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, [role]);

  const handleSend = () => {
    if (isLimitReached) {
      console.log('Message limit reached, blocking send');
      return;
    }
    onSend();
  };

  const SendButton = () => (
    <Button 
      size="icon"
      onClick={handleSend}
      disabled={isLimitReached}
      className="bg-primary text-white hover:bg-primary/90 disabled:bg-gray-400"
    >
      <Send className="h-5 w-5" />
    </Button>
  );

  if (isLimitReached) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <SendButton />
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>You've reached your monthly message limit. Upgrade to premium for unlimited messages!</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return <SendButton />;
};