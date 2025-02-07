
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMessagesStore } from "@/stores/useMessagesStore";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { Loader } from "lucide-react";

export const ChatMessages = () => {
  const { messages, isLoading } = useMessagesStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const prevMessagesLengthRef = useRef(messages.length);

  // Handle auto-scrolling based on new messages and scroll position
  useEffect(() => {
    const currentLength = messages.length;
    const hadNewMessage = currentLength > prevMessagesLengthRef.current;
    prevMessagesLengthRef.current = currentLength;

    // Only scroll if there's a new message and auto-scroll is enabled
    if (hadNewMessage && shouldAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, shouldAutoScroll]);

  // Track scroll position to determine if we should auto-scroll
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (!scrollAreaRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
    
    // Enable auto-scroll when user is near bottom (within 100px)
    setShouldAutoScroll(distanceFromBottom < 100);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ScrollArea 
      className="h-[calc(100vh-20rem)]"
      onWheel={handleScroll}
      ref={scrollAreaRef}
    >
      <div className="space-y-4 p-4">
        {messages.map((message) => (
          <div key={message.id} className={cn("flex", message.role === 'user' ? "justify-end" : "justify-start")}>
            <div className={cn(
              "max-w-[80%] p-3 rounded-lg",
              message.role === 'user' ? "bg-primary text-white" : "glass-card"
            )}>
              {message.isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader className="h-4 w-4 animate-spin" />
                  <span className="text-sm">AI is thinking...</span>
                </div>
              ) : (
                <div className={cn(
                  "prose prose-sm max-w-none whitespace-pre-wrap",
                  message.role === 'user' ? "prose-invert" : "prose-neutral"
                )}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}
              <div className="text-xs mt-1 opacity-70">
                {new Date(message.created_at).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};
