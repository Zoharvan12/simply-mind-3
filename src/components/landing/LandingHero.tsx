
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { motion, useScroll, useTransform } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface HeroProps {
  content: {
    headline: string;
    subheading: string;
    cta_text: string;
  };
}

export const LandingHero = ({ content }: HeroProps) => {
  const [heroImage, setHeroImage] = useState<string>("");
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const fetchHeroImage = async () => {
      const { data, error } = await supabase
        .from('landing_page_images')
        .select('image_url')
        .eq('section', 'hero')
        .single();
      
      if (data && !error) {
        setHeroImage(data.image_url);
      }
    };

    fetchHeroImage();
  }, []);

  return (
    <ScrollReveal>
      <header className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background/95 -z-10" />
        
        {heroImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ opacity }}
            className="w-full max-w-2xl mx-auto mb-12 relative group"
          >
            <motion.img
              src={heroImage}
              alt="SimplyMind Hero"
              className="w-full h-auto rounded-2xl shadow-xl mx-auto"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary max-w-4xl mx-auto"
        >
          {content.headline}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl mt-6 text-muted-foreground max-w-2xl mx-auto"
        >
          {content.subheading}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8"
        >
          <Button
            size="lg"
            className="text-lg bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300"
            asChild
          >
            <a href="/auth">{content.cta_text}</a>
          </Button>
        </motion.div>
      </header>
    </ScrollReveal>
  );
};
