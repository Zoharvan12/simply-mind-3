
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const generateJournalTitle = async (content: string) => {
  try {
    const { data: response, error } = await supabase.functions.invoke('chat-with-context', {
      body: {
        content,
        isFirstMessage: true,
        chatId: 'temp'
      }
    });

    if (error) throw error;
    return response?.message || null;
  } catch (error: any) {
    console.error('Error generating title:', error);
    toast({
      title: "Error",
      description: "Failed to generate title. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};

export const createJournalEntry = async (data: {
  title: string;
  content: string;
  emotion_rating: number;
  user_id: string;
}) => {
  const { error } = await supabase.from("journal_entries").insert(data);
  if (error) throw error;
};

export const updateJournalEntry = async (
  id: string,
  data: {
    title: string;
    content: string;
    emotion_rating: number;
  }
) => {
  const { error } = await supabase
    .from("journal_entries")
    .update(data)
    .eq("id", id);
  if (error) throw error;
};
