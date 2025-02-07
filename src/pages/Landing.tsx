
import { useState, useEffect } from "react";
import { useLandingPage } from "@/hooks/useLandingPage";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Loader2, Brain, BarChart3, BookText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion, useScroll, useTransform } from "framer-motion";
import { Background3D } from "@/components/Background3D";
import VanillaTilt from 'vanilla-tilt';

const iconMap = {
  'brain': Brain,
  'chart': BarChart3,
  'book': BookText,
};

export const Landing = () => {
  const [language, setLanguage] = useState<"en" | "he">("en");
  const { content, isLoading, error } = useLandingPage(language);
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

  useEffect(() => {
    const elements = document.querySelectorAll('.feature-card');
    elements.forEach(element => {
      VanillaTilt.init(element as HTMLElement, {
        max: 25,
        speed: 400,
        glare: true,
        "max-glare": 0.5,
      });
    });
  }, [content]);

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
    <div className="min-h-screen relative overflow-hidden" dir={language === "he" ? "rtl" : "ltr"}>
      <Background3D />
      
      {/* Language Toggle */}
      <motion.div 
        className="fixed top-4 right-4 z-10"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="outline"
          onClick={() => setLanguage(language === "en" ? "he" : "en")}
          className="backdrop-blur-sm bg-white/20 border-white/30 hover:bg-white/30"
        >
          {language === "en" ? "🇮🇱 עברית" : "🇬🇧 English"}
        </Button>
      </motion.div>

      {/* Hero Section */}
      <ScrollReveal>
        <header className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background/95 -z-10" />
          
          {/* Hero Image */}
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8"
          >
            <Button
              size="lg"
              className="text-lg bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300"
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
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {content.features.list.map((feature, index) => {
                const Icon = iconMap[feature.icon as keyof typeof iconMap] || Brain;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="feature-card glass-card hover:scale-105 transition-transform duration-300 flex flex-col items-center text-center p-6"
                  >
                    <Icon className="w-12 h-12 mb-4 text-primary" />
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Pricing Section */}
      <ScrollReveal>
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {content.pricing.plans.map((plan, index) => (
                <motion.div
                  key={index}
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
                    {plan.features.map((feature, idx) => (
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
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
};

export default Landing;
