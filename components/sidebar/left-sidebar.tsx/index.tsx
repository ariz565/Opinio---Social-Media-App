"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bookmark,
  Users,
  Plus,
  MapPin,
  Calendar,
  Link2,
  User,
  Camera,
} from "lucide-react";
import Link from "next/link";

interface LeftSidebarProps {
  user: any;
}

export const LeftSidebar = ({ user }: LeftSidebarProps) => {
  const router = useRouter();

  const handleViewProfile = () => {
    router.push(`/profile/${user?.username || 'user'}`);
  };

  return (
    <div className="space-y-6 sticky top-6">
      {/* Profile Card */}
      <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 ring-1 ring-gray-100 dark:ring-gray-800">
        <CardContent className="p-6">
          {/* Cover Photo */}
          <div className="relative h-24 bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 rounded-lg mb-4 overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <button 
              className="absolute top-2 right-2 p-1.5 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              title="Edit cover photo"
              aria-label="Edit cover photo"
            >
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="relative -mt-8 mb-4">
            <div className="flex items-end justify-between">
              <div className="relative">
                <Avatar className="w-16 h-16 border-4 border-white dark:border-gray-800 shadow-lg">
                  <AvatarImage src={user?.profile_picture || ""} />
                  <AvatarFallback className="bg-gradient-to-br from-teal-400 to-blue-600 text-white font-semibold">
                    {user?.full_name?.charAt(0)?.toUpperCase() ||
                      user?.username?.charAt(0)?.toUpperCase() ||
                      "U"}
                  </AvatarFallback>
                </Avatar>
                <button 
                  className="absolute -bottom-1 -right-1 p-1 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors shadow-md"
                  title="Edit profile picture"
                  aria-label="Edit profile picture"
                >
                  <Camera className="w-3 h-3" />
                </button>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/30 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                onClick={handleViewProfile}
              >
                <User className="w-3 h-3 mr-1" />
                View Profile
              </Button>
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-3">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                {user?.full_name || user?.username || "User"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                @{user?.username || "username"}
              </p>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {user?.bio ||
                  "Welcome to Gulf Return! Share your thoughts and connect with others."}
              </p>
            </div>

            {/* Location & Join Date */}
            <div className="space-y-1">
              {user?.location && (
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span>{user.location}</span>
                </div>
              )}
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
                <Calendar className="w-3 h-3 mr-1" />
                <span>
                  Joined{" "}
                  {new Date(user?.created_at || Date.now()).toLocaleDateString(
                    "en-US",
                    { month: "long", year: "numeric" }
                  )}
                </span>
              </div>
              {user?.website && (
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
                  <Link2 className="w-3 h-3 mr-1" />
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    {user.website.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 pt-2">
              <div className="text-center">
                <div className="font-bold text-gray-900 dark:text-gray-100">
                  {user?.followers_count || 0}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Followers
                </div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900 dark:text-gray-100">
                  {user?.following_count || 0}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Following
                </div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900 dark:text-gray-100">
                  {user?.posts_count || 0}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Posts
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 ring-1 ring-gray-100 dark:ring-gray-800">
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Quick Actions
          </h4>
          <div className="space-y-2">
            <Link href="/bookmarks">
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-700 dark:hover:text-teal-300 text-gray-700 dark:text-gray-300"
              >
                <Bookmark className="w-4 h-4 mr-3" />
                Bookmarks
                <Badge
                  variant="secondary"
                  className="ml-auto bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300"
                >
                  {user?.bookmarks_count || 0}
                </Badge>
              </Button>
            </Link>

            <Link href="/groups">
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300 text-gray-700 dark:text-gray-300"
              >
                <Users className="w-4 h-4 mr-3" />
                My Groups
                <Badge
                  variant="secondary"
                  className="ml-auto bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                >
                  {user?.groups_count || 0}
                </Badge>
              </Button>
            </Link>

            <Link href="/groups/create">
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-300 text-gray-700 dark:text-gray-300"
              >
                <Plus className="w-4 h-4 mr-3" />
                Create Group
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 ring-1 ring-gray-100 dark:ring-gray-800">
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Recent Activity
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You liked a post by{" "}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  @sarah_k
                </span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You followed{" "}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  @tech_updates
                </span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You joined{" "}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  Photography Club
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
