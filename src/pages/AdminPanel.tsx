
import { MainLayout } from "@/components/MainLayout";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Shield, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { StatsCards } from "@/components/admin/StatsCards";
import { UserManagementTable } from "@/components/admin/UserManagementTable";

interface UserStats {
  total_users: number;
  free_users: number;
  premium_users: number;
}

interface UserData {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: 'free' | 'premium' | 'admin';
  created_at: string;
}

const AdminPanel = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAccess = async () => {
      const { data: isAdmin, error } = await supabase.rpc('is_admin');
      
      if (error || !isAdmin) {
        navigate('/');
        return;
      }
      
      fetchData();
    };

    checkAdminAccess();
  }, [navigate]);

  const fetchData = async () => {
    try {
      // Fetch statistics using the updated RPC function
      const { data: statsData, error: statsError } = await supabase.rpc('get_user_statistics');
      if (statsError) throw statsError;
      setStats(statsData as UserStats);

      // Fetch users using the new admin_user_list function
      const { data: userData, error: userError } = await supabase.rpc('get_admin_user_list');
      if (userError) throw userError;

      // Transform the data to match our UserData interface
      const formattedUsers: UserData[] = userData.map((user) => ({
        id: user.id,
        email: user.email || '',
        first_name: user.first_name,
        last_name: user.last_name,
        role: (user.role || 'free') as 'free' | 'premium' | 'admin',
        created_at: user.created_at,
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: 'free' | 'premium') => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `User role updated to ${newRole}`,
      });

      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const handleUserRemoval = async (userId: string) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;

      toast({
        title: "Success",
        description: "User has been removed",
      });

      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error removing user:', error);
      toast({
        title: "Error",
        description: "Failed to remove user",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      user.email.toLowerCase().includes(searchTerm) ||
      (user.first_name?.toLowerCase() || '').includes(searchTerm) ||
      (user.last_name?.toLowerCase() || '').includes(searchTerm)
    );
  });

  if (isLoading) {
    return <MainLayout>Loading...</MainLayout>;
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4">
        <ScrollReveal>
          <div className="flex items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#2A3D66] flex items-center gap-2">
                <Shield className="h-8 w-8" />
                Admin Panel
              </h1>
              <p className="text-neutral-500 mt-1">Manage users and subscriptions</p>
            </div>
          </div>

          <StatsCards stats={stats} />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage user subscriptions and accounts
              </CardDescription>
              <div className="mt-4">
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              <UserManagementTable
                users={filteredUsers}
                onRoleUpdate={handleRoleUpdate}
                onUserRemoval={handleUserRemoval}
              />
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </MainLayout>
  );
};

export default AdminPanel;
