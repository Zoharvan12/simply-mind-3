
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { useMessagesStore } from "@/stores/useMessagesStore";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChatControlsProps {
  onSend: () => void;
}

export const ChatControls = ({ onSend }: ChatControlsProps) => {
  const { role } = useUserRole();
  const { monthlyMessages, isLimitReached } = useMessagesStore();

  const handleSend = () => {
    if (isLimitReached) {
      console.log('Message limit reached, blocking send');
      return;
    }
    onSend();
  };

  const SendButton = () => (
    <Button 
      size="icon"
      onClick={handleSend}
      disabled={isLimitReached}
      className="bg-primary text-white hover:bg-primary/90 disabled:bg-gray-400"
    >
      <Send className="h-5 w-5" />
    </Button>
  );

  if (isLimitReached) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <SendButton />
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>You've reached your monthly message limit. Upgrade to premium for unlimited messages!</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return <SendButton />;
};
