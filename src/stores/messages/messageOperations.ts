
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

    // Insert user message
    const { data: userMessage, error: messageError } = await supabase
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

    // Get AI response
    const { data: aiResponse, error: aiError } = await supabase.functions
      .invoke('chat-with-context', {
        body: {
          content,
          chatId,
          isFirstMessage
        }
      });

    if (aiError) throw aiError;

    // Fetch the AI message that was stored by the edge function
    const { data: aiMessage, error: fetchAiError } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .eq('role', 'ai')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchAiError) throw fetchAiError;

    return { 
      userMessage, 
      aiMessage,
      isFirstMessage 
    };
  } catch (error) {
    console.error('Error sending message:', error);
    toast.error('Failed to send message');
    throw error;
  }
};
