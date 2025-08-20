"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  isAuthenticated,
  getCurrentUser,
  postsAPI,
  type Post,
  type User,
} from "@/lib/api";
import { LoggedOutSidebar } from "@/components/logged-out-sidebar";
import { InfiniteFeed } from "@/components/infinite-feed";
import { CreatePost } from "@/components/create-post";
import {
  Loader2,
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

// Enhanced Post Card Component for explore feed
const ExplorePostCard = ({
  post,
  onInteractionAttempt,
}: {
  post: Post;
  onInteractionAttempt: () => void;
}) => {
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMinutes = Math.floor(
      (now.getTime() - postDate.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "now";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  return (
    <Card className="w-full border-0 border-b border-slate-200 dark:border-gray-800 rounded-none bg-white dark:bg-gray-900 hover:bg-slate-50/50 dark:hover:bg-gray-800/50 transition-colors duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-11 w-11 ring-2 ring-slate-200 dark:ring-gray-700">
              <AvatarImage
                src={post.author?.avatar_url}
                alt={post.author?.full_name}
              />
              <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-600 text-white font-semibold">
                {post.author?.full_name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-white">
                {post.author?.full_name || "Anonymous"}
              </p>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                @{post.author?.username} • {formatTimeAgo(post.created_at)}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-gray-800"
          >
            <MoreHorizontal className="h-4 w-4 text-slate-400" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-4">
        <div className="space-y-4">
          {/* Post content */}
          <p className="text-sm text-slate-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>

          {/* Display hashtags */}
          {post.hashtags && post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.hashtags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/50 cursor-pointer transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Media if exists */}
          {post.media && post.media.length > 0 && (
            <div className="grid grid-cols-1 gap-2 rounded-xl overflow-hidden">
              {post.media.map((media, index) => (
                <img
                  key={index}
                  src={media.url}
                  alt="Post media"
                  className="w-full h-auto max-h-96 object-cover rounded-xl border border-slate-200 dark:border-gray-700"
                />
              ))}
            </div>
          )}

          {/* Enhanced Interaction stats */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-gray-800">
            <div className="flex items-center space-x-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onInteractionAttempt}
                className="flex items-center space-x-2 text-slate-500 hover:text-rose-500 dark:text-gray-400 dark:hover:text-rose-400 transition-all duration-200 group"
              >
                <div className="p-2 rounded-full group-hover:bg-rose-50 dark:group-hover:bg-rose-900/20 transition-colors">
                  <Heart className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">{post.like_count}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onInteractionAttempt}
                className="flex items-center space-x-2 text-slate-500 hover:text-teal-500 dark:text-gray-400 dark:hover:text-teal-400 transition-all duration-200 group"
              >
                <div className="p-2 rounded-full group-hover:bg-teal-50 dark:group-hover:bg-teal-900/20 transition-colors">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">
                  {post.comment_count}
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onInteractionAttempt}
                className="flex items-center space-x-2 text-slate-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-all duration-200 group"
              >
                <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                  <Share className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">{post.share_count}</span>
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onInteractionAttempt}
              className="text-slate-500 hover:text-amber-500 dark:text-gray-400 dark:hover:text-amber-400 transition-all duration-200 group"
            >
              <div className="p-2 rounded-full group-hover:bg-amber-50 dark:group-hover:bg-amber-900/20 transition-colors">
                <Bookmark className="h-4 w-4" />
              </div>
            </motion.button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Loading component
const PostSkeleton = () => (
  <Card className="w-full border-0 border-b border-gray-200 dark:border-gray-800 rounded-none bg-white dark:bg-gray-900">
    <CardHeader className="pb-3">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    </CardHeader>
    <CardContent className="pt-0 pb-4">
      <div className="space-y-3">
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-32 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
      </div>
    </CardContent>
  </Card>
);

// Left Sidebar Skeleton
const LeftSidebarSkeleton = () => (
  <div className="sticky top-24">
    <Card className="p-6">
      <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
      <div className="space-y-4">
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    </Card>
  </div>
);

// Right Sidebar Skeleton
const RightSidebarSkeleton = () => (
  <div className="sticky top-24 space-y-6">
    <Card className="p-6">
      <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
          />
        ))}
      </div>
    </Card>

    <Card className="p-6">
      <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              <div className="space-y-2">
                <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </Card>
  </div>
);

const HomePage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isAuthenticated_, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSidebarLoading, setIsSidebarLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Ref for infinite scroll observer
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const loadExplorePosts = useCallback(
    async (pageNum: number = 1) => {
      try {
        setIsLoading(pageNum === 1);
        const response = await postsAPI.getExplorePosts(pageNum, 20);

        if (pageNum === 1) {
          setPosts(response.items);
          setPage(1);
        } else {
          setPosts((prev) => [...prev, ...response.items]);
        }

        setHasMore(response.has_next);
      } catch (error: any) {
        console.error("Error loading posts:", error);
        toast({
          title: "Error",
          description: "Failed to load posts. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [toast]
  );

  const loadMorePosts = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    await loadExplorePosts(nextPage);
  }, [page, hasMore, isLoadingMore, loadExplorePosts]);

  useEffect(() => {
    if (isRedirecting) return; // Prevent multiple redirects

    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsAuthenticated(authenticated);
      if (authenticated) {
        setCurrentUser(getCurrentUser());
        // Redirect authenticated users to feed page
        setIsRedirecting(true);
        router.replace("/feed");
        return;
      }
    };

    const initializePage = () => {
      checkAuth();
      loadExplorePosts();

      // Simulate sidebar loading delay for better UX
      setTimeout(() => {
        setIsSidebarLoading(false);
      }, 1000);
    };

    // Small delay to prevent rapid execution
    const timeoutId = setTimeout(initializePage, 100);
    return () => clearTimeout(timeoutId);
  }, [loadExplorePosts]); // Remove router from dependencies

  // Infinite scroll with Intersection Observer
  useEffect(() => {
    if (!hasMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, loadMorePosts]);

  const handleInteractionAttempt = () => {
    toast({
      title: "Sign in required",
      description: "Please sign in to interact with posts.",
      action: (
        <Button onClick={() => router.push("/auth")} size="sm">
          Sign In
        </Button>
      ),
    });
  };

  if (isAuthenticated_) {
    // Authenticated user - show full feed
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar - User info */}
            <div className="lg:col-span-1">
              {isSidebarLoading ? (
                <LeftSidebarSkeleton />
              ) : (
                <div className="sticky top-24">
                  <Card className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={currentUser?.avatar_url}
                          alt={currentUser?.full_name}
                        />
                        <AvatarFallback>
                          {currentUser?.full_name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {currentUser?.full_name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          @{currentUser?.username}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {currentUser?.posts_count || 0}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Posts
                        </p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {currentUser?.followers_count || 0}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Followers
                        </p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {currentUser?.following_count || 0}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Following
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>

            {/* Main Feed */}
            <div className="lg:col-span-2">
              <CreatePost
                onPostCreated={() => setRefreshTrigger((prev) => prev + 1)}
              />
              <InfiniteFeed refreshTrigger={refreshTrigger} />
            </div>

            {/* Right Sidebar - Suggestions */}
            <div className="lg:col-span-1">
              {isSidebarLoading ? (
                <RightSidebarSkeleton />
              ) : (
                <div className="sticky top-24">
                  <Card className="overflow-hidden border-0 shadow-sm bg-gradient-to-br from-white to-slate-50/50 dark:from-gray-900 dark:to-gray-800/50 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-slate-800 dark:text-white text-lg">
                        💡 Suggested for you
                      </h3>
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.02 }}
                          className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-gray-700"
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10 ring-2 ring-slate-200 dark:ring-gray-700 group-hover:ring-teal-300 dark:group-hover:ring-teal-600 transition-all">
                              <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-600 text-white font-semibold">
                                U{i}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-semibold text-slate-800 dark:text-white">
                                Professional User {i}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-gray-400">
                                Senior at Gulf Corp • 2.3k followers
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white border-0 shadow-sm hover:shadow-md transition-all duration-200 text-xs px-4"
                          >
                            Follow
                          </Button>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-200 dark:border-gray-700">
                      <Button
                        variant="ghost"
                        className="w-full text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/20 font-medium"
                      >
                        Show more suggestions
                      </Button>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Non-authenticated user - show explore with login sidebar
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Sign up prompt */}
          <div className="lg:col-span-1">
            {isSidebarLoading ? <LeftSidebarSkeleton /> : <LoggedOutSidebar />}
          </div>

          {/* Main Feed - Explore Posts */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Enhanced Explore Header */}
              <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 dark:from-blue-400/5 dark:to-indigo-400/5"></div>
                <div className="relative p-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-200 bg-clip-text text-transparent mb-3">
                        Explore
                      </h2>
                      <p className="text-slate-600 dark:text-gray-300 text-lg leading-relaxed max-w-md">
                        Discover what&apos;s happening in the Gulf professional
                        community
                      </p>
                    </div>
                    <div className="hidden sm:flex items-center space-x-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-slate-500 dark:text-gray-400">
                        Live
                      </span>
                    </div>
                  </div>

                  {/* Interactive Stats */}
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="text-center p-3 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
                      <p className="text-2xl font-bold text-slate-800 dark:text-white">
                        {posts.length}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wide">
                        Posts Today
                      </p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
                      <p className="text-2xl font-bold text-slate-800 dark:text-white">
                        2.4k
                      </p>
                      <p className="text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wide">
                        Active Users
                      </p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
                      <p className="text-2xl font-bold text-slate-800 dark:text-white">
                        156
                      </p>
                      <p className="text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wide">
                        New Today
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                {isLoading ? (
                  <div className="space-y-0">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <PostSkeleton key={i} />
                    ))}
                  </div>
                ) : posts.length > 0 ? (
                  <div className="space-y-0">
                    {posts.map((post) => (
                      <ExplorePostCard
                        key={post.id}
                        post={post}
                        onInteractionAttempt={handleInteractionAttempt}
                      />
                    ))}

                    {/* Infinite scroll trigger */}
                    {hasMore && (
                      <div
                        ref={loadMoreRef}
                        className="p-6 border-t border-gray-200 dark:border-gray-800 flex justify-center"
                      >
                        {isLoadingMore ? (
                          <div className="flex items-center text-slate-500 dark:text-gray-400">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin text-teal-500" />
                            Loading more posts...
                          </div>
                        ) : (
                          <div className="text-slate-400 dark:text-gray-500 text-sm">
                            Scroll for more posts
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-8 h-8 text-slate-400 dark:text-gray-500" />
                    </div>
                    <p className="text-slate-500 dark:text-gray-400 text-lg">
                      No public posts available at the moment.
                    </p>
                    <p className="text-slate-400 dark:text-gray-500 text-sm mt-2">
                      Be the first to share something with the community!
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar - Trending */}
          <div className="lg:col-span-1">
            {isSidebarLoading ? (
              <RightSidebarSkeleton />
            ) : (
              <div className="sticky top-24 space-y-6">
                {/* Enhanced Trending Card */}
                <Card className="overflow-hidden border-0 shadow-sm bg-gradient-to-br from-white to-slate-50/50 dark:from-gray-900 dark:to-gray-800/50">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-slate-800 dark:text-white text-lg">
                        🔥 Trending in Gulf
                      </h3>
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="space-y-4">
                      {[
                        { tag: "#DubaiJobs", count: 1247, trend: "+12%" },
                        { tag: "#RemoteWork", count: 892, trend: "+8%" },
                        { tag: "#TechCareers", count: 654, trend: "+15%" },
                        {
                          tag: "#GulfOpportunities",
                          count: 543,
                          trend: "+22%",
                        },
                        { tag: "#Networking", count: 421, trend: "+5%" },
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.02, x: 4 }}
                          className="group cursor-pointer p-3 rounded-xl hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-gray-700"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold text-teal-600 dark:text-teal-400 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                                {item.tag}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-gray-400">
                                {item.count.toLocaleString()} posts
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                                {item.trend}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Enhanced Join Card */}
                <Card className="overflow-hidden border-0 shadow-sm bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-900/10">
                  <div className="p-6">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-2xl font-bold">
                          GR
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-2">
                        Why join Gulf Return?
                      </h3>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700 dark:text-gray-200">
                            Connect with Gulf professionals
                          </p>
                          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                            Join 50k+ professionals across the region
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700 dark:text-gray-200">
                            Share your professional journey
                          </p>
                          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                            Showcase your achievements and experiences
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700 dark:text-gray-200">
                            Discover career opportunities
                          </p>
                          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                            Access exclusive job openings and networks
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => router.push("/auth")}
                      className="w-full h-12 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      Join Gulf Return
                    </Button>

                    <p className="text-center text-xs text-slate-500 dark:text-gray-400 mt-3">
                      Join thousands of professionals already here
                    </p>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
