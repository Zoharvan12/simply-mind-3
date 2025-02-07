
import { Database } from "@/integrations/supabase/types";

export type LandingPageSection = {
  id: string;
  section: string;
  content: Record<string, any>;
  content_he?: Record<string, any>;
  created_at: string;
};

export type LandingPageContent = {
  hero: {
    headline: string;
    subheading: string;
    cta_text: string;
    cta_link: string;
  };
  features: {
    list: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  pricing: {
    plans: Array<{
      name: string;
      price: string;
      features: string[];
    }>;
  };
};
