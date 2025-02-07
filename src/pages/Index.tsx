
import { Plus } from "lucide-react";
import { MainLayout } from "@/components/MainLayout";
import { JournalCard } from "@/components/JournalCard";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";

const Index = () => {
  const dummyEntries = [
    { id: 1, title: "Morning Reflection", content: "Started the day with meditation..." },
    { id: 2, title: "Afternoon Notes", content: "Had a productive meeting..." },
    { id: 3, title: "Evening Thoughts", content: "Feeling grateful for..." },
    { id: 4, title: "Daily Goals", content: "Completed most tasks..." },
    { id: 5, title: "Mindful Moments", content: "Took time to breathe..." },
    { id: 6, title: "Future Plans", content: "Planning for tomorrow..." },
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <ScrollReveal>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#2A3D66]">Journal Entries</h1>
              <p className="text-neutral-500 mt-1">Capture your thoughts and feelings</p>
            </div>
            <Button className="bg-[#88C0A3] hover:bg-[#88C0A3]/90">
              <Plus className="h-5 w-5 mr-2" />
              New Entry
            </Button>
          </div>
        </ScrollReveal>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyEntries.map((entry, index) => (
            <ScrollReveal key={entry.id} delay={index * 100}>
              <JournalCard className="h-[200px] group cursor-pointer">
                <h3 className="text-lg font-semibold text-[#2A3D66] mb-2 group-hover:text-[#7098DA] transition-colors">
                  {entry.title}
                </h3>
                <p className="text-neutral-600 line-clamp-4">{entry.content}</p>
              </JournalCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
