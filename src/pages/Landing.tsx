
import { useState, useEffect } from "react";
import { useLandingPage } from "@/hooks/useLandingPage";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

export const Landing = () => {
  const [language, setLanguage] = useState<"en" | "he">("en");
  const { content, isLoading, error } = useLandingPage(language);
  const [heroImage, setHeroImage] = useState<string>("");

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Failed to load content</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" dir={language === "he" ? "rtl" : "ltr"}>
      {/* Language Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="outline"
          onClick={() => setLanguage(language === "en" ? "he" : "en")}
        >
          {language === "en" ? "🇮🇱 עברית" : "🇬🇧 English"}
        </Button>
      </div>

      {/* Hero Section */}
      <ScrollReveal>
        <header className="relative text-center py-16 px-4 min-h-[80vh] flex flex-col items-center justify-center">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background/95 -z-10" />
          
          {/* Hero Image */}
          {heroImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-3xl mx-auto mb-12"
            >
              <img
                src={heroImage}
                alt="SimplyMind Hero"
                className="w-full h-auto rounded-2xl shadow-xl"
              />
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-primary"
          >
            {content.hero.headline}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl mt-6 text-muted-foreground max-w-2xl mx-auto"
          >
            {content.hero.subheading}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Button
              size="lg"
              className="mt-8 text-lg"
              asChild
            >
              <a href="/auth">{content.hero.cta_text}</a>
            </Button>
          </motion.div>
        </header>
      </ScrollReveal>

      {/* Features Section */}
      <ScrollReveal>
        <section className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {content.features.list.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card hover:scale-105 transition-transform duration-300"
                >
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Pricing Section */}
      <ScrollReveal>
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {content.pricing.plans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card text-center hover:scale-105 transition-transform duration-300"
                >
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p className="text-3xl font-semibold mt-4">{plan.price}</p>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="text-muted-foreground">
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="mt-8" size="lg">
                    Choose {plan.name}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
};

export default Landing;
