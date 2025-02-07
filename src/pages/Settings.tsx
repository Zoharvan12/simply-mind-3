
import { MainLayout } from "@/components/MainLayout";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="flex items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#2A3D66]">Settings</h1>
              <p className="text-neutral-500 mt-1">Manage your account preferences</p>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid place-items-center h-[60vh]">
          <div className="text-center">
            <SettingsIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-neutral-600 mb-2">Account Settings</h2>
            <p className="text-neutral-500 max-w-md">
              Customize your experience and manage your account preferences
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
