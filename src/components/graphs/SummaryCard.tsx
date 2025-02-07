import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Your Emotional Summary</h3>
        <p className="text-neutral-500">
          No analysis available yet. Start writing journal entries to see insights about your emotional journey.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Your Emotional Summary</h3>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-neutral-500">Overall Mood</p>
          <p className="text-neutral-800 capitalize">{latestStat.overall_emotion}</p>
        </div>
        <div>
          <p className="text-sm text-neutral-500">Common Topics</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {latestStat.common_topics.map((topic: string) => (
              <span
                key={topic}
                className="px-2 py-1 bg-neutral-100 rounded-full text-sm text-neutral-600"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm text-neutral-500">Analysis</p>
          <p className="text-neutral-800">{latestStat.summary}</p>
        </div>
      </div>
    </div>
  );
};