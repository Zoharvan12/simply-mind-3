
import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <SidebarProvider defaultPath="/dashboard">
      <div className="h-screen overflow-hidden flex w-full bg-gradient-to-br from-background to-white/50">
        <AppSidebar />
        <main className="flex-1 transition-all duration-300 ease-in-out">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};
