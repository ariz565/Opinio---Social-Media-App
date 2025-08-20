"use client";

import { useState, useEffect, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Home, Compass, Sparkles, TrendingUp, RefreshCw } from "lucide-react";
import { InfiniteFeed } from "@/components/infinite-feed";
import { CreatePost } from "@/components/create-post";
import { CreatePostSkeleton } from "@/components/ui/loading-skeletons";

interface MainFeedProps {
  user: any;
}

export const MainFeed = ({ user }: MainFeedProps) => {
  const [activeTab, setActiveTab] = useState("following");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  // Ensure user is loaded from localStorage if not passed
  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setIsUserLoaded(true);
      }
    } else {
      setIsUserLoaded(true);
    }
  }, [user]);

  const currentUser = useMemo(() => {
    return (
      user ||
      (typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("user") || "{}")
        : {})
    );
  }, [user]);

  const handlePostCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const tabConfig = [
    {
      value: "following",
      label: "Following",
      icon: Home,
      feedType: "following" as const,
      description: "Posts from people you follow",
    },
    {
      value: "explore",
      label: "Explore",
      icon: Compass,
      feedType: "explore" as const,
      description: "Discover trending posts",
    },
    {
      value: "trending",
      label: "Trending",
      icon: TrendingUp,
      feedType: "trending" as const,
      description: "What's popular right now",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Create Post Section */}
      <div className="z-30 mb-6">
        {/* Better spacing calculation */}
        {isUserLoaded ? (
          <CreatePost
            user={currentUser}
            onPostCreated={handlePostCreated}
            className="shadow-2xl"
          />
        ) : (
          <CreatePostSkeleton />
        )}
      </div>

      {/* Feed Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="z-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-xl border-0 shadow-xl p-3 mb-6">
          {/* Better spacing and styling */}
          <div className="flex items-center justify-between">
            <TabsList className="grid w-auto grid-cols-3 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              {tabConfig.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700"
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <Button
              onClick={handleRefresh}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
          {/* Tab Description */}
          <div className="mt-2 px-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {tabConfig.find((tab) => tab.value === activeTab)?.description}
            </p>
          </div>
        </div>

        {/* Tab Contents */}
        {tabConfig.map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className="mt-0 focus-visible:outline-none"
          >
            <InfiniteFeed
              feedType={tab.feedType}
              refreshTrigger={refreshTrigger}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
