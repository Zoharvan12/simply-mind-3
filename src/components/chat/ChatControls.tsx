import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useUserRole } from "@/hooks/useUserRole";

interface ChatControlsProps {
  onSend: () => void;
  messageCount: number;
}

export const ChatControls = ({ onSend, messageCount }: ChatControlsProps) => {
  const { role } = useUserRole();

  return (
    <>
      {role === 'free' && (
        <div className="mb-2 px-2">
          <div className="flex justify-between text-sm text-neutral-500 mb-1">
            <span>Monthly message limit</span>
            <span>{messageCount}/50 messages</span>
          </div>
          <Progress value={(messageCount / 50) * 100} className="h-1" />
        </div>
      )}
      <Button 
        size="icon"
        onClick={onSend}
        className="bg-primary text-white hover:bg-primary/90"
      >
        <Send className="h-5 w-5" />
      </Button>
    </>
  );
};