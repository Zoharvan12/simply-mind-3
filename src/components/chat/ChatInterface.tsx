import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ChatList } from "./ChatList";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { useMessagesStore } from "@/stores/useMessagesStore";
import { useUserRole } from "@/hooks/useUserRole";
import { Progress } from "@/components/ui/progress";

export const ChatInterface = () => {
  const { chats, currentChatId, messageCount } = useMessagesStore();
  const { role } = useUserRole();
  
  const currentChat = chats.find(chat => chat.id === currentChatId);
  const chatTitle = currentChat?.title || "Chat Assistant";

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
            {role === 'free' && (
              <div>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
                  <span>Monthly message limit</span>
                  <span>{messageCount}/50 messages</span>
                </div>
                <Progress value={(messageCount / 50) * 100} className="h-1" />
              </div>
            )}
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