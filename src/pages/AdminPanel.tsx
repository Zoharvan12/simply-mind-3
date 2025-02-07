
import { MainLayout } from "@/components/MainLayout";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Shield, UserX, Users } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

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
      // Fetch statistics
      const { data: statsData, error: statsError } = await supabase.rpc('get_user_statistics');
      if (statsError) throw statsError;
      setStats(statsData);

      // Fetch users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          auth.users!inner(email, created_at),
          user_roles!inner(role)
        `);

      if (profilesError) throw profilesError;

      const formattedUsers = profiles.map((profile: any) => ({
        id: profile.id,
        email: profile.auth_users.email,
        first_name: profile.first_name,
        last_name: profile.last_name,
        role: profile.user_roles.role,
        created_at: profile.auth_users.created_at,
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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{stats?.total_users || 0}</CardTitle>
                <CardDescription>Total Users</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{stats?.free_users || 0}</CardTitle>
                <CardDescription>Free Users</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{stats?.premium_users || 0}</CardTitle>
                <CardDescription>Premium Users</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* User Management */}
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
              <div className="relative overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Current Plan</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          {user.first_name || user.last_name ? 
                            `${user.first_name || ''} ${user.last_name || ''}`.trim() : 
                            'No name'
                          }
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="capitalize">{user.role}</TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {user.role !== 'admin' && (
                              <>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button 
                                      variant={user.role === 'premium' ? "outline" : "default"}
                                      size="sm"
                                    >
                                      {user.role === 'premium' ? 'Downgrade to Free' : 'Upgrade to Premium'}
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        {user.role === 'premium' ? 'Downgrade User?' : 'Upgrade User?'}
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to {user.role === 'premium' ? 'downgrade' : 'upgrade'} this user's plan?
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleRoleUpdate(user.id, user.role === 'premium' ? 'free' : 'premium')}
                                      >
                                        Confirm
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>

                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button 
                                      variant="destructive"
                                      size="sm"
                                    >
                                      <UserX className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Remove User?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to remove this user? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleUserRemoval(user.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Remove User
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </MainLayout>
  );
};

export default AdminPanel;
