import { create } from 'zustand';
import { MessagesState, Message, Chat } from './messages/types';
import { createNewChat, fetchChats, renameChat, deleteChat } from './messages/chatOperations';
import { fetchMessages, sendMessage } from './messages/messageOperations';

interface MessagesStore extends MessagesState {
  setMessages: (messages: Message[]) => void;
  setChats: (chats: Chat[]) => void;
  setCurrentChatId: (chatId: string | null) => void;
  addMessage: (message: Message) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  removeMessage: (messageId: string) => void;
  createNewChat: () => Promise<string>;
  fetchChats: () => Promise<void>;
  fetchMessages: (chatId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  renameChat: (chatId: string, newTitle: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
}

export const useMessagesStore = create<MessagesStore>((set, get) => ({
  messages: [],
  chats: [],
  currentChatId: null,
  isLoading: false,
  
  setMessages: (messages) => set({ messages }),
  setChats: (chats) => set({ chats }),
  setCurrentChatId: (chatId) => set({ currentChatId: chatId }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  updateMessage: (messageId, updates) => set((state) => ({
    messages: state.messages.map(msg => 
      msg.id === messageId ? { ...msg, ...updates } : msg
    )
  })),
  removeMessage: (messageId) => set((state) => ({
    messages: state.messages.filter(msg => msg.id !== messageId)
  })),
  
  createNewChat: async () => {
    const { newChats, chatId } = await createNewChat(get().chats);
    set({ chats: newChats });
    return chatId;
  },

  fetchChats: async () => {
    const chats = await fetchChats();
    set({ chats });
  },

  fetchMessages: async (chatId: string) => {
    try {
      set({ isLoading: true });
      const messages = await fetchMessages(chatId);
      set({ messages, currentChatId: chatId });
    } finally {
      set({ isLoading: false });
    }
  },

  sendMessage: async (content: string) => {
    const { currentChatId, messages, addMessage, updateMessage, removeMessage } = get();
    let chatId = currentChatId;

    if (!chatId) {
      try {
        chatId = await get().createNewChat();
        set({ currentChatId: chatId });
      } catch (error) {
        return;
      }
    }

    try {
      const { message, thinkingMessage, isFirstMessage } = await sendMessage(content, chatId, messages);
      
      // Add user message immediately
      addMessage(message);
      
      // Add thinking message
      addMessage(thinkingMessage);

      // Fetch updated messages which will include the AI response
      await get().fetchMessages(chatId);
      
      // Remove thinking message after fetching real response
      removeMessage(thinkingMessage.id);
      
      if (isFirstMessage) {
        await get().fetchChats();
      }
    } catch (error) {
      // If there's an error, keep the user message but update it to show error state
      set((state) => ({
        messages: state.messages.map(msg => 
          msg.role === 'ai' && msg.status === 'pending'
            ? { ...msg, content: "Sorry, I couldn't process your message. Please try again.", status: 'error' }
            : msg
        )
      }));
    }
  },

  renameChat: async (chatId: string, newTitle: string) => {
    const success = await renameChat(chatId, newTitle);
    if (success) {
      set((state) => ({
        chats: state.chats.map(chat => 
          chat.id === chatId ? { ...chat, title: newTitle } : chat
        )
      }));
    }
  },

  deleteChat: async (chatId: string) => {
    const success = await deleteChat(chatId);
    if (success) {
      set((state) => ({
        chats: state.chats.filter(chat => chat.id !== chatId),
        ...(state.currentChatId === chatId ? {
          currentChatId: null,
          messages: []
        } : {})
      }));
    }
  },
}));
