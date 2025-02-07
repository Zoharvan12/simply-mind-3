
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
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface CreateJournalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEntryCreated?: () => void;
}

export function CreateJournalDialog({ open, onOpenChange, onEntryCreated }: CreateJournalDialogProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [emotionRating, setEmotionRating] = useState([5]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to create a journal entry");
      }

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

      setTitle("");
      setContent("");
      setEmotionRating([5]);
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
            <DialogTitle>New Journal Entry</DialogTitle>
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
              {isLoading ? "Creating..." : "Create Entry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
