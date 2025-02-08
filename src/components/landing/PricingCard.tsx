
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface PricingCardProps {
  plan: {
    name: string;
    price: string;
    features: string[];
  };
  index: number;
}

export const PricingCard = ({ plan, index }: PricingCardProps) => {
  if (!plan) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)" 
      }}
      className="glass-card text-center relative overflow-hidden p-8"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
      <p className="text-4xl font-semibold mb-6">{plan.price}</p>
      <ul className="space-y-4">
        {plan.features?.map((feature, idx) => (
          <li key={idx} className="text-muted-foreground">
            {feature}
          </li>
        ))}
      </ul>
      <Button 
        className="mt-8 w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90" 
        size="lg"
      >
        Choose {plan.name}
      </Button>
    </motion.div>
  );
};
