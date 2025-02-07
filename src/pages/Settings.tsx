import { useState, useEffect } from "react";
import { MainLayout } from "@/components/MainLayout";
import { ScrollReveal } from "@/components/ScrollReveal";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { SubscriptionCard } from "@/components/settings/SubscriptionCard";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { DangerZone } from "@/components/settings/DangerZone";

const Settings = () => {
  const [messageCount, setMessageCount] = useState(0);
  const [daysUntilReset, setDaysUntilReset] = useState(0);
  const { role } = useUserRole();
  const [profile, setProfile] = useState<{ first_name: string | null; last_name: string | null } | null>(null);

  useEffect(() => {
    const fetchMessageCount = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact' })
        .eq('role', 'user')
        .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

      setMessageCount(count || 0);

      // Calculate days until next month
      const today = new Date();
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      setDaysUntilReset(lastDay - today.getDate());
    };

    if (role === 'free') {
      fetchMessageCount();
    }
  }, [role]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4">
        <ScrollReveal>
          <div className="flex items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#2A3D66]">Settings</h1>
              <p className="text-neutral-500 mt-1">Manage your account preferences</p>
            </div>
          </div>

          <div className="space-y-6">
            <SubscriptionCard
              role={role}
              messageCount={messageCount}
              daysUntilReset={daysUntilReset}
            />
            <ProfileForm initialData={profile} />
            <DangerZone />
          </div>
        </ScrollReveal>
      </div>
    </MainLayout>
  );
};

export default Settings;