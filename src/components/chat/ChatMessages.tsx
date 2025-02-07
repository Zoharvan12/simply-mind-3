
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMessagesStore } from "@/stores/useMessagesStore";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export const ChatMessages = () => {
  const { messages, isLoading } = useMessagesStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="space-y-4 p-4">
        {messages.map((message) => (
          <div key={message.id} className={cn("flex", message.role === 'user' ? "justify-end" : "justify-start")}>
            <div className={cn(
              "max-w-[80%] p-3 rounded-lg",
              message.role === 'user' ? "bg-primary text-white" : "glass-card"
            )}>
              <p className={message.role === 'user' ? "text-white" : "text-neutral-700"}>
                {message.content}
              </p>
              <div className="text-xs mt-1 opacity-70">
                {new Date(message.created_at).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};
