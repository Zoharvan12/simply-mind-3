
import { MainLayout } from "@/components/MainLayout";
import { ScrollReveal } from "@/components/ScrollReveal";
import { EmotionTrendGraph } from "@/components/graphs/EmotionTrendGraph";
import { TopicBarChart } from "@/components/graphs/TopicBarChart";
import { SummaryCard } from "@/components/graphs/SummaryCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Graph = () => {
  // Trigger analysis when visiting the page
  const { isLoading: isAnalyzing } = useQuery({
    queryKey: ["analyze-entries"],
    queryFn: async () => {
      const response = await supabase.functions.invoke("analyze-journal-entries", {
        method: "POST",
      });
      if (response.error) throw response.error;
      return response.data;
    },
  });

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ScrollReveal>
          <div className="mb-8 p-6 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10">
            <h1 className="text-3xl font-bold text-[#2A3D66] mb-2">
              Your Mood & Insights
            </h1>
            <p className="text-neutral-500">
              Track your emotional journey and discover patterns in your well-being
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Main content area */}
            <div className="md:col-span-2 space-y-6">
              <div className="glass-card transform hover:scale-[1.01] transition-all duration-300">
                <EmotionTrendGraph />
              </div>
              <div className="glass-card transform hover:scale-[1.01] transition-all duration-300">
                <TopicBarChart />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="glass-card transform hover:scale-[1.01] transition-all duration-300">
                <SummaryCard />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </MainLayout>
  );
};

export default Graph;
