
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useMessagesStore } from "@/stores/useMessagesStore";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const ChatList = () => {
  const { chats, fetchChats, createNewChat, fetchMessages, currentChatId, renameChat, deleteChat } = useMessagesStore();
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);

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
      <div className="p-6">
        <Button 
          className="w-full elegant-gradient text-lg font-medium rounded-xl py-6" 
          onClick={handleNewChat}
        >
          <Plus className="mr-2 h-5 w-5" />
          New Chat
        </Button>
      </div>
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-3 pb-6">
          {chats.map((chat) => (
            <div 
              key={chat.id}
              className={cn(
                "glass-card group relative cursor-pointer",
                currentChatId === chat.id && "selected"
              )}
              onClick={(e) => {
                if (!(e.target as HTMLElement).closest('.chat-actions')) {
                  fetchMessages(chat.id);
                }
              }}
            >
              {editingChatId === chat.id ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={() => handleRename(chat.id)}
                  onKeyDown={(e) => handleKeyDown(e, chat.id)}
                  className="w-full bg-transparent border-none focus:outline-none focus:ring-1 
                           focus:ring-primary rounded px-2 py-1 text-base"
                  autoFocus
                />
              ) : (
                <>
                  <div className="pr-16">
                    <h3 className="font-medium text-base text-neutral-700">{chat.title}</h3>
                    <p className="text-sm text-neutral-500 mt-2">
                      {new Date(chat.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="chat-actions absolute right-3 top-1/2 -translate-y-1/2 
                                opacity-0 group-hover:opacity-100 transition-opacity 
                                flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(chat);
                      }}
                      aria-label="Edit chat"
                    >
                      <Edit2 className="h-4 w-4 text-primary/70 hover:text-primary transition-colors" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingChatId(chat.id);
                      }}
                      aria-label="Delete chat"
                    >
                      <Trash2 className="h-4 w-4 text-red-500/70 hover:text-red-500 transition-colors" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <AlertDialog open={!!deletingChatId} onOpenChange={(open) => !open && setDeletingChatId(null)}>
        <AlertDialogContent className="bg-white/80 backdrop-blur-sm border border-white/20">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All messages in this chat will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-neutral-100">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
