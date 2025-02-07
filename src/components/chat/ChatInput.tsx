
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Send } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useMessagesStore } from "@/stores/useMessagesStore";
import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CustomTextArea = (props: any) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const event = new Event('custom-send');
      window.dispatchEvent(event);
    }
  };

  return (
    <textarea
      {...props}
      onKeyDown={(e) => {
        handleKeyDown(e);
        props.onKeyDown?.(e);
      }}
    />
  );
};

export const ChatInput = () => {
  const [message, setMessage] = useState("");
  const { sendMessage } = useMessagesStore();
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      const currentMessage = message.trim();
      setMessage(""); // Clear input immediately
      await sendMessage(currentMessage);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);

    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = async () => {
    if (!mediaRecorderRef.current) return;

    return new Promise<void>((resolve) => {
      if (!mediaRecorderRef.current) return resolve();

      mediaRecorderRef.current.onstop = async () => {
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          
          // Convert blob to base64
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64Audio = reader.result as string;
            const base64Data = base64Audio.split(',')[1]; // Remove data URL prefix

            const { data, error } = await supabase.functions.invoke('transcribe-audio', {
              body: { audio: base64Data }
            });

            if (error) {
              throw error;
            }

            if (data?.text) {
              setMessage(data.text);
            }
          };
        } catch (error) {
          console.error("Error transcribing audio:", error);
          toast.error("Error transcribing audio. Please try again.");
        }

        // Clean up
        mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        resolve();
      };

      mediaRecorderRef.current.stop();
    });
  };

  const toggleRecording = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  useEffect(() => {
    const handleCustomSend = () => {
      handleSendMessage();
    };
    
    window.addEventListener('custom-send', handleCustomSend);
    return () => window.removeEventListener('custom-send', handleCustomSend);
  }, [message]); // Add message as dependency since handleSendMessage uses it

  return (
    <div className="p-4 border-t">
      <div className="relative glass-card rounded-lg">
        <ReactMde
          value={message}
          onChange={setMessage}
          selectedTab="write"
          generateMarkdownPreview={markdown =>
            Promise.resolve(markdown)
          }
          toolbarCommands={[]}
          textAreaComponent={CustomTextArea}
          classes={{
            reactMde: "border-none bg-transparent",
            textArea: "bg-transparent border-none focus:outline-none"
          }}
        />
        <div className="absolute right-2 bottom-2 flex gap-2">
          <Button 
            size="icon" 
            variant="ghost"
            onClick={toggleRecording}
            className={`transition-all duration-200 ${isRecording ? 'border-2 border-red-500 text-red-500 hover:text-red-600 hover:border-red-600' : ''}`}
          >
            <Mic className="h-5 w-5" />
          </Button>
          <Button 
            size="icon"
            onClick={handleSendMessage}
            className="bg-primary text-white hover:bg-primary/90"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
