
import { MainLayout } from "@/components/MainLayout";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ChatInterface } from "@/components/chat/ChatInterface";

const Chats = () => {
  return (
    <MainLayout>
      <div className="max-w-[1200px] mx-auto">
        <ScrollReveal>
          <div className="flex items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#2A3D66]">AI Chats</h1>
              <p className="text-neutral-500 mt-1">Have meaningful conversations with AI</p>
            </div>
          </div>
        </ScrollReveal>
        
        <ChatInterface />
      </div>
    </MainLayout>
  );
};

export default Chats;
