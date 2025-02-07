
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface JournalCardProps {
  className?: string;
  children: React.ReactNode;
}

export const JournalCard = ({ className, children }: JournalCardProps) => {
  return (
    <Card 
      className={cn(
        "glass-card p-6 group hover:scale-[1.02] transition-all duration-300",
        "before:absolute before:inset-0 before:-z-10 before:bg-gradient-elegant before:opacity-0 before:transition-opacity",
        "hover:before:opacity-5",
        className
      )}
    >
      {children}
    </Card>
  );
};
