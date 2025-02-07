
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { useMessagesStore } from "@/stores/useMessagesStore";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export const ChatList = () => {
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
