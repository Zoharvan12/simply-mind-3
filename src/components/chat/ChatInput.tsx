import { useState, useEffect } from "react";
import { useMessagesStore } from "@/stores/useMessagesStore";
import { supabase } from "@/integrations/supabase/client";
import { AudioRecorder } from "./AudioRecorder";
import { MessageComposer } from "./MessageComposer";
import { ChatControls } from "./ChatControls";
import { useUserRole } from "@/hooks/useUserRole";

export const ChatInput = () => {
  const [message, setMessage] = useState("");
  const [messageCount, setMessageCount] = useState(0);
  const { role } = useUserRole();
  const { sendMessage } = useMessagesStore();

  useEffect(() => {
    const fetchMessageCount = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || role !== 'free') return;

      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact' })
        .eq('role', 'user')
        .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

      setMessageCount(count || 0);
    };

    fetchMessageCount();
  }, [role]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      const currentMessage = message.trim();
      setMessage("");
      await sendMessage(currentMessage);
    }
  };

  useEffect(() => {
    const handleCustomSend = () => {
      handleSendMessage();
    };
    
    window.addEventListener('custom-send', handleCustomSend);
    return () => window.removeEventListener('custom-send', handleCustomSend);
  }, [message]);

  return (
    <div className="p-4 border-t">
      <div className="relative glass-card rounded-lg">
        <MessageComposer 
          value={message}
          onChange={setMessage}
        />
        <div className="absolute right-2 bottom-2 flex gap-2">
          <AudioRecorder onTranscription={setMessage} />
          <ChatControls 
            onSend={handleSendMessage}
            messageCount={messageCount}
          />
        </div>
      </div>
    </div>
  );
};