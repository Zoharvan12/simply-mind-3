
import { supabase } from '@/integrations/supabase/client';
import { Message } from './types';
import { toast } from 'sonner';

export const fetchMessages = async (chatId: string) => {
  try {
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return messages || [];
  } catch (error) {
    console.error('Error fetching messages:', error);
    toast.error('Failed to fetch messages');
    return [];
  }
};

export const sendMessage = async (
  content: string,
  chatId: string,
  messages: Message[]
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

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

    const isFirstMessage = messages.length === 0;

    const { data: aiResponse, error: aiError } = await supabase.functions
      .invoke('chat-with-context', {
        body: {
          content,
          chatId,
          isFirstMessage
        }
      });

    if (aiError) throw aiError;

    return { message, isFirstMessage };
  } catch (error) {
    console.error('Error sending message:', error);
    toast.error('Failed to send message');
    throw error;
  }
};
