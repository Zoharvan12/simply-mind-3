
import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white/80 p-8 shadow-lg transition-all duration-300 hover:shadow-xl backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-accent-light/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative z-10 flex flex-col gap-4">
        <div className="text-neutral-600">{icon}</div>
        <h3 className="text-xl font-semibold text-neutral-800">{title}</h3>
        <p className="text-neutral-600">{description}</p>
      </div>
    </div>
  );
};
