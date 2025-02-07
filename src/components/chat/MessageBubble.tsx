import { cn } from "@/lib/utils";
import { Message } from "@/stores/messages/types";
import { Loader } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

// Helper function to detect RTL text
const isRTL = (text: string) => {
  const rtlRegex = /[\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC]/;
  return rtlRegex.test(text);
};

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isRtl = isRTL(message.content);
  
  return (
    <div className={cn("flex", message.role === 'user' ? "justify-end" : "justify-start")}>
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
};