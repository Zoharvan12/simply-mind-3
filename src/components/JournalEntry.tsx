
import { JournalCard } from "./JournalCard";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CreateJournalDialog } from "./CreateJournalDialog";

interface JournalEntryProps {
  entry: {
    id: string;
    title: string;
    content: string;
    emotion_rating: number;
    created_at: string;
  };
  onEntryDeleted?: () => void;
  onEntryUpdated?: () => void;
}

export const JournalEntry = ({ entry, onEntryDeleted, onEntryUpdated }: JournalEntryProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("journal_entries")
        .delete()
        .eq("id", entry.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Journal entry deleted successfully",
      });
      
      onEntryDeleted?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <JournalCard className="group flex flex-col min-h-[200px]">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-[#2A3D66] group-hover:text-[#7098DA] transition-colors">
            {entry.title}
          </h3>
          <span className="text-sm text-neutral-500 whitespace-nowrap ml-4">
            {format(new Date(entry.created_at), "MMM d, yyyy")}
          </span>
        </div>

        {/* Content Section */}
        <div className="flex-1 mb-4">
          <p className="text-neutral-600 line-clamp-3">{entry.content}</p>
        </div>

        {/* Footer Section - Always visible with subtle background */}
        <div className="mt-auto pt-4 border-t border-neutral-100">
          <div className="flex items-center justify-between">
            {/* Emotion Rating */}
            <div className="flex items-center gap-2">
              <div className="text-sm text-neutral-500">Emotion Rating:</div>
              <div className="font-medium text-[#2A3D66]">{entry.emotion_rating}/10</div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-neutral-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEditDialog(true);
                }}
              >
                <Pencil className="h-4 w-4 text-[#2A3D66]" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-neutral-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteDialog(true);
                }}
              >
                <Trash2 className="h-4 w-4 text-[#D95B5B]" />
              </Button>
            </div>
          </div>
        </div>
      </JournalCard>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Journal Entry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{entry.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-[#D95B5B] hover:bg-[#D95B5B]/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <CreateJournalDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onEntryCreated={onEntryUpdated}
        isEditing={true}
        editEntry={entry}
      />
    </>
  );
};

