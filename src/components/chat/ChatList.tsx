
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { useMessagesStore } from "@/stores/useMessagesStore";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Chat } from "@/stores/messages/types";
import { toast } from "sonner";
import { ChatListItem } from "./ChatListItem";
import { DeleteChatDialog } from "./DeleteChatDialog";

export const ChatList = () => {
  const { chats, fetchChats, createNewChat, fetchMessages, currentChatId, renameChat, deleteChat, updateChat } = useMessagesStore();
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);

  useEffect(() => {
    fetchChats();

    // Set up real-time subscription for chat updates
    const channel = supabase
      .channel('public:chats')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chats'
        },
        (payload) => {
          console.log('Received chat update:', payload);
          if (payload.new && isValidChat(payload.new)) {
            console.log('Updating chat:', payload.new);
            updateChat(payload.new as Chat);
          } else {
            console.error('Invalid chat update payload:', payload);
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to chat updates');
        }
      });

    return () => {
      console.log('Cleaning up chat subscription');
      supabase.removeChannel(channel);
    };
  }, [fetchChats, updateChat]);

  // Type guard to validate chat payload
  const isValidChat = (chat: any): chat is Chat => {
    return (
      typeof chat === 'object' &&
      chat !== null &&
      typeof chat.id === 'string' &&
      typeof chat.title === 'string' &&
      typeof chat.created_at === 'string'
    );
  };

  const handleNewChat = async () => {
    try {
      const newChatId = await createNewChat();
      fetchMessages(newChatId);
    } catch (error) {
      console.error('Error creating new chat:', error);
      toast.error('Failed to create new chat');
    }
  };

  const startEditing = (chat: { id: string; title: string }) => {
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
  };

  const handleRename = async (chatId: string) => {
    if (editTitle.trim()) {
      await renameChat(chatId, editTitle.trim());
      setEditingChatId(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, chatId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRename(chatId);
    } else if (e.key === 'Escape') {
      setEditingChatId(null);
    }
  };

  const confirmDelete = async () => {
    if (deletingChatId) {
      await deleteChat(deletingChatId);
      setDeletingChatId(null);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="p-3">
        <Button 
          className="w-full elegant-gradient text-base font-medium rounded-lg py-4" 
          onClick={handleNewChat}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-2 pb-4">
          {chats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              currentChatId={currentChatId}
              onChatSelect={fetchMessages}
              onEditStart={startEditing}
              onDeleteStart={setDeletingChatId}
              isEditing={editingChatId === chat.id}
              editTitle={editTitle}
              onEditChange={setEditTitle}
              onEditSubmit={handleRename}
              onEditKeyDown={handleKeyDown}
            />
          ))}
        </div>
      </ScrollArea>

      <DeleteChatDialog
        isOpen={!!deletingChatId}
        onOpenChange={(open) => !open && setDeletingChatId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};
