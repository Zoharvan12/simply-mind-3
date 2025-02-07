import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatControlsProps {
  onSend: () => void;
}

export const ChatControls = ({ onSend }: ChatControlsProps) => {
  return (
    <Button 
      size="icon"
      onClick={onSend}
      className="bg-primary text-white hover:bg-primary/90"
    >
      <Send className="h-5 w-5" />
    </Button>
  );
};