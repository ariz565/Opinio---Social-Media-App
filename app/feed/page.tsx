"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LeftSidebar } from "@/components/sidebar/left-sidebar.tsx/index";
import { RightSidebar } from "@/components/sidebar/right-sidebar.tsx/index";
import { MainFeed } from "@/components/feed/main-feed";
import { CreatePostModal } from "@/components/posts";
import ChatSidebar from "@/components/messaging/chat-sidebar";
import { Plus } from "lucide-react";
import {
  isCurrentlyRedirecting,
  setRedirectingState,
} from "@/lib/redirect-manager";
import {
  FeedSkeleton,
  SidebarSkeleton,
} from "@/components/ui/loading-skeletons";

export default function FeedPage() {
  const router = useRouter();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (isCurrentlyRedirecting()) return; // Prevent multiple redirects

    // Add a small delay to prevent rapid re-execution
    const checkAuth = () => {
      const token = localStorage.getItem("access_token");
      const userData = localStorage.getItem("user");

      if (!token || !userData) {
        setRedirectingState(true);
        router.replace("/auth");
        return;
      }

      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        setRedirectingState(true);
        router.replace("/auth");
      }
    };

    // Small delay to prevent rapid execution
    const timeoutId = setTimeout(checkAuth, 100);
    return () => clearTimeout(timeoutId);
  }, [router]); // Include router in dependencies

  if (!user) {
    return (
      <div className="min-h-screen">
        {/* Main Layout with proper navbar spacing */}
        <div className="pt-20">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-12 gap-6">
              {/* Left Sidebar Skeleton */}
              <div className="col-span-3 hidden lg:block">
                <div>
                  <SidebarSkeleton />
                </div>
              </div>

              {/* Main Feed Skeleton */}
              <div className="col-span-12 lg:col-span-6">
                <FeedSkeleton />
              </div>

              {/* Right Sidebar Skeleton */}
              <div className="col-span-3 hidden lg:block">
                <div>
                  <SidebarSkeleton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Main Layout with proper navbar spacing */}
      <div className="pt-20">
        {" "}
        {/* Add padding top to account for fixed navbar */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Left Sidebar */}
            <div className="col-span-3 hidden lg:block">
              <div>
                {" "}
                {/* Removed sticky positioning for unified scroll */}
                <LeftSidebar user={user} />
              </div>
            </div>

            {/* Main Feed */}
            <div className="col-span-12 lg:col-span-6">
              <MainFeed user={user} />
            </div>

            {/* Right Sidebar */}
            <div className="col-span-3 hidden lg:block">
              <div>
                {" "}
                {/* Removed sticky positioning for unified scroll */}
                <RightSidebar />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Create Post Button - Mobile */}
      <button
        onClick={() => setIsCreatePostOpen(true)}
        title="Create new post"
        className="lg:hidden fixed bottom-6 right-6 bg-gradient-to-r from-teal-500 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 z-50"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Create Post Modal */}
      {isCreatePostOpen && (
        <CreatePostModal
          isOpen={isCreatePostOpen}
          onClose={() => setIsCreatePostOpen(false)}
          user={user}
        />
      )}

      {/* Professional Chat Sidebar - LinkedIn Style */}
      <ChatSidebar />
    </div>
  );
}
