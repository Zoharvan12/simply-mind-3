import { Progress } from "@/components/ui/progress";

interface MessageLimitIndicatorProps {
  messageCount: number;
}

export const MessageLimitIndicator = ({ messageCount }: MessageLimitIndicatorProps) => {
  return (
    <div className="mt-2">
      <div className="flex justify-between text-sm text-neutral-500 mb-1">
        <span>Monthly message limit</span>
        <span>{messageCount}/50 messages</span>
      </div>
      <Progress value={(messageCount / 50) * 100} className="h-1" />
    </div>
  );
};