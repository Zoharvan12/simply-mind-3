
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
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data: chat, error } = await supabase
        .from('chats')
        .insert({
          title: 'New Chat',
          user_id: user.id
        })
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
    const { currentChatId, messages } = get();
    let chatId = currentChatId;
    let isFirstMessage = false;

    if (!chatId) {
      try {
        chatId = await get().createNewChat();
        set({ currentChatId: chatId });
        isFirstMessage = true;
      } catch (error) {
        return;
      }
    } else {
      isFirstMessage = messages.length === 0;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Insert user message
      const { data: message, error: messageError } = await supabase
        .from('messages')
        .insert([{
          chat_id: chatId,
          user_id: user.id,
          role: 'user',
          content
        }])
        .select()
        .single();

      if (messageError) throw messageError;

      set((state) => ({ messages: [...state.messages, message] }));

      // Call the edge function for AI response
      const { data: aiResponse, error: aiError } = await supabase.functions
        .invoke('chat-with-context', {
          body: {
            content,
            chatId,
            isFirstMessage
          }
        });

      if (aiError) throw aiError;

      // Fetch messages again to get the AI response with correct ID and timestamp
      await get().fetchMessages(chatId);
      
      // If it was the first message, fetch chats to get the updated title
      if (isFirstMessage) {
        await get().fetchChats();
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  },

  renameChat: async (chatId: string, newTitle: string) => {
    try {
      const { error } = await supabase
        .from('chats')
        .update({ title: newTitle })
        .eq('id', chatId);

      if (error) throw error;

      set((state) => ({
        chats: state.chats.map(chat => 
          chat.id === chatId ? { ...chat, title: newTitle } : chat
        )
      }));

      toast.success('Chat renamed successfully');
    } catch (error) {
      console.error('Error renaming chat:', error);
      toast.error('Failed to rename chat');
    }
  },

  deleteChat: async (chatId: string) => {
    try {
      const { error } = await supabase
        .from('chats')
        .delete()
        .eq('id', chatId);

      if (error) throw error;

      set((state) => ({
        chats: state.chats.filter(chat => chat.id !== chatId),
        ...(state.currentChatId === chatId ? {
          currentChatId: null,
          messages: []
        } : {})
      }));

      toast.success('Chat deleted successfully');
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast.error('Failed to delete chat');
    }
  },
}));
