
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare } from "lucide-react";

interface ChatListProps {
  onNewChat: () => void;
}

export const ChatList = ({ onNewChat }: ChatListProps) => {
  return (
    <div className="flex flex-col h-full border-r border-neutral-200">
      <div className="p-4">
        <Button
          onClick={onNewChat}
          className="w-full bg-gradient-elegant hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>
      
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-2 pr-2">
          {/* Placeholder chat items - will be replaced with real data */}
          {[1, 2, 3].map((i) => (
            <button
              key={i}
              className="w-full p-3 flex items-center gap-3 text-left rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <MessageSquare className="h-5 w-5 text-neutral-500" />
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-neutral-700 truncate">
                  Chat {i}
                </p>
                <p className="text-xs text-neutral-500 truncate">
                  Last message...
                </p>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
