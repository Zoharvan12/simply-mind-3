
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EmotionEmoji } from "./EmotionEmoji";
import { AudioRecorder } from "@/components/chat/AudioRecorder";

interface CreateJournalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEntryCreated?: () => void;
  isEditing?: boolean;
  editEntry?: {
    id: string;
    title: string;
    content: string;
    emotion_rating: number;
  };
}

export function CreateJournalDialog({
  open,
  onOpenChange,
  onEntryCreated,
  isEditing = false,
  editEntry,
}: CreateJournalDialogProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [emotionRating, setEmotionRating] = useState([5]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && isEditing && editEntry) {
      setTitle(editEntry.title);
      setContent(editEntry.content);
      setEmotionRating([editEntry.emotion_rating]);
    }
  }, [open, isEditing, editEntry]);

  useEffect(() => {
    if (!open && hasSubmitted) {
      setTitle("");
      setContent("");
      setEmotionRating([5]);
      setHasSubmitted(false);
    }
  }, [open, hasSubmitted]);

  const generateTitle = async (content: string) => {
    try {
      const { data: response, error } = await supabase.functions.invoke('chat-with-context', {
        body: {
          content,
          isFirstMessage: true,
          chatId: 'temp'
        }
      });

      if (error) throw error;
      if (response?.message) {
        setTitle(response.message);
      }
    } catch (error: any) {
      console.error('Error generating title:', error);
      toast({
        title: "Error",
        description: "Failed to generate title. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleContentChange = async (newContent: string) => {
    setContent(newContent);
    if (!title && newContent.length > 10) {
      await generateTitle(newContent);
    }
  };

  const handleVoiceTranscription = (text: string) => {
    setContent(prev => prev + (prev ? '\n' : '') + text);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to create a journal entry");
      }

      // If no title was entered, generate one
      if (!title && content) {
        await generateTitle(content);
      }

      if (isEditing && editEntry) {
        const { error } = await supabase
          .from("journal_entries")
          .update({
            title: title || "Untitled Entry", // Fallback title if generation failed
            content,
            emotion_rating: emotionRating[0],
          })
          .eq("id", editEntry.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Journal entry updated successfully",
        });
      } else {
        const { error } = await supabase.from("journal_entries").insert({
          title: title || "Untitled Entry", // Fallback title if generation failed
          content,
          emotion_rating: emotionRating[0],
          user_id: user.id
        });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Journal entry created successfully",
        });
      }

      setHasSubmitted(true);
      onOpenChange(false);
      onEntryCreated?.();
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Journal Entry" : "New Journal Entry"}</DialogTitle>
            <DialogDescription>
              Write your thoughts and feelings. Rate your emotional state on a scale of 1-10.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for your entry (or let it generate automatically)"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="content">Content</Label>
                <AudioRecorder onTranscription={handleVoiceTranscription} />
              </div>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Write your thoughts here..."
                className="min-h-[150px]"
                required
              />
            </div>
            <div className="grid gap-4">
              <Label>Emotion Rating (1-10)</Label>
              <div className="flex flex-col items-center gap-4">
                <EmotionEmoji rating={emotionRating[0]} />
                <div className="flex items-center gap-4 w-full">
                  <Slider
                    value={emotionRating}
                    onValueChange={setEmotionRating}
                    min={1}
                    max={10}
                    step={1}
                    className="flex-1"
                  />
                  <span className="w-12 text-center font-medium">{emotionRating[0]}</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Entry" : "Create Entry")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
