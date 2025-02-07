
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LandingPageContent, LandingPageData } from "@/types/landing-page";

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
          const formattedData = data.reduce((acc, item: LandingPageData) => {
            const contentData = language === "en" ? item.content : item.content_he || item.content;
            acc[item.section] = contentData as Record<string, any>;
            return acc;
          }, {} as Record<string, any>) as LandingPageContent;

          setContent(formattedData);
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
