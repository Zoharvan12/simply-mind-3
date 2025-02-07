import { Chat } from "@/stores/messages/types";
import { Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatListItemProps {
  chat: Chat;
  currentChatId: string | null;
  onChatSelect: (chatId: string) => void;
  onEditStart: (chat: { id: string; title: string }) => void;
  onDeleteStart: (chatId: string) => void;
  isEditing: boolean;
  editTitle: string;
  onEditChange: (value: string) => void;
  onEditSubmit: (chatId: string) => void;
  onEditKeyDown: (e: React.KeyboardEvent, chatId: string) => void;
}

export const ChatListItem = ({
  chat,
  currentChatId,
  onChatSelect,
  onEditStart,
  onDeleteStart,
  isEditing,
  editTitle,
  onEditChange,
  onEditSubmit,
  onEditKeyDown,
}: ChatListItemProps) => {
  return (
    <div 
      key={chat.id}
      className={cn(
        "glass-card group relative cursor-pointer py-3 w-full max-w-full",
        currentChatId === chat.id && "selected"
      )}
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest('.chat-actions')) {
          onChatSelect(chat.id);
        }
      }}
    >
      {isEditing ? (
        <input
          type="text"
          value={editTitle}
          onChange={(e) => onEditChange(e.target.value)}
          onBlur={() => onEditSubmit(chat.id)}
          onKeyDown={(e) => onEditKeyDown(e, chat.id)}
          className="w-full bg-transparent border-none focus:outline-none focus:ring-1 
                   focus:ring-primary rounded px-2 py-1 text-sm"
          autoFocus
        />
      ) : (
        <div className="flex items-start justify-between w-full px-2">
          <div className="flex-1 min-w-0 pr-14"> {/* Increased right padding to prevent overlap */}
            <h3 className="font-medium text-sm text-neutral-700 truncate max-w-full">
              {chat.title}
            </h3>
            <p className="text-xs text-neutral-500 mt-1 truncate max-w-full">
              {new Date(chat.created_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </p>
          </div>
          <div className="chat-actions absolute right-2 top-1/2 -translate-y-1/2 
                        opacity-0 group-hover:opacity-100 transition-opacity 
                        flex items-center gap-1 bg-white/50 backdrop-blur-sm 
                        rounded-md px-1 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditStart(chat);
              }}
              aria-label="Edit chat"
              className="p-1.5 hover:bg-white/80 rounded-md transition-colors"
            >
              <Edit2 className="h-3.5 w-3.5 text-primary/70 hover:text-primary transition-colors" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteStart(chat.id);
              }}
              aria-label="Delete chat"
              className="p-1.5 hover:bg-white/80 rounded-md transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5 text-red-500/70 hover:text-red-500 transition-colors" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};