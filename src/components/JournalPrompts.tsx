
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "./ui/scroll-area";

interface JournalPrompt {
  id: string;
  title: string;
  description: string;
  category: string;
}

interface JournalPromptsProps {
  onSelectPrompt: (prompt: JournalPrompt) => void;
}

export function JournalPrompts({ onSelectPrompt }: JournalPromptsProps) {
  const { data: prompts, isLoading } = useQuery({
    queryKey: ["journal-prompts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("journal_prompts")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as JournalPrompt[];
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-4 animate-pulse bg-neutral-100" />
        ))}
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-2">
        {prompts?.map((prompt) => (
          <Card
            key={prompt.id}
            className="p-4 cursor-pointer hover:bg-neutral-50 transition-colors"
            onClick={() => onSelectPrompt(prompt)}
          >
            <h3 className="font-medium text-[#2A3D66] mb-1">{prompt.title}</h3>
            <p className="text-sm text-neutral-600">{prompt.description}</p>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
