"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainNav } from "@/components/dashboard/main-nav";
// import { AdminHeader } from "@/components/dashboard/header";
import { ThemeProvider } from "@/components/theme-provider";

// Mock authentication - Replace with your actual auth logic
const isAuthenticated = () => {
  // Replace with your actual auth check
  return true;
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
    }
  }, [router]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex min-h-screen">
        <MainNav />
        <div className="flex-1">
          {/* <AdminHeader /> */}
          {children}
        </div>
      </div>
    </ThemeProvider>
  );
}
