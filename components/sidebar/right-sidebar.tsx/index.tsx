"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Hash, TrendingUp, Users, Plus, UserPlus } from "lucide-react";
import Link from "next/link";

export const RightSidebar = () => {
  const [trendingHashtags, setTrendingHashtags] = useState<any[]>([]);
  const [recommendedProfiles, setRecommendedProfiles] = useState<any[]>([]);

  useEffect(() => {
    // Mock data for trending hashtags
    setTrendingHashtags([
      { tag: "GulfReturn", count: "12.5K", trend: "+15%" },
      { tag: "TechNews", count: "8.3K", trend: "+22%" },
      { tag: "Photography", count: "6.7K", trend: "+8%" },
      { tag: "Travel", count: "5.2K", trend: "+12%" },
      { tag: "Business", count: "4.1K", trend: "+5%" },
      { tag: "Design", count: "3.8K", trend: "+18%" },
      { tag: "Food", count: "3.2K", trend: "+7%" },
    ]);

    // Mock data for recommended profiles
    setRecommendedProfiles([
      {
        id: 1,
        username: "sarah_designer",
        full_name: "Sarah Ahmed",
        bio: "UI/UX Designer passionate about creating beautiful experiences",
        followers_count: 1542,
        profile_picture: "",
        is_verified: true,
      },
      {
        id: 2,
        username: "tech_guru",
        full_name: "Mohamed Hassan",
        bio: "Tech enthusiast sharing the latest in AI and blockchain",
        followers_count: 8934,
        profile_picture: "",
        is_verified: false,
      },
      {
        id: 3,
        username: "travel_explorer",
        full_name: "Fatima Al-Zahra",
        bio: "Exploring the world one adventure at a time ✈️",
        followers_count: 2341,
        profile_picture: "",
        is_verified: true,
      },
      {
        id: 4,
        username: "chef_khalid",
        full_name: "Khalid Al-Mansoori",
        bio: "Traditional Gulf cuisine meets modern gastronomy",
        followers_count: 756,
        profile_picture: "",
        is_verified: false,
      },
    ]);
  }, []);

  return (
    <div className="space-y-6 sticky top-6">
      {/* Trending Hashtags */}
      <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 ring-1 ring-gray-100 dark:ring-gray-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-gray-100">
            <TrendingUp className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            Trending Hashtags
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {trendingHashtags.slice(0, 6).map((hashtag, index) => (
            <Link
              key={index}
              href={`/hashtag/${hashtag.tag}`}
              className="block hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg p-2 -mx-2 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      #{hashtag.tag}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {hashtag.count} posts
                    </p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs"
                >
                  {hashtag.trend}
                </Badge>
              </div>
            </Link>
          ))}

          <Link href="/hashtag/explore">
            <Button
              variant="outline"
              className="w-full mt-3 border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/30 bg-white/50 dark:bg-gray-800/50"
            >
              View All Trending
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recommended Profiles */}
      <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 ring-1 ring-gray-100 dark:ring-gray-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-gray-100">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Who to Follow
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendedProfiles.slice(0, 4).map((profile) => (
            <div
              key={profile.id}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <Link href={`/profile/${profile.username}`}>
                <Avatar className="w-10 h-10 border-2 border-white dark:border-gray-700 shadow-md">
                  <AvatarImage src={profile.profile_picture} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-600 text-white font-semibold">
                    {profile.full_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>

              <div className="flex-1 min-w-0">
                <Link href={`/profile/${profile.username}`}>
                  <div className="flex items-center gap-1">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
                      {profile.full_name}
                    </h4>
                    {profile.is_verified && (
                      <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    @{profile.username}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-xs mt-1 line-clamp-2">
                    {profile.bio}
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                    {profile.followers_count.toLocaleString()} followers
                  </p>
                </Link>

                <Button
                  size="sm"
                  className="mt-2 h-6 px-3 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white text-xs"
                >
                  <UserPlus className="w-3 h-3 mr-1" />
                  Follow
                </Button>
              </div>
            </div>
          ))}

          <Link href="/people/discover">
            <Button
              variant="outline"
              className="w-full mt-3 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 bg-white/50 dark:bg-gray-800/50"
            >
              Discover More People
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Suggested Groups */}
      <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 ring-1 ring-gray-100 dark:ring-gray-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-gray-100">
            <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Suggested Groups
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PH</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                  Photography Club
                </h4>
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  2.3K members
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="h-6 px-2 text-xs border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/30"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TC</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                  Tech Community
                </h4>
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  4.7K members
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="h-6 px-2 text-xs border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/30"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FD</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                  Food & Culture
                </h4>
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  1.8K members
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="h-6 px-2 text-xs border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-900/30"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <Link href="/groups/discover">
            <Button
              variant="outline"
              className="w-full mt-3 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 bg-white/50 dark:bg-gray-800/50"
            >
              Explore Groups
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};
