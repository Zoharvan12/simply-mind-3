import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";

interface ProtectedPremiumRouteProps {
  children: ReactNode;
}

export const ProtectedPremiumRoute = ({ children }: ProtectedPremiumRouteProps) => {
  const { role, isLoading } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && role !== 'premium' && role !== 'admin') {
      toast({
        title: "Premium Feature",
        description: "This feature requires a premium subscription",
        variant: "destructive",
      });
      navigate('/settings');
    }
  }, [role, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (role === 'premium' || role === 'admin') ? <>{children}</> : null;
};