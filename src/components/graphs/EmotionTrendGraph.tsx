
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays, subMonths, parseISO, isWithinInterval } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { motion } from "framer-motion";

const dateRanges = {
  "1w": { label: "Last Week", days: 7 },
  "1m": { label: "Last Month", days: 30 },
  "6m": { label: "Last 6 Months", days: 180 },
  "all": { label: "All Time", days: null },
};

const getDateFormat = (range: keyof typeof dateRanges) => {
  switch (range) {
    case "1w":
      return "MMM dd, HH:mm";
    case "1m":
      return "MMM dd";
    case "6m":
      return "MMM dd";
    case "all":
      return "MMM yyyy";
    default:
      return "MMM dd";
  }
};

const aggregateDataByDate = (data: any[], dateFormat: string) => {
  const groupedData = data.reduce((acc: { [key: string]: any[] }, item) => {
    const dateKey = format(parseISO(item.created_at), dateFormat);
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(item);
    return acc;
  }, {});

  return Object.entries(groupedData).map(([date, items]) => {
    const avgEmotion = Math.round(
      items.reduce((sum, item) => sum + item.emotion_intensity, 0) / items.length
    );
    
    // Use the most frequent emotion type
    const emotionCounts = items.reduce((acc: { [key: string]: number }, item) => {
      acc[item.overall_emotion] = (acc[item.overall_emotion] || 0) + 1;
      return acc;
    }, {});
    const overallEmotion = Object.entries(emotionCounts).reduce(
      (a, b) => (a[1] > b[1] ? a : b)
    )[0];

    return {
      date,
      emotion: avgEmotion,
      emotionType: overallEmotion,
      rawDate: parseISO(items[0].created_at), // Keep original date for sorting
    };
  });
};

export const EmotionTrendGraph = () => {
  const [dateRange, setDateRange] = useState<keyof typeof dateRanges>("1m");

  const { data: stats, isLoading } = useQuery({
    queryKey: ["emotion-stats", dateRange],
    queryFn: async () => {
      let query = supabase
        .from("stats")
        .select("*")
        .order("created_at", { ascending: true });

      if (dateRange !== "all") {
        const daysAgo = dateRanges[dateRange].days;
        const startDate = subDays(new Date(), daysAgo).toISOString();
        query = query.gte("created_at", startDate);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (!data || data.length === 0) {
        return [];
      }

      const dateFormat = getDateFormat(dateRange);
      const aggregatedData = aggregateDataByDate(data, dateFormat);
      
      // Sort by original date
      return aggregatedData.sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());
    },
  });

  if (isLoading) {
    return (
      <div className="h-[300px] w-full animate-pulse bg-neutral-100 rounded-lg" />
    );
  }

  if (!stats || stats.length === 0) {
    return (
      <div className="w-full h-[300px] bg-white rounded-xl p-4 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Emotional Trends</h3>
        <div className="h-full flex items-center justify-center">
          <p className="text-neutral-500">No emotional trend data available yet.</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 rounded-lg shadow-lg border border-neutral-200">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-neutral-600">
            Emotion Intensity: {data.emotion}
          </p>
          <p className="text-sm text-neutral-600 capitalize">
            Mood: {data.emotionType}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-[300px] bg-gradient-to-br from-white to-neutral-50 rounded-xl p-4 shadow-sm"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Emotional Trends</h3>
        <Select
          value={dateRange}
          onValueChange={(value: keyof typeof dateRanges) => setDateRange(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(dateRanges).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={stats}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="date"
            stroke="#666"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            domain={[1, 10]}
            stroke="#666"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="emotion"
            stroke="#9b87f5"
            strokeWidth={2}
            dot={{ fill: "#9b87f5", strokeWidth: 2 }}
            activeDot={{ r: 6, fill: "#7E69AB" }}
            animationDuration={1500}
            animationEasing="ease-in-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
