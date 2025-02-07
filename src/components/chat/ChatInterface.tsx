
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Mic, Plus, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useMessagesStore } from "@/stores/useMessagesStore";

const ChatList = () => {
  const { chats, fetchChats, createNewChat, fetchMessages, currentChatId } = useMessagesStore();

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const handleNewChat = async () => {
    try {
      const newChatId = await createNewChat();
      fetchMessages(newChatId);
    } catch (error) {
      // Error is handled in the store
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="p-4">
        <Button className="w-full bg-gradient-elegant" size="lg" onClick={handleNewChat}>
          <Plus className="mr-2" />
          New Chat
        </Button>
      </div>
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-2">
          {chats.map((chat) => (
            <div 
              key={chat.id}
              className={cn(
                "glass-card p-3 cursor-pointer hover:shadow-md transition-shadow",
                currentChatId === chat.id && "border-2 border-primary"
              )}
              onClick={() => fetchMessages(chat.id)}
            >
              <h3 className="font-medium text-sm text-neutral-700">{chat.title}</h3>
              <p className="text-xs text-neutral-500 mt-1 truncate">
                {new Date(chat.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

const ChatMessages = () => {
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

const ChatInput = () => {
  const [message, setMessage] = useState("");
  const { sendMessage } = useMessagesStore();

  const handleSendMessage = async () => {
    if (message.trim()) {
      await sendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-4 border-t">
      <div className="relative">
        <Textarea 
          placeholder="Type your message..." 
          className="pr-24 resize-none glass-card" 
          rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
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

export const ChatInterface = () => {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-[calc(100vh-8rem)] h-full rounded-lg border bg-background/50 backdrop-blur-sm"
    >
      <ResizablePanel defaultSize={20} minSize={15} maxSize={25} className="border-r">
        <ChatList />
      </ResizablePanel>
      
      <ResizableHandle withHandle />
      
      <ResizablePanel defaultSize={80}>
        <div className="flex h-full flex-col">
          <div className="border-b p-4">
            <h2 className="text-lg font-semibold text-[#2A3D66]">Chat Assistant</h2>
          </div>
          <ChatMessages />
          <ChatInput />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
