import { create } from 'zustand';
import { supabase } from "@/integrations/supabase/client";
import { Chat } from "@/stores/messages/types";
import { toast } from "sonner";

interface MessagesState {
  chats: Chat[];
  currentChatId: string | null;
  messageCount: number;
  messages: any[];
  isLoading: boolean;
  fetchChats: () => Promise<void>;
  createNewChat: () => Promise<string>;
  fetchMessages: (chatId: string) => Promise<void>;
  renameChat: (chatId: string, newTitle: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  updateChat: (chat: Chat) => void;
  sendMessage: (content: string) => Promise<void>;
}

export const useMessagesStore = create<MessagesState>((set, get) => ({
  chats: [],
  currentChatId: null,
  messageCount: 0,
  messages: [],
  isLoading: false,

  fetchChats: async () => {
    try {
      const { data: chats, error } = await supabase.from('chats').select('*');
      if (error) throw error;
      set({ chats: chats || [] });
    } catch (error) {
      console.error('Error fetching chats:', error);
      toast.error('Failed to fetch chats');
    }
  },

  createNewChat: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: newChat, error } = await supabase
        .from('chats')
        .insert({ 
          title: 'New Chat',
          user_id: user.id 
        })
        .select()
        .single();

      if (error) throw error;
      if (!newChat) throw new Error('Failed to create chat');

      set((state) => ({
        chats: [...state.chats, newChat],
        currentChatId: newChat.id,
      }));
      return newChat.id;
    } catch (error) {
      console.error('Error creating new chat:', error);
      toast.error('Failed to create new chat');
      throw error;
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

      // Count user messages for the current month
      const { data: monthlyCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact' })
        .eq('role', 'user')
        .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

      set({ 
        messages: messages || [],
        currentChatId: chatId,
        messageCount: monthlyCount?.length || 0,
        isLoading: false
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to fetch messages');
      set({ isLoading: false });
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
        chats: state.chats.map(chat => chat.id === chatId ? { ...chat, title: newTitle } : chat)
      }));
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
        currentChatId: state.currentChatId === chatId ? null : state.currentChatId,
      }));
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast.error('Failed to delete chat');
    }
  },

  updateChat: (chat: Chat) => {
    set((state) => ({
      chats: state.chats.map(c => c.id === chat.id ? chat : c)
    }));
  },

  sendMessage: async (content: string) => {
    const currentChatId = get().currentChatId;
    if (!currentChatId) {
      toast.error('No chat selected');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error: insertError } = await supabase
        .from('messages')
        .insert({
          chat_id: currentChatId,
          role: 'user',
          content,
          user_id: user.id
        });

      if (insertError) throw insertError;

      // Refresh messages to update the count and display
      await get().fetchMessages(currentChatId);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  }
}));
