import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Smile, Meh, Frown } from "lucide-react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const moodConfig = {
  positive: { icon: Smile, color: "text-green-500", bg: "bg-green-50" },
  neutral: { icon: Meh, color: "text-yellow-500", bg: "bg-yellow-50" },
  negative: { icon: Frown, color: "text-red-500", bg: "bg-red-50" },
};

export const SummaryCard = () => {
  const { data: latestStat, isLoading } = useQuery({
    queryKey: ["latest-stat"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stats")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="h-[200px] w-full animate-pulse bg-neutral-100 rounded-lg" />
    );
  }

  if (!latestStat) {
    return (
      <div className="bg-gradient-to-br from-white to-neutral-50 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Your Emotional Summary</h3>
        <p className="text-neutral-500">
          No analysis available yet. Start writing journal entries to see insights about your emotional journey.
        </p>
      </div>
    );
  }

  const MoodIcon = moodConfig[latestStat.overall_emotion as keyof typeof moodConfig].icon;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-gradient-to-br from-white to-neutral-50 rounded-xl p-6 shadow-sm"
    >
      <h3 className="text-lg font-semibold mb-4">Your Emotional Summary</h3>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-neutral-500">Overall Mood</p>
          <div className="flex items-center gap-2 mt-1">
            <div className={`p-1.5 rounded-full ${moodConfig[latestStat.overall_emotion as keyof typeof moodConfig].bg}`}>
              <MoodIcon className={`w-5 h-5 ${moodConfig[latestStat.overall_emotion as keyof typeof moodConfig].color}`} />
            </div>
            <p className={`capitalize ${moodConfig[latestStat.overall_emotion as keyof typeof moodConfig].color}`}>
              {latestStat.overall_emotion}
            </p>
          </div>
        </div>
        <div>
          <p className="text-sm text-neutral-500">Common Topics</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {latestStat.common_topics.map((topic: string) => (
              <Dialog key={topic}>
                <DialogTrigger asChild>
                  <button className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 transition-colors rounded-full text-sm text-neutral-600">
                    {topic}
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Insights about "{topic}"</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-neutral-600">
                      This topic appears frequently in your journal entries. Here's what we've noticed:
                    </p>
                    <div className="p-4 bg-neutral-50 rounded-lg">
                      <p className="text-sm text-neutral-700">
                        {latestStat.summary}
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm text-neutral-500">Analysis</p>
          <p className="text-neutral-800">{latestStat.summary}</p>
        </div>
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <p className="text-green-700 text-sm">
            🌟 Keep going! Your consistent journaling helps build better self-awareness.
          </p>
        </div>
      </div>
    </motion.div>
  );
};