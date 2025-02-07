
import { Home, MessageSquare, BarChart2, Settings, Shield, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

const menuItems = [
  {
    title: "Personal Inputs",
    icon: Home,
    href: "/",
  },
  {
    title: "Chats",
    icon: MessageSquare,
    href: "/chats",
  },
  {
    title: "Graph",
    icon: BarChart2,
    href: "/graph",
  },
];

export function AppSidebar() {
  const { role, isLoading, isAdmin } = useUserRole();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setFirstName(profile.first_name);
        }
      }
    };
    
    fetchUserProfile();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  const renderWelcomeMessage = () => {
    if (isLoading || firstName === null) {
      return (
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      );
    }

    return (
      <>
        <h2 className="text-lg font-medium text-[#2A3D66]">
          Hello, {firstName || "Friend"}
        </h2>
        <p className="text-sm text-neutral-500">Welcome back</p>
      </>
    );
  };
  
  return (
    <Sidebar>
      <SidebarContent>
        {/* Logo */}
        <div className="p-6">
          <img 
            src="/lovable-uploads/e81ffaa3-2e41-4a38-9936-858ebf3a709a.png" 
            alt="SimplyMind Logo" 
            className="h-16 w-auto"
          />
        </div>

        {/* Welcome Message */}
        <div className="px-6 py-4">
          {renderWelcomeMessage()}
        </div>

        {/* Navigation Menu */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.href}
                      className="flex items-center gap-3 text-neutral-600 hover:text-neutral-900"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {isAdmin && !isLoading && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  to="/admin"
                  className="flex items-center gap-3 text-neutral-600 hover:text-neutral-900"
                >
                  <Shield className="h-5 w-5" />
                  <span>Admin Panel</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                to="/settings"
                className="flex items-center gap-3 text-neutral-600 hover:text-neutral-900"
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
              </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut}>
              <div className="flex items-center gap-3 text-neutral-600 hover:text-neutral-900">
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
