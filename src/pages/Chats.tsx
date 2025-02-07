
import { useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ChatList } from "@/components/chat/ChatList";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInput } from "@/components/chat/ChatInput";

// Temporary mock data
const mockMessages = [
  {
    id: "1",
    content: "Hello! How can I help you today?",
    isUser: false,
    timestamp: "2:30 PM"
  },
  {
    id: "2",
    content: "I'd like to discuss something that's been on my mind.",
    isUser: true,
    timestamp: "2:31 PM"
  },
  {
    id: "3",
    content: "Of course! I'm here to listen and help. What would you like to talk about?",
    isUser: false,
    timestamp: "2:31 PM"
  }
];

const Chats = () => {
  const [messages] = useState(mockMessages);

  const handleNewChat = () => {
    console.log("Starting new chat");
  };

  const handleSendMessage = (message: string) => {
    console.log("Sending message:", message);
  };

  const handleStartRecording = () => {
    console.log("Starting voice recording");
  };

  return (
    <MainLayout>
      <div className="h-[calc(100vh-2rem)] max-w-7xl mx-auto">
        <ScrollReveal>
          <ResizablePanelGroup
            direction="horizontal"
            className="h-full rounded-lg border glass-card"
          >
            {/* Chat List Panel */}
            <ResizablePanel
              defaultSize={25}
              minSize={20}
              maxSize={30}
              className="h-full"
            >
              <ChatList onNewChat={handleNewChat} />
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Main Chat Panel */}
            <ResizablePanel defaultSize={75} minSize={70} className="h-full">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-neutral-200">
                  <h2 className="text-lg font-semibold text-[#2A3D66]">Current Chat</h2>
                </div>

                <ChatMessages messages={messages} />
                
                <ChatInput
                  onSendMessage={handleSendMessage}
                  onStartRecording={handleStartRecording}
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ScrollReveal>
      </div>
    </MainLayout>
  );
};

export default Chats;
