
import { Button } from "@/components/ui/button";
import { Mic, Send } from "lucide-react";
import { useState } from "react";
import { useMessagesStore } from "@/stores/useMessagesStore";
import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";
import type { Command } from "react-mde";

export const ChatInput = () => {
  const [message, setMessage] = useState("");
  const { sendMessage } = useMessagesStore();

  const handleSendMessage = async () => {
    if (message.trim()) {
      const currentMessage = message.trim();
      setMessage(""); // Clear input immediately
      await sendMessage(currentMessage);
    }
  };

  const handleEnterCommand: Command = {
    name: 'send-message',
    execute: (options) => {
      if (options.event?.key === 'Enter' && !options.event?.shiftKey) {
        options.event.preventDefault();
        handleSendMessage();
      }
    },
    keyCommand: 'enter',
  };

  return (
    <div className="p-4 border-t">
      <div className="relative glass-card rounded-lg">
        <ReactMde
          value={message}
          onChange={setMessage}
          selectedTab="write"
          generateMarkdownPreview={markdown =>
            Promise.resolve(markdown)
          }
          toolbarCommands={[]}
          commands={{
            'send-message': handleEnterCommand
          }}
          classes={{
            reactMde: "border-none bg-transparent",
            textArea: "bg-transparent border-none focus:outline-none"
          }}
        />
        <div className="absolute right-2 bottom-2 flex gap-2">
          <Button 
            size="icon" 
            variant="ghost"
          >
            <Mic className="h-5 w-5 text-neutral-500" />
          </Button>
          <Button 
            size="icon"
            onClick={handleSendMessage}
            className="bg-primary text-white hover:bg-primary/90"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
