import { create } from 'zustand';
import { MessagesState, Message, Chat } from './messages/types';
import { createNewChat, fetchChats, renameChat, deleteChat } from './messages/chatOperations';
import { fetchMessages, sendMessage } from './messages/messageOperations';

interface MessagesStore extends MessagesState {
  setMessages: (messages: Message[]) => void;
  setChats: (chats: Chat[]) => void;
  setCurrentChatId: (chatId: string | null) => void;
  addMessage: (message: Message) => void;
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
    const { currentChatId, messages, addMessage } = get();
    let chatId = currentChatId;

    if (!chatId) {
      try {
        chatId = await get().createNewChat();
        set({ currentChatId: chatId });
      } catch (error) {
        return;
      }
    }

    // Add user message immediately with a temporary ID
    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      chat_id: chatId,
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    };
    addMessage(tempUserMessage);

    // Add AI "thinking" message
    const tempAiMessage: Message = {
      id: 'thinking',
      chat_id: chatId,
      role: 'ai',
      content: '',
      created_at: new Date().toISOString(),
      isLoading: true,
    };
    addMessage(tempAiMessage);

    try {
      const { message, isFirstMessage } = await sendMessage(content, chatId, messages);
      
      // Update messages list: remove temporary messages and add actual ones
      set((state) => ({
        messages: state.messages
          .filter(m => m.id !== 'thinking' && m.id !== tempUserMessage.id)
          .concat([message])
      }));
      
      await get().fetchMessages(chatId);
      
      if (isFirstMessage) {
        await get().fetchChats();
      }
    } catch (error) {
      // Remove thinking message but keep the user message in case of error
      set((state) => ({
        messages: state.messages.filter(m => m.id !== 'thinking')
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
