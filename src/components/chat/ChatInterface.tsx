
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ChatList } from "./ChatList";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";

export const ChatInterface = () => {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-[700px] rounded-lg border bg-background/50 backdrop-blur-sm"
    >
      <ResizablePanel defaultSize={20} minSize={15} maxSize={25} className="flex flex-col h-full">
        <ChatList />
      </ResizablePanel>
      
      <ResizableHandle withHandle />
      
      <ResizablePanel defaultSize={80} className="flex flex-col h-full">
        <div className="flex-none border-b p-4">
          <h2 className="text-lg font-semibold text-[#2A3D66]">Chat Assistant</h2>
        </div>
        <div className="flex-1 min-h-0">
          <ChatMessages />
        </div>
        <div className="flex-none">
          <ChatInput />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
