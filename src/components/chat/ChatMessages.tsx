
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMessagesStore } from "@/stores/useMessagesStore";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { Loader } from "lucide-react";

// Helper function to detect RTL text
const isRTL = (text: string) => {
  const rtlRegex = /[\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC]/;
  return rtlRegex.test(text);
};

export const ChatMessages = () => {
  const { messages, isLoading } = useMessagesStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const prevMessagesLengthRef = useRef(messages.length);

  const scrollToBottom = () => {
    if (messagesEndRef.current && shouldAutoScroll) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const currentLength = messages.length;
    const hadNewMessage = currentLength > prevMessagesLengthRef.current;
    prevMessagesLengthRef.current = currentLength;

    if (hadNewMessage) {
      scrollToBottom();
    }
  }, [messages]);

  const handleScroll = () => {
    if (!viewportRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = viewportRef.current;
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
    setShouldAutoScroll(distanceFromBottom < 20);
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
      className="h-full"
      onWheel={handleScroll}
    >
      <div 
        className="space-y-3 p-3"
        ref={viewportRef}
        onScroll={handleScroll}
      >
        {messages.map((message) => {
          const isRtl = isRTL(message.content);
          return (
            <div key={message.id} className={cn("flex", message.role === 'user' ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[80%] p-2.5 rounded-lg chat-message",
                message.role === 'user' ? "bg-primary text-white" : "glass-card"
              )}>
                {message.isLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader className="h-4 w-4 animate-spin" />
                    <span className="text-xs">AI is thinking...</span>
                  </div>
                ) : (
                  <div className={cn(
                    "prose prose-sm max-w-none whitespace-pre-wrap",
                    message.role === 'user' ? "prose-invert" : "prose-neutral",
                    isRtl ? "rtl" : "ltr"
                  )}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw, rehypeSanitize]}
                      components={{
                        p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

