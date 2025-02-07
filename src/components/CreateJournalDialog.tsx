
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
import { JournalPrompts } from "./JournalPrompts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  // Populate form when editing and dialog opens
  useEffect(() => {
    if (open && isEditing && editEntry) {
      setTitle(editEntry.title);
      setContent(editEntry.content);
      setEmotionRating([editEntry.emotion_rating]);
    }
  }, [open, isEditing, editEntry]);

  // Reset form only when closing after successful submission
  useEffect(() => {
    if (!open && hasSubmitted) {
      setTitle("");
      setContent("");
      setEmotionRating([5]);
      setHasSubmitted(false);
    }
  }, [open, hasSubmitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to create a journal entry");
      }

      if (isEditing && editEntry) {
        // Update existing entry
        const { error } = await supabase
          .from("journal_entries")
          .update({
            title,
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
        // Create new entry
        const { error } = await supabase.from("journal_entries").insert({
          title,
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

  const handlePromptSelect = (prompt: { title: string; description: string }) => {
    setTitle(prompt.title);
    setContent(prompt.description);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Journal Entry" : "New Journal Entry"}</DialogTitle>
          <DialogDescription>
            Write your thoughts and feelings. Rate your emotional state on a scale of 1-10.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="write" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="write">Write Entry</TabsTrigger>
            <TabsTrigger value="prompts" disabled={isEditing}>Use Prompt</TabsTrigger>
          </TabsList>
          
          <TabsContent value="write">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a title for your entry"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your thoughts here..."
                    className="min-h-[150px]"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Emotion Rating (1-10)</Label>
                  <div className="flex items-center gap-4">
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
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Entry" : "Create Entry")}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="prompts">
            <div className="py-4">
              <h3 className="text-sm font-medium text-neutral-500 mb-4">
                Select a prompt to start your journal entry:
              </h3>
              <JournalPrompts onSelectPrompt={handlePromptSelect} />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
