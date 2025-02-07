
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Mic, Plus, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { KeyboardEvent, useState } from "react";
import { cn } from "@/lib/utils";

const ChatList = () => {
  return (
    <div className="flex h-full flex-col">
      <div className="p-4">
        <Button className="w-full bg-gradient-elegant" size="lg">
          <Plus className="mr-2" />
          New Chat
        </Button>
      </div>
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-2">
          {/* Chat list items will go here */}
          <div className="glass-card p-3 cursor-pointer hover:shadow-md transition-shadow">
            <h3 className="font-medium text-sm text-neutral-700">New Conversation</h3>
            <p className="text-xs text-neutral-500 mt-1 truncate">Start a new chat...</p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

const ChatMessages = () => {
  return (
    <ScrollArea className="flex-1">
      <div className="space-y-4 p-4">
        <div className="flex justify-end">
          <div className="bg-primary text-white rounded-lg p-3 max-w-[80%]">
            <p>Hello! How can I help you today?</p>
          </div>
        </div>
        <div className="flex justify-start">
          <div className="glass-card p-3 max-w-[80%]">
            <p className="text-neutral-700">I'm here to assist you with any questions or concerns you might have.</p>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

const ChatInput = () => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
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
      className="h-[calc(100vh-2rem)] overflow-hidden rounded-lg border bg-background/50 backdrop-blur-sm"
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
