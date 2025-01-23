"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Lock } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  feature: "like" | "comment" | "message" | "connect";
}

export function AuthGuard({
  children,
  isAuthenticated,
  feature,
}: AuthGuardProps) {
  const router = useRouter();

  if (isAuthenticated) {
    return <>{children}</>;
  }

  const featureMessages = {
    like: "Like posts and show your appreciation",
    comment: "Join the conversation and share your thoughts",
    message: "Connect with professionals through direct messages",
    connect: "Build your professional network",
  };

  return (
    <Dialog>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto bg-muted w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center">
            Sign in to {featureMessages[feature]}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <p className="text-center text-muted-foreground">
            Join Gulf Return to unlock all features and connect with
            professionals
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/auth")}>
              Sign In
            </Button>
            <Button onClick={() => router.push("/auth?tab=signup")}>
              Join Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
