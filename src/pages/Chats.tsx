
import { MainLayout } from "@/components/MainLayout";
import { ScrollReveal } from "@/components/ScrollReveal";
import { MessageSquare } from "lucide-react";

const Chats = () => {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="flex items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#2A3D66]">AI Chats</h1>
              <p className="text-neutral-500 mt-1">Have meaningful conversations with AI</p>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid place-items-center h-[60vh]">
          <div className="text-center">
            <MessageSquare className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-neutral-600 mb-2">Start a New Conversation</h2>
            <p className="text-neutral-500 max-w-md">
              Begin your journey with AI-powered conversations designed to support your mental well-being
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Chats;
