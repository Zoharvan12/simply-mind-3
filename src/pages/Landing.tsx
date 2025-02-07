
import { useState } from "react";
import { useLandingPage } from "@/hooks/useLandingPage";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Loader2 } from "lucide-react";

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
    <div className="min-h-screen" dir={language === "he" ? "rtl" : "ltr"}>
      {/* Language Toggle */}
      <div className="absolute top-4 right-4">
        <Button
          variant="outline"
          onClick={() => setLanguage(language === "en" ? "he" : "en")}
        >
          {language === "en" ? "🇮🇱 עברית" : "🇬🇧 English"}
        </Button>
      </div>

      {/* Hero Section */}
      <ScrollReveal>
        <header className="text-center py-16 px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            {content.hero.headline}
          </h1>
          <p className="text-lg mt-4 text-muted-foreground max-w-2xl mx-auto">
            {content.hero.subheading}
          </p>
          <Button
            size="lg"
            className="mt-8"
            asChild
          >
            <a href={content.hero.cta_link}>{content.hero.cta_text}</a>
          </Button>
        </header>
      </ScrollReveal>

      {/* Features Section */}
      <ScrollReveal>
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {content.features.list.map((feature, index) => (
                <div
                  key={index}
                  className="glass-card hover:scale-105 transition-transform duration-300"
                >
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Pricing Section */}
      <ScrollReveal>
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {content.pricing.plans.map((plan, index) => (
                <div
                  key={index}
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
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
};

export default Landing;
