
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export const TopicBarChart = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["topic-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stats")
        .select("common_topics")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      if (!data || data.length === 0) {
        return [];
      }

      // Count topic frequencies
      const topicCount: Record<string, number> = {};
      data.forEach((stat) => {
        stat.common_topics.forEach((topic: string) => {
          topicCount[topic] = (topicCount[topic] || 0) + 1;
        });
      });

      return Object.entries(topicCount)
        .map(([topic, count]) => ({ topic, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5); // Show top 5 topics
    },
  });

  if (isLoading) {
    return (
      <div className="h-[300px] w-full animate-pulse bg-neutral-100/50 rounded-lg" />
    );
  }

  if (!stats || stats.length === 0) {
    return (
      <div className="w-full h-[300px] p-4">
        <h3 className="text-lg font-semibold mb-4">Common Topics</h3>
        <div className="h-full flex items-center justify-center">
          <p className="text-neutral-500">No topics data available yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[300px] p-4">
      <h3 className="text-lg font-semibold mb-4 text-[#2A3D66]">Common Topics</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={stats}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
          <XAxis
            dataKey="topic"
            stroke="#666"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#666"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "0.75rem",
              boxShadow: "0 4px 24px -1px rgba(0,0,0,0.04)",
            }}
          />
          <Bar
            dataKey="count"
            fill="#88C0A3"
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
