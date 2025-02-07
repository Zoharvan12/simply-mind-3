
import { Cross2Icon } from "@radix-ui/react-icons";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(true);

  return (
    <Dialog open>
      <DialogContent className="sm:max-w-[425px]">
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border"
            aria-hidden="true"
          >
            <svg
              className="stroke-zinc-800 dark:stroke-zinc-100"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <circle cx="16" cy="16" r="12" fill="none" strokeWidth="8" />
            </svg>
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">
              {isSignUp ? "Create an account" : "Welcome back"}
            </DialogTitle>
            <DialogDescription className="sm:text-center">
              {isSignUp ? "Enter your details to get started" : "Sign in to your account"}
            </DialogDescription>
          </DialogHeader>
        </div>

        <AuthForm 
          isSignUp={isSignUp}
          onToggleMode={() => setIsSignUp(!isSignUp)}
        />

        <div className="flex items-center gap-3 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
          <span className="text-xs text-muted-foreground">Or</span>
        </div>

        <GoogleSignInButton />
      </DialogContent>
    </Dialog>
  );
}
