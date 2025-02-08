
import { ScrollReveal } from "@/components/ScrollReveal";
import { PricingCard } from "./PricingCard";

interface PricingProps {
  content: {
    plans: Array<{
      name: string;
      price: string;
      features: string[];
    }>;
  };
}

export const Pricing = ({ content }: PricingProps) => {
  // Ensure content and plans exist before rendering
  if (!content?.plans) {
    console.warn('Pricing content or plans is missing');
    return null;
  }

  return (
    <ScrollReveal>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {content.plans.map((plan, index) => (
              <PricingCard key={index} plan={plan} index={index} />
            ))}
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
};
