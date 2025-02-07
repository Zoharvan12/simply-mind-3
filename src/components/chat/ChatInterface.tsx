
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ChatList } from "./ChatList";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";

export const ChatInterface = () => {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-[calc(100vh-12rem)] rounded-lg border bg-background/50 backdrop-blur-sm"
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
          <div className="flex-1 overflow-hidden">
            <ChatMessages />
          </div>
          <ChatInput />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
