"use client";

import { useState, useEffect } from "react";
import { isAuthenticated } from "@/lib/api";
import { redirect } from "next/navigation";
import ProfessionalMessagingSystem from "@/components/messaging/professional-messaging-system";

export default function MessagesPage() {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const authenticated = isAuthenticated();
    setIsAuth(authenticated);

    if (!authenticated) {
      redirect("/auth");
    }
  }, []);

  if (isAuth === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuth) {
    return null;
  }

  return <ProfessionalMessagingSystem />;
}
