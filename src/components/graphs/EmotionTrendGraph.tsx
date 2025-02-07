import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export const EmotionTrendGraph = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["emotion-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stats")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data.map((stat) => ({
        date: format(new Date(stat.created_at), "MMM dd"),
        emotion: stat.emotion_intensity,
        emotionType: stat.overall_emotion,
      }));
    },
  });

  if (isLoading || !stats) {
    return (
      <div className="h-[300px] w-full animate-pulse bg-neutral-100 rounded-lg" />
    );
  }

  return (
    <div className="w-full h-[300px] bg-white rounded-xl p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Emotional Trends</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={stats}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="date"
            stroke="#666"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[1, 10]}
            stroke="#666"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "none",
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          />
          <Line
            type="monotone"
            dataKey="emotion"
            stroke="#9b87f5"
            strokeWidth={2}
            dot={{ fill: "#9b87f5", strokeWidth: 2 }}
            activeDot={{ r: 6, fill: "#7E69AB" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};