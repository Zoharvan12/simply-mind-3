
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LandingPageSection, LandingPageContent } from "@/types/landing-page";

export const useLandingPage = (language: "en" | "he" = "en") => {
  const [content, setContent] = useState<LandingPageContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from("landing_page")
          .select("*");

        if (error) throw error;

        if (data) {
          const formattedData = data.reduce((acc, item: LandingPageSection) => {
            acc[item.section] = language === "en" ? item.content : item.content_he || item.content;
            return acc;
          }, {} as Record<string, any>);

          setContent(formattedData as LandingPageContent);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [language]);

  return { content, isLoading, error };
};
