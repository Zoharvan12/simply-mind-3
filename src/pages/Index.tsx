
import { Plus } from "lucide-react";
import { MainLayout } from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { CreateJournalDialog } from "@/components/CreateJournalDialog";
import { JournalEntry } from "@/components/JournalEntry";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: entries, isLoading, refetch } = useQuery({
    queryKey: ["journal-entries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleEntryModified = () => {
    refetch();
  };

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
            <Button
              className="bg-[#88C0A3] hover:bg-[#88C0A3]/90"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="h-5 w-5 mr-2" />
              New Entry
            </Button>
          </div>
        </ScrollReveal>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <div className="h-[200px] rounded-lg bg-neutral-100 animate-pulse" />
              </ScrollReveal>
            ))
          ) : entries?.length === 0 ? (
            // Empty state
            <div className="col-span-full text-center py-12">
              <p className="text-neutral-500">No journal entries yet. Create your first one!</p>
            </div>
          ) : (
            // Journal entries
            entries?.map((entry, index) => (
              <ScrollReveal key={entry.id} delay={index * 100}>
                <JournalEntry
                  entry={entry}
                  onEntryDeleted={handleEntryModified}
                  onEntryUpdated={handleEntryModified}
                />
              </ScrollReveal>
            ))
          )}
        </div>
      </div>

      <CreateJournalDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onEntryCreated={handleEntryModified}
      />
    </MainLayout>
  );
};

export default Index;
