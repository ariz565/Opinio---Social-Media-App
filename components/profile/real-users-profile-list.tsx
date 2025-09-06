"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProfileConnectionButton } from "@/components/profile/profile-connection-button";
import { usersAPI, User as ApiUser } from "@/lib/api";
import { Users, Search, Loader2, UserPlus, RefreshCw } from "lucide-react";

// Use API User type directly
type User = ApiUser & {
  is_online?: boolean;
  created_at?: string;
};

export function RealUsersProfileList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  // Get current user ID from token or storage
  useEffect(() => {
    try {
      // Get user data from localStorage
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setCurrentUserId(user.id || user._id || "current-user-id");
        console.log("👤 Current user ID:", user.id || user._id);
      } else {
        console.warn("⚠️ No user data found in localStorage");
        setCurrentUserId("current-user-id");
      }
    } catch (error) {
      console.error("❌ Failed to get current user ID:", error);
      setCurrentUserId("current-user-id");
    }
  }, []);

  // Load users from multiple sources with improved fallback
  const loadUsersFromMultipleSources = async () => {
    setLoading(true);
    setError(null);

    const sources = [
      {
        name: "Friend Suggestions",
        fn: () => usersAPI.getFriendSuggestions(20),
      },
      {
        name: "Connection Suggestions",
        fn: () => usersAPI.getConnectionSuggestions(15),
      },
      {
        name: "Trending Users",
        fn: () => usersAPI.getTrendingUsers(15),
      },
      {
        name: "My Followers",
        fn: () => usersAPI.getMyFollowers(10),
      },
      {
        name: "Search Users (Empty Query)",
        fn: () =>
          usersAPI.searchUsers("", 1, 20).then((result) => result.items || []),
      },
    ];

    for (const source of sources) {
      try {
        console.log(`🔄 Trying to load users from: ${source.name}`);
        const userData = await source.fn();

        if (userData && userData.length > 0) {
          console.log(
            `✅ Successfully loaded ${userData.length} users from: ${source.name}`
          );
          setUsers(userData);
          setLoading(false);
          return; // Success, exit loop
        } else {
          console.log(`⚠️ No users found from: ${source.name}`);
        }
      } catch (err) {
        console.error(`❌ Failed to load users from ${source.name}:`, err);
      }
    }

    // If all sources failed
    setError(
      "Unable to load users from any source. Please check your connection and try again."
    );
    setLoading(false);
  }; // Search users
  const searchUsers = async () => {
    if (!searchQuery.trim()) {
      loadUsersFromMultipleSources();
      return;
    }

    try {
      setSearching(true);
      setError(null);
      console.log("🔍 Searching users:", searchQuery);

      const result = await usersAPI.searchUsers(searchQuery, 1, 20);
      console.log("✅ Search results:", result);

      setUsers(result.items || []);
    } catch (error) {
      console.error("❌ Search failed:", error);
      setError("Search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    loadUsersFromMultipleSources();
  }, []);

  // Handle search input
  const handleSearch = () => {
    searchUsers();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Loading Users...
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Real Users from Database
          <Badge variant="outline">{users.length} users</Badge>
        </CardTitle>

        {/* Search Bar */}
        <div className="flex gap-2">
          <Input
            placeholder="Search users by name or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button
            onClick={handleSearch}
            disabled={searching}
            variant="outline"
            size="sm"
          >
            {searching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
          <Button
            onClick={loadUsersFromMultipleSources}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
            {error}
          </div>
        )}

        {users.length === 0 ? (
          <div className="text-center py-8">
            <UserPlus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Users Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? "No users match your search."
                : "No friend suggestions available."}
            </p>
            <Button onClick={loadUsersFromMultipleSources} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
              <Card
                key={user.id || user._id || user.username}
                className="overflow-hidden"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={user.avatar_url || user.avatar}
                        alt={user.full_name || user.username}
                      />
                      <AvatarFallback>
                        {(user.full_name || user.username || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">
                        {user.full_name || user.username}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        @{user.username}
                      </p>
                      {user.is_online !== undefined && (
                        <Badge
                          variant={user.is_online ? "default" : "secondary"}
                          className="text-xs mt-1"
                        >
                          <div
                            className={`w-2 h-2 rounded-full mr-1 ${
                              user.is_online ? "bg-green-500" : "bg-gray-400"
                            }`}
                          />
                          {user.is_online ? "Online" : "Offline"}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {user.bio && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {user.bio}
                    </p>
                  )}

                  <div className="flex flex-col gap-2">
                    <ProfileConnectionButton
                      userId={user.id || user._id}
                      userName={user.full_name || user.username}
                      userAvatar={user.avatar_url || user.avatar}
                      currentUserId={currentUserId}
                    />

                    <div className="text-xs text-muted-foreground">
                      {user.created_at
                        ? `Joined: ${new Date(
                            user.created_at
                          ).toLocaleDateString()}`
                        : "User since unknown"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {users.length > 0 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Showing {users.length} users. Use search to find specific users.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
