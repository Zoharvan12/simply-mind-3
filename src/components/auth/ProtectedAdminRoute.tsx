
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";

interface ProtectedAdminRouteProps {
  children: ReactNode;
}

export const ProtectedAdminRoute = ({ children }: ProtectedAdminRouteProps) => {
  const { role, isLoading } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You do not have admin privileges",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [role, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return role === 'admin' ? <>{children}</> : null;
};
