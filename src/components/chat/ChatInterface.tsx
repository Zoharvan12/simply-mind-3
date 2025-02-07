import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ChatList } from "./ChatList";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { useMessagesStore } from "@/stores/useMessagesStore";
import { Progress } from "@/components/ui/progress";

export const ChatInterface = () => {
  const { chats, currentChatId, messageCount } = useMessagesStore();
  
  const currentChat = chats.find(chat => chat.id === currentChatId);
  const chatTitle = currentChat?.title || "Chat Assistant";
  const messageLimit = 50;
  const progress = (messageCount / messageLimit) * 100;

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full rounded-lg border bg-background/50 backdrop-blur-sm shadow-sm"
    >
      <ResizablePanel defaultSize={25} minSize={20} maxSize={30} className="border-r">
        <ChatList />
      </ResizablePanel>
      
      <ResizableHandle withHandle />
      
      <ResizablePanel defaultSize={75}>
        <div className="flex flex-col h-full">
          <div className="border-b px-4 py-3">
            <h2 className="text-base font-medium text-[#2A3D66] mb-2">{chatTitle}</h2>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Monthly message limit</span>
              <span>{messageCount}/{messageLimit} messages</span>
            </div>
            <Progress value={progress} className="h-1 mt-1" />
          </div>
          <div className="flex-1 min-h-0">
            <ChatMessages />
          </div>
          <ChatInput />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};