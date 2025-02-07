import { useState, useEffect } from "react";
import { useMessagesStore } from "@/stores/useMessagesStore";
import { AudioRecorder } from "./AudioRecorder";
import { MessageComposer } from "./MessageComposer";
import { ChatControls } from "./ChatControls";
import { useUserRole } from "@/hooks/useUserRole";
import { toast } from "sonner";

export const ChatInput = () => {
  const [message, setMessage] = useState("");
  const { sendMessage } = useMessagesStore();
  const { role } = useUserRole();

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const currentMessage = message.trim();
    try {
      setMessage("");
      await sendMessage(currentMessage);
    } catch (error: any) {
      // Restore the message if sending fails
      setMessage(currentMessage);
      
      if (error.message?.includes('policy')) {
        toast.error("You've reached your monthly message limit. Upgrade to premium for unlimited messages!", {
          action: {
            label: "Upgrade",
            onClick: () => window.location.href = "/settings"
          }
        });
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    }
  };

  // Add event listener for the custom send event
  useEffect(() => {
    const handleCustomSend = () => {
      handleSendMessage();
    };

    window.addEventListener('custom-send', handleCustomSend);
    return () => {
      window.removeEventListener('custom-send', handleCustomSend);
    };
  }, [message]); // Include message in dependencies since handleSendMessage uses it

  return (
    <div className="p-4 border-t">
      <div className="relative glass-card rounded-lg">
        <MessageComposer 
          value={message}
          onChange={setMessage}
        />
        <div className="absolute right-2 bottom-2 flex gap-2">
          <AudioRecorder onTranscription={setMessage} />
          <ChatControls onSend={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};