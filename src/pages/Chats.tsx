
import { MainLayout } from "@/components/MainLayout";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Mic, MessageSquare, Send, Plus } from "lucide-react";
import { useState } from "react";

const ChatSidebar = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <Button className="w-full gap-2" size="lg">
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {[1, 2, 3].map((chat) => (
            <div
              key={chat}
              className="glass-card p-3 rounded-lg cursor-pointer hover:bg-primary/5 transition-colors"
            >
              <h3 className="font-medium text-neutral-700 truncate">Chat {chat}</h3>
              <p className="text-sm text-neutral-500 truncate">Last message preview...</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

interface MessageProps {
  content: string;
  isAI?: boolean;
}

const Message = ({ content, isAI }: MessageProps) => {
  return (
    <div
      className={`flex ${isAI ? "justify-start" : "justify-end"} mb-4`}
    >
      <div
        className={`max-w-[80%] p-4 rounded-lg ${
          isAI
            ? "glass-card shadow-sm"
            : "bg-primary text-white"
        }`}
      >
        <p className="text-sm">{content}</p>
      </div>
    </div>
  );
};

const ChatWindow = () => {
  const [message, setMessage] = useState("");

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1 p-6">
        <Message
          content="Hello! How can I assist you today?"
          isAI
        />
        <Message
          content="I'm having trouble sleeping lately."
          isAI={false}
        />
        <Message
          content="I understand that must be difficult. Can you tell me more about your sleep patterns?"
          isAI
        />
      </ScrollArea>
      <div className="p-4 border-t bg-background/50 backdrop-blur-sm">
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1"
          />
          <Button size="icon" variant="ghost" className="hover:bg-primary/10">
            <Mic className="w-4 h-4 text-primary" />
          </Button>
          <Button size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const Chats = () => {
  return (
    <MainLayout>
      <div className="h-[calc(100vh-2rem)]">
        <ScrollReveal>
          <div className="flex items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#2A3D66]">AI Chats</h1>
              <p className="text-neutral-500 mt-1">Have meaningful conversations with AI</p>
            </div>
          </div>
        </ScrollReveal>

        <ResizablePanelGroup
          direction="horizontal"
          className="h-[calc(100%-5rem)] rounded-lg border bg-background/50 backdrop-blur-sm"
        >
          <ResizablePanel defaultSize={25} minSize={20} maxSize={30}>
            <ChatSidebar />
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={75}>
            <ChatWindow />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </MainLayout>
  );
};

export default Chats;
