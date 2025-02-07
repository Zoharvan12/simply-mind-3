import { useMessagesStore } from "@/stores/useMessagesStore";
import { Loader } from "lucide-react";
import { MessageList } from "./MessageList";

export const ChatMessages = () => {
  const { messages, isLoading } = useMessagesStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <MessageList messages={messages} />;
};