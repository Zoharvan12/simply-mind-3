
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateJournalTitle, createJournalEntry, updateJournalEntry } from "@/services/journalService";

interface UseJournalFormProps {
  isEditing?: boolean;
  editEntry?: {
    id: string;
    title: string;
    content: string;
    emotion_rating: number;
  };
  onSuccess?: () => void;
  onClose: () => void;
}

export const useJournalForm = ({ isEditing = false, editEntry, onSuccess, onClose }: UseJournalFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [emotionRating, setEmotionRating] = useState([5]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isEditing && editEntry) {
      setTitle(editEntry.title);
      setContent(editEntry.content);
      setEmotionRating([editEntry.emotion_rating]);
    }
  }, [isEditing, editEntry]);

  const handleContentChange = async (newContent: string) => {
    setContent(newContent);
    if (!title && newContent.length > 10) {
      const generatedTitle = await generateJournalTitle(newContent);
      if (generatedTitle) setTitle(generatedTitle);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to create a journal entry");

      let finalTitle = title;
      if (!finalTitle && content) {
        finalTitle = await generateJournalTitle(content) || "Untitled Entry";
      }

      if (isEditing && editEntry) {
        await updateJournalEntry(editEntry.id, {
          title: finalTitle || "Untitled Entry",
          content,
          emotion_rating: emotionRating[0],
        });
      } else {
        await createJournalEntry({
          title: finalTitle || "Untitled Entry",
          content,
          emotion_rating: emotionRating[0],
          user_id: user.id,
        });
      }

      toast({
        title: "Success",
        description: `Journal entry ${isEditing ? 'updated' : 'created'} successfully`,
      });
      
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    title,
    setTitle,
    content,
    emotionRating,
    setEmotionRating,
    isLoading,
    handleContentChange,
    handleSubmit,
  };
};
