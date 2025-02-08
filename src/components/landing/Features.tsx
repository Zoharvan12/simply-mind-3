
import { Brain, BarChart3, BookText } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { FeatureCard } from "./FeatureCard";

const iconMap = {
  'brain': Brain,
  'chart': BarChart3,
  'book': BookText,
} as const;

interface FeaturesProps {
  content: {
    list: Array<{
      title: string;
      description: string;
      icon: keyof typeof iconMap;
    }>;
  };
}

export const Features = ({ content }: FeaturesProps) => {
  return (
    <ScrollReveal>
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {content.list.map((feature, index) => {
              const Icon = iconMap[feature.icon] || Brain;
              return (
                <FeatureCard
                  key={index}
                  icon={Icon}
                  title={feature.title}
                  description={feature.description}
                  index={index}
                />
              );
            })}
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
};

