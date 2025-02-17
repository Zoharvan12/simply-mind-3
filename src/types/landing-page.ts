
import { Database } from "@/integrations/supabase/types";

export type LandingPageSection = {
  id: string;
  section: string;
  content: Record<string, any>;
  content_he?: Record<string, any>;
  created_at: string;
};

export type LandingPageData = Database['public']['Tables']['landing_page']['Row'];

export type LandingPageContent = {
  hero: {
    headline: string;
    subheading: string;
    cta_text: string;
    cta_link: string;
  };
};
