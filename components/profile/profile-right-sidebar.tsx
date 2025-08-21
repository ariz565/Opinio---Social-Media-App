"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUpIcon,
  UsersIcon,
  HashIcon,
  StarIcon,
  ExternalLinkIcon,
  ChevronRightIcon,
  MapPinIcon,
  BriefcaseIcon,
  GlobeIcon,
  CalendarIcon,
  UserPlusIcon,
  MessageSquareIcon,
  BookmarkIcon,
  ShareIcon,
  BellIcon,
  SettingsIcon,
  User2,
  TrophyIcon,
  ZapIcon,
  HeartIcon,
  EyeIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

interface ProfileRightSidebarProps {
  isOwnProfile?: boolean;
  username: string;
}

export default function ProfileRightSidebar({
  isOwnProfile = false,
  username,
}: ProfileRightSidebarProps) {
  const [isFollowing, setIsFollowing] = useState(false);

  const suggestedConnections = [
    {
      id: 1,
      name: "Sarah Johnson",
      username: "sarahj",
      title: "Senior Product Designer",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      mutualConnections: 12,
      isFollowing: false,
    },
    {
      id: 2,
      name: "Michael Chen",
      username: "mchen",
      title: "Full Stack Developer",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      mutualConnections: 8,
      isFollowing: false,
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      username: "emilyrod",
      title: "UX Research Lead",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      mutualConnections: 15,
      isFollowing: true,
    },
  ];

  const trendingTopics = [
    { tag: "WebDevelopment", posts: "2.4K posts" },
    { tag: "React", posts: "1.8K posts" },
    { tag: "TypeScript", posts: "1.2K posts" },
    { tag: "NextJS", posts: "890 posts" },
    { tag: "TailwindCSS", posts: "670 posts" },
  ];

  const profileInsights = {
    profileViews: 1247,
    searchAppearances: 89,
    impressions: 3420,
    engagementRate: 8.7,
  };

  const recentActivity = [
    {
      id: 1,
      type: "like",
      user: "Alex Thompson",
      action: "liked your post",
      time: "2h ago",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    },
    {
      id: 2,
      type: "comment",
      user: "Jessica Park",
      action: "commented on your post",
      time: "4h ago",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face",
    },
    {
      id: 3,
      type: "follow",
      user: "David Wilson",
      action: "started following you",
      time: "1d ago",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
    },
  ];

  return (
    <div className="w-80 space-y-6">
      {/* Profile Actions - Only for own profile */}
      {isOwnProfile && (
        <Card className="border-0 shadow-sm bg-gradient-to-br from-background to-muted/30">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 hover:bg-primary/5"
            >
              <User2 className="w-4 h-4" />
              Edit Profile
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 hover:bg-primary/5"
            >
              <BellIcon className="w-4 h-4" />
              Notification Settings
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 hover:bg-primary/5"
            >
              <EyeIcon className="w-4 h-4" />
              Privacy Settings
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Profile Insights - Only for own profile */}
      {isOwnProfile && (
        <Card className="border-0 shadow-sm bg-gradient-to-br from-background to-muted/30">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUpIcon className="w-5 h-5 text-primary" />
              Profile Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {profileInsights.profileViews.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  Profile Views
                </div>
              </div>
              <div className="text-center p-3 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {profileInsights.searchAppearances}
                </div>
                <div className="text-xs text-muted-foreground">
                  Search Results
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Engagement Rate</span>
                <span className="font-semibold">
                  {profileInsights.engagementRate}%
                </span>
              </div>
              <Progress
                value={profileInsights.engagementRate * 10}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-background to-muted/30">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <ZapIcon className="w-5 h-5 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentActivity.map((activity) => (
            <motion.div
              key={activity.id}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src={activity.avatar} alt={activity.user} />
                <AvatarFallback>{activity.user.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">{activity.user}</span>{" "}
                  <span className="text-muted-foreground">
                    {activity.action}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
              {activity.type === "like" && (
                <HeartIcon className="w-4 h-4 text-red-500" />
              )}
              {activity.type === "comment" && (
                <MessageSquareIcon className="w-4 h-4 text-blue-500" />
              )}
              {activity.type === "follow" && (
                <UserPlusIcon className="w-4 h-4 text-green-500" />
              )}
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Suggested Connections */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-background to-muted/30">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-primary" />
            People You May Know
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {suggestedConnections.map((connection) => (
            <motion.div
              key={connection.id}
              whileHover={{ scale: 1.02 }}
              className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:border-primary/20 hover:bg-muted/30 transition-all"
            >
              <Avatar className="w-10 h-10">
                <AvatarImage src={connection.avatar} alt={connection.name} />
                <AvatarFallback>{connection.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">
                  {connection.name}
                </h4>
                <p className="text-xs text-muted-foreground truncate">
                  {connection.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {connection.mutualConnections} mutual connections
                </p>
                <Button
                  size="sm"
                  variant={connection.isFollowing ? "outline" : "default"}
                  className="mt-2 h-7 text-xs px-3"
                  onClick={() => setIsFollowing(!isFollowing)}
                >
                  {connection.isFollowing ? "Following" : "Follow"}
                </Button>
              </div>
            </motion.div>
          ))}
          <Button
            variant="ghost"
            className="w-full text-sm text-primary hover:bg-primary/5"
          >
            View All Suggestions
            <ChevronRightIcon className="w-4 h-4 ml-1" />
          </Button>
        </CardContent>
      </Card>

      {/* Trending Topics */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-background to-muted/30">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <TrophyIcon className="w-5 h-5 text-primary" />
            Trending Topics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {trendingTopics.map((topic, index) => (
            <motion.div
              key={topic.tag}
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-xs font-bold text-white">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-sm">#{topic.tag}</div>
                  <div className="text-xs text-muted-foreground">
                    {topic.posts}
                  </div>
                </div>
              </div>
              <ChevronRightIcon className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Footer Links */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-background to-muted/30">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">
              About
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Help
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Careers
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Developers
            </a>
          </div>
          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground text-center">
              © 2024 Gulf Return Social Media. All rights reserved.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
