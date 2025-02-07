
import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";
import { useMessagesStore } from "@/stores/useMessagesStore";
import { useUserRole } from "@/hooks/useUserRole";

const isRTL = (text: string) => {
  const rtlRegex = /[\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC]/;
  return rtlRegex.test(text);
};

const CustomTextArea = (props: any) => {
  const { role } = useUserRole();
  const { isLimitReached } = useMessagesStore();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLimitReached) {
        console.log('Sending message via Enter key');
        const event = new Event('custom-send');
        window.dispatchEvent(event);
      } else {
        console.log('Message limit reached, blocking Enter key send');
      }
    }
  };

  const textDir = isRTL(props.value) ? 'rtl' : 'ltr';

  return (
    <textarea
      {...props}
      dir={textDir}
      className={`rtl-support ${props.className || ''}`}
      onKeyDown={(e) => {
        handleKeyDown(e);
        props.onKeyDown?.(e);
      }}
    />
  );
};

interface MessageComposerProps {
  value: string;
  onChange: (value: string) => void;
}

export const MessageComposer = ({ value, onChange }: MessageComposerProps) => {
  return (
    <ReactMde
      value={value}
      onChange={onChange}
      selectedTab="write"
      generateMarkdownPreview={markdown => Promise.resolve(markdown)}
      toolbarCommands={[]}
      textAreaComponent={CustomTextArea}
      classes={{
        reactMde: "border-none bg-transparent",
        textArea: "bg-transparent border-none focus:outline-none rtl-support"
      }}
    />
  );
};
