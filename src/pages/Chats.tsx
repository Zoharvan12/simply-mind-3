import { MainLayout } from "@/components/MainLayout";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { MessageLimitIndicator } from "@/components/chat/MessageLimitIndicator";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";

const Chats = () => {
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
  }, [role]);

  return (
    <MainLayout>
      <div className="h-full flex flex-col">
        <ScrollReveal>
          <div className="flex flex-col p-3">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary 
                           bg-clip-text text-transparent">
                AI Chats
              </h1>
              <p className="text-neutral-500 mt-1 text-sm">
                Have meaningful conversations with AI
              </p>
            </div>
            {role === 'free' && (
              <MessageLimitIndicator messageCount={monthlyMessages} />
            )}
          </div>
        </ScrollReveal>
        
        <div className="flex-1 p-3 min-h-0">
          <ChatInterface />
        </div>
      </div>
    </MainLayout>
  );
};

export default Chats;