
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  created_at: string;
}

export interface Chat {
  id: string;
  title: string;
  created_at: string;
}

interface MessagesStore {
  messages: Message[];
  chats: Chat[];
  currentChatId: string | null;
  isLoading: boolean;
  setMessages: (messages: Message[]) => void;
  setChats: (chats: Chat[]) => void;
  setCurrentChatId: (chatId: string | null) => void;
  addMessage: (message: Message) => void;
  createNewChat: () => Promise<string>;
  fetchChats: () => Promise<void>;
  fetchMessages: (chatId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
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
    try {
      const { data: chat, error } = await supabase
        .from('chats')
        .insert([{ title: 'New Chat' }])
        .select()
        .single();

      if (error) throw error;

      const newChats = [...get().chats, chat];
      set({ chats: newChats });
      return chat.id;
    } catch (error) {
      console.error('Error creating chat:', error);
      toast.error('Failed to create new chat');
      throw error;
    }
  },

  fetchChats: async () => {
    try {
      const { data: chats, error } = await supabase
        .from('chats')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ chats: chats || [] });
    } catch (error) {
      console.error('Error fetching chats:', error);
      toast.error('Failed to fetch chats');
    }
  },

  fetchMessages: async (chatId: string) => {
    try {
      set({ isLoading: true });
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      set({ messages: messages || [], currentChatId: chatId });
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to fetch messages');
    } finally {
      set({ isLoading: false });
    }
  },

  sendMessage: async (content: string) => {
    const { currentChatId } = get();
    if (!currentChatId) {
      try {
        const newChatId = await get().createNewChat();
        set({ currentChatId: newChatId });
      } catch (error) {
        return;
      }
    }

    try {
      // Send user message
      const { data: message, error: messageError } = await supabase
        .from('messages')
        .insert([{
          chat_id: get().currentChatId,
          role: 'user',
          content
        }])
        .select()
        .single();

      if (messageError) throw messageError;

      set((state) => ({ messages: [...state.messages, message] }));

      // Simulate AI response (replace with actual AI integration later)
      const { data: aiMessage, error: aiError } = await supabase
        .from('messages')
        .insert([{
          chat_id: get().currentChatId,
          role: 'ai',
          content: 'This is a simulated AI response. The actual AI integration will be implemented later.'
        }])
        .select()
        .single();

      if (aiError) throw aiError;

      set((state) => ({ messages: [...state.messages, aiMessage] }));
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  },
}));
