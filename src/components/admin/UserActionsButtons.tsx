
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
import { Button } from "@/components/ui/button";
import { UserX } from "lucide-react";

interface UserActionsButtonsProps {
  userId: string;
  userRole: 'free' | 'premium' | 'admin';
  onRoleUpdate: (userId: string, newRole: 'free' | 'premium') => Promise<void>;
  onUserRemoval: (userId: string) => Promise<void>;
}

export const UserActionsButtons = ({
  userId,
  userRole,
  onRoleUpdate,
  onUserRemoval,
}: UserActionsButtonsProps) => {
  if (userRole === 'admin') return null;

  return (
    <div className="flex items-center gap-2">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant={userRole === 'premium' ? "outline" : "default"}
            size="sm"
          >
            {userRole === 'premium' ? 'Downgrade to Free' : 'Upgrade to Premium'}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {userRole === 'premium' ? 'Downgrade User?' : 'Upgrade User?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {userRole === 'premium' ? 'downgrade' : 'upgrade'} this user's plan?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onRoleUpdate(userId, userRole === 'premium' ? 'free' : 'premium')}
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
              onClick={() => onUserRemoval(userId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
