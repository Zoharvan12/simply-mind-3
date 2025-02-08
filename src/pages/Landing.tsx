
import { useState } from "react";
import { useLandingPage } from "@/hooks/useLandingPage";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Background3D } from "@/components/Background3D";
import { LandingHero } from "@/components/landing/LandingHero";
import { Pricing } from "@/components/landing/Pricing";

export const Landing = () => {
  const [language, setLanguage] = useState<"en" | "he">("en");
  const { content, isLoading, error } = useLandingPage(language);

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

      <LandingHero content={content.hero} />
      <Pricing content={content.pricing} />
    </div>
  );
};

export default Landing;
