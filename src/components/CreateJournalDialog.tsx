
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useJournalForm } from "@/hooks/useJournalForm";
import { JournalForm } from "./journal/JournalForm";

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
  const {
    title,
    setTitle,
    content,
    emotionRating,
    setEmotionRating,
    isLoading,
    handleContentChange,
    handleSubmit,
  } = useJournalForm({
    isEditing,
    editEntry,
    onSuccess: onEntryCreated,
    onClose: () => onOpenChange(false),
  });

  const handleVoiceTranscription = (text: string) => {
    handleContentChange(content + (content ? '\n' : '') + text);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Journal Entry" : "New Journal Entry"}</DialogTitle>
          <DialogDescription>
            Write your thoughts and feelings. Rate your emotional state on a scale of 1-10.
          </DialogDescription>
        </DialogHeader>
        <JournalForm
          title={title}
          onTitleChange={setTitle}
          content={content}
          onContentChange={handleContentChange}
          emotionRating={emotionRating}
          onEmotionRatingChange={setEmotionRating}
          onVoiceTranscription={handleVoiceTranscription}
          isLoading={isLoading}
          isEditing={isEditing}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
