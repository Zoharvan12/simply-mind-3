
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserActionsButtons } from "./UserActionsButtons";

interface UserData {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: 'free' | 'premium' | 'admin';
  created_at: string;
}

interface UserManagementTableProps {
  users: UserData[];
  onRoleUpdate: (userId: string, newRole: 'free' | 'premium') => Promise<void>;
  onUserRemoval: (userId: string) => Promise<void>;
}

export const UserManagementTable = ({
  users,
  onRoleUpdate,
  onUserRemoval,
}: UserManagementTableProps) => {
  return (
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
          {users.map((user) => (
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
                <UserActionsButtons
                  userId={user.id}
                  userRole={user.role}
                  onRoleUpdate={onRoleUpdate}
                  onUserRemoval={onUserRemoval}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
