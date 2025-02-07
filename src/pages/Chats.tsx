
import { MainLayout } from "@/components/MainLayout";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ChatInterface } from "@/components/chat/ChatInterface";

const Chats = () => {
  return (
    <MainLayout>
      <div className="h-full flex flex-col">
        <ScrollReveal>
          <div className="flex items-center p-3">
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
        
        <div className="flex-1 p-3 min-h-0">
          <ChatInterface />
        </div>
      </div>
    </MainLayout>
  );
};

export default Chats;
