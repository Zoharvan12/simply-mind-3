
import { Home, MessageSquare, BarChart2, Settings } from "lucide-react";
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
  const { role } = useUserRole();
  
  return (
    <Sidebar>
      <SidebarContent>
        {/* Logo */}
        <div className="p-6">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#7098DA] to-[#88C0A3] flex items-center justify-center">
            <span className="text-white font-semibold text-xl">SM</span>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="px-6 py-4">
          <h2 className="text-lg font-medium text-[#2A3D66]">
            Hello, {role === "free" ? "Friend" : "Premium User"}
          </h2>
          <p className="text-sm text-neutral-500">Welcome back</p>
        </div>

        {/* Navigation Menu */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.href}
                      className="flex items-center gap-3 text-neutral-600 hover:text-neutral-900"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a
                href="/settings"
                className="flex items-center gap-3 text-neutral-600 hover:text-neutral-900"
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
