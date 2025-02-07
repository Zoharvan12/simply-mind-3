
import { Sparkles, Lightbulb, Heart } from "lucide-react";
import { Hero } from "@/components/Hero";
import { FeatureCard } from "@/components/FeatureCard";
import { ScrollReveal } from "@/components/ScrollReveal";

const Index = () => {
  const features = [
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "Premium Design",
      description: "Carefully crafted with attention to every detail for a premium user experience.",
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "Intuitive Interface",
      description: "Simple yet powerful interface that makes your application a joy to use.",
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Made with Love",
      description: "Built with passion and care to ensure the best possible experience.",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Hero />
      
      <section className="py-24">
        <div className="container px-4">
          <ScrollReveal>
            <h2 className="text-center text-3xl font-bold text-neutral-800 md:text-4xl">
              Features
            </h2>
          </ScrollReveal>
          
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <ScrollReveal key={feature.title} delay={index * 100}>
                <FeatureCard {...feature} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
