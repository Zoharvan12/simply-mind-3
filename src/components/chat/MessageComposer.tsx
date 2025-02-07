import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";

const isRTL = (text: string) => {
  const rtlRegex = /[\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC]/;
  return rtlRegex.test(text);
};

const CustomTextArea = (props: any) => {
  const [monthlyMessages, setMonthlyMessages] = useState(0);
  const { role } = useUserRole();
  const isLimitReached = role === 'free' && monthlyMessages >= 50;

  useEffect(() => {
    const fetchMessageCount = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || role !== 'free') return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('monthly_messages')
        .eq('id', user.id)
        .single();

      if (profile) {
        console.log('Initial message count (textarea):', profile.monthly_messages);
        setMonthlyMessages(profile.monthly_messages);
      }
    };

    const setupRealtimeSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      console.log('Setting up realtime subscription for textarea:', user.id);
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
              console.log('Profile updated (textarea):', payload.new);
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLimitReached) {
        console.log('Sending message via Enter key, current count:', monthlyMessages);
        const event = new Event('custom-send');
        window.dispatchEvent(event);
      } else {
        console.log('Message limit reached, blocking Enter key send');
      }
    }
  };

  const textDir = isRTL(props.value) ? 'rtl' : 'ltr';

  return (
    <textarea
      {...props}
      dir={textDir}
      className={`rtl-support ${props.className || ''}`}
      onKeyDown={(e) => {
        handleKeyDown(e);
        props.onKeyDown?.(e);
      }}
    />
  );
};

interface MessageComposerProps {
  value: string;
  onChange: (value: string) => void;
}

export const MessageComposer = ({ value, onChange }: MessageComposerProps) => {
  return (
    <ReactMde
      value={value}
      onChange={onChange}
      selectedTab="write"
      generateMarkdownPreview={markdown => Promise.resolve(markdown)}
      toolbarCommands={[]}
      textAreaComponent={CustomTextArea}
      classes={{
        reactMde: "border-none bg-transparent",
        textArea: "bg-transparent border-none focus:outline-none rtl-support"
      }}
    />
  );
};