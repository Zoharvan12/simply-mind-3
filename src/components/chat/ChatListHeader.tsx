import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ChatListHeaderProps {
  onNewChat: () => Promise<void>;
}

export const ChatListHeader = ({ onNewChat }: ChatListHeaderProps) => {
  return (
    <div className="p-3">
      <Button 
        className="w-full elegant-gradient text-base font-medium rounded-lg py-4" 
        onClick={onNewChat}
      >
        <Plus className="mr-2 h-4 w-4" />
        New Chat
      </Button>
    </div>
  );
};