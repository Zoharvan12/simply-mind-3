
import { MainLayout } from "@/components/MainLayout";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ChatInterface } from "@/components/chat/ChatInterface";

const Chats = () => {
  return (
    <MainLayout>
      <div className="h-full">
        <ScrollReveal>
          <div className="flex items-center mb-4 px-2">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary 
                           bg-clip-text text-transparent">
                AI Chats
              </h1>
              <p className="text-neutral-500 mt-1 text-sm">
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

