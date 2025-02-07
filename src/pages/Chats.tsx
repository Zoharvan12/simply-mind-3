
import { MainLayout } from "@/components/MainLayout";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ChatInterface } from "@/components/chat/ChatInterface";

const Chats = () => {
  return (
    <MainLayout>
      <div className="max-w-[1200px] mx-auto px-6">
        <ScrollReveal>
          <div className="flex items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary 
                           bg-clip-text text-transparent">
                AI Chats
              </h1>
              <p className="text-neutral-500 mt-2 text-lg">
                Have meaningful conversations with AI
              </p>
            </div>
          </div>
        </ScrollReveal>
        
        <ChatInterface />
      </div>
    </MainLayout>
  );
};

export default Chats;
