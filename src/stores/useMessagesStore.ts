
import { create } from 'zustand';
import { MessagesState, Message, Chat } from './messages/types';
import { createNewChat, fetchChats, renameChat, deleteChat } from './messages/chatOperations';
import { fetchMessages, sendMessage } from './messages/messageOperations';
import { supabase } from '@/integrations/supabase/client';

interface MessagesStore extends MessagesState {
  setMessages: (messages: Message[]) => void;
  setChats: (chats: Chat[]) => void;
  setCurrentChatId: (chatId: string | null) => void;
  addMessage: (message: Message) => void;
  updateChat: (chat: Chat) => void;
  createNewChat: () => Promise<string>;
  fetchChats: () => Promise<void>;
  fetchMessages: (chatId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  renameChat: (chatId: string, newTitle: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  monthlyMessages: number;
  setMonthlyMessages: (count: number) => void;
  isLimitReached: boolean;
}

export const useMessagesStore = create<MessagesStore>((set, get) => ({
  messages: [],
  chats: [],
  currentChatId: null,
  isLoading: false,
  monthlyMessages: 0,
  isLimitReached: false,
  
  setMessages: (messages) => set({ messages }),
  setChats: (chats) => set({ chats }),
  setCurrentChatId: (chatId) => set({ currentChatId: chatId }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setMonthlyMessages: (count) => set({ 
    monthlyMessages: count,
    isLimitReached: count >= 50
  }),
  
  updateChat: (updatedChat) => {
    console.log('Updating chat in store:', updatedChat);
    set((state) => ({
      chats: state.chats.map(chat => 
        chat.id === updatedChat.id ? updatedChat : chat
      )
    }));
  },

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
    const { currentChatId, messages, addMessage, monthlyMessages } = get();
    let chatId = currentChatId;
    let isFirstMessage = false;

    // Check message limit before sending
    if (monthlyMessages >= 50) {
      throw new Error('policy');
    }

    if (!chatId) {
      try {
        chatId = await get().createNewChat();
        set({ currentChatId: chatId });
        isFirstMessage = true;
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
      const { userMessage, aiMessage } = await sendMessage(content, chatId, messages);
      
      // Update messages list: remove temporary messages and add actual ones
      set((state) => ({
        messages: state.messages
          .filter(m => m.id !== 'thinking' && m.id !== tempUserMessage.id)
          .concat([userMessage, aiMessage])
      }));
      
      // Only fetch chats if this was the first message
      if (isFirstMessage) {
        await get().fetchChats();
      }
    } catch (error) {
      // Remove thinking message but keep the user message in case of error
      set((state) => ({
        messages: state.messages.filter(m => m.id !== 'thinking')
      }));
      throw error;
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

// Set up real-time subscription for message count updates
if (typeof window !== 'undefined') {
  const setupRealtimeSubscription = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch initial message count
    const { data: profile } = await supabase
      .from('profiles')
      .select('monthly_messages')
      .eq('id', user.id)
      .single();

    if (profile) {
      useMessagesStore.getState().setMonthlyMessages(profile.monthly_messages);
    }

    // Set up real-time subscription
    const channel = supabase
      .channel('profile_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`
        },
        (payload) => {
          if (payload.new && 'monthly_messages' in payload.new) {
            useMessagesStore.getState().setMonthlyMessages(payload.new.monthly_messages);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  };

  setupRealtimeSubscription();
}
