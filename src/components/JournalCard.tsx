
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface JournalCardProps {
  className?: string;
  children: React.ReactNode;
}

export const JournalCard = ({ className, children }: JournalCardProps) => {
  return (
    <Card className={cn(
      "p-6 transition-all duration-200 hover:shadow-lg bg-white/80 backdrop-blur-sm border-transparent",
      className
    )}>
      {children}
    </Card>
  );
};
