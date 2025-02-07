
import { JournalCard } from "./JournalCard";
import { format } from "date-fns";

interface JournalEntryProps {
  entry: {
    id: string;
    title: string;
    content: string;
    emotion_rating: number;
    created_at: string;
  };
}

export const JournalEntry = ({ entry }: JournalEntryProps) => {
  return (
    <JournalCard className="h-[200px] group cursor-pointer">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-[#2A3D66] group-hover:text-[#7098DA] transition-colors">
          {entry.title}
        </h3>
        <span className="text-sm text-neutral-500">
          {format(new Date(entry.created_at), "MMM d, yyyy")}
        </span>
      </div>
      <p className="text-neutral-600 line-clamp-3 mb-2">{entry.content}</p>
      <div className="mt-auto">
        <div className="flex items-center gap-2">
          <div className="text-sm text-neutral-500">Emotion Rating:</div>
          <div className="font-medium text-[#2A3D66]">{entry.emotion_rating}/10</div>
        </div>
      </div>
    </JournalCard>
  );
};
