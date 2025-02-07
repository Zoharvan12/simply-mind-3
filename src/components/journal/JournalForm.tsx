
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { EmotionEmoji } from "../EmotionEmoji";
import { AudioRecorder } from "@/components/chat/AudioRecorder";

interface JournalFormProps {
  title: string;
  onTitleChange: (value: string) => void;
  content: string;
  onContentChange: (value: string) => void;
  emotionRating: number[];
  onEmotionRatingChange: (value: number[]) => void;
  onVoiceTranscription: (text: string) => void;
  isLoading: boolean;
  isEditing: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function JournalForm({
  title,
  onTitleChange,
  content,
  onContentChange,
  emotionRating,
  onEmotionRatingChange,
  onVoiceTranscription,
  isLoading,
  isEditing,
  onSubmit,
}: JournalFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Enter a title for your entry (or let it generate automatically)"
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="content">Content</Label>
            <AudioRecorder onTranscription={onVoiceTranscription} />
          </div>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
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
                onValueChange={onEmotionRatingChange}
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
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Entry" : "Create Entry")}
        </Button>
      </div>
    </form>
  );
}
