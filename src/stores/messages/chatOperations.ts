
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Chat } from './types';

export const createNewChat = async (chats: Chat[]) => {
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

    return { newChats: [...chats, chat], chatId: chat.id };
  } catch (error) {
    console.error('Error creating chat:', error);
    toast.error('Failed to create new chat');
    throw error;
  }
};

export const fetchChats = async () => {
  try {
    const { data: chats, error } = await supabase
      .from('chats')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return chats || [];
  } catch (error) {
    console.error('Error fetching chats:', error);
    toast.error('Failed to fetch chats');
    return [];
  }
};

export const renameChat = async (chatId: string, newTitle: string) => {
  try {
    const { error } = await supabase
      .from('chats')
      .update({ title: newTitle })
      .eq('id', chatId);

    if (error) throw error;
    toast.success('Chat renamed successfully');
    return true;
  } catch (error) {
    console.error('Error renaming chat:', error);
    toast.error('Failed to rename chat');
    return false;
  }
};

export const deleteChat = async (chatId: string) => {
  try {
    const { error } = await supabase
      .from('chats')
      .delete()
      .eq('id', chatId);

    if (error) throw error;
    toast.success('Chat deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting chat:', error);
    toast.error('Failed to delete chat');
    return false;
  }
};

