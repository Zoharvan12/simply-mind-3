
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export const GoogleSignInButton = () => {
  const { toast } = useToast();

  const handleGoogleSignIn = () => {
    toast({
      title: "Coming Soon",
      description: "Google sign-in will be available soon!",
    });
  };

  return (
    <Button 
      type="button" 
      variant="outline" 
      onClick={handleGoogleSignIn}
    >
      Continue with Google
    </Button>
  );
};
