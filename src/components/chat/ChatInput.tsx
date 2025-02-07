import { useState } from "react";
import { useMessagesStore } from "@/stores/useMessagesStore";
import { AudioRecorder } from "./AudioRecorder";
import { MessageComposer } from "./MessageComposer";
import { ChatControls } from "./ChatControls";

export const ChatInput = () => {
  const [message, setMessage] = useState("");
  const { sendMessage } = useMessagesStore();

  const handleSendMessage = async () => {
    if (message.trim()) {
      const currentMessage = message.trim();
      setMessage("");
      await sendMessage(currentMessage);
    }
  };

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