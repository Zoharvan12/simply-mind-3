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
        <div className="flex items-center justify-between w-full">
          <div className="flex-1 min-w-0 pr-3">
            <h3 
              className="font-medium text-sm text-neutral-700 truncate"
              title={chat.title}
            >
              {chat.title.length > 30 ? `${chat.title.substring(0, 30)}...` : chat.title}
            </h3>
            <p className="text-xs text-neutral-500 mt-1 truncate">
              {new Date(chat.created_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </p>
          </div>
          <div className="chat-actions flex-shrink-0 opacity-0 group-hover:opacity-100 
                        transition-opacity flex items-center gap-1.5 px-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditStart(chat);
              }}
              aria-label="Edit chat"
              className="p-1"
            >
              <Edit2 className="h-3.5 w-3.5 text-primary/70 hover:text-primary transition-colors" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteStart(chat.id);
              }}
              aria-label="Delete chat"
              className="p-1"
            >
              <Trash2 className="h-3.5 w-3.5 text-red-500/70 hover:text-red-500 transition-colors" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};