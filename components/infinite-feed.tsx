"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { PostCard as PostCardNew } from "@/components/post-card-new";
import { FeedSkeleton } from "@/components/ui/loading-skeletons";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { postsAPI, Post } from "@/lib/api";

interface FeedResponse {
  posts: Post[];
  has_next: boolean;
  page: number;
}

interface InfiniteFeedProps {
  feedType: "following" | "explore" | "trending";
  refreshTrigger?: number;
  userId?: string;
}

export const InfiniteFeed = ({
  feedType,
  refreshTrigger = 0,
  userId,
}: InfiniteFeedProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  // Fetch posts function
  const fetchPosts = useCallback(
    async (pageNum: number, isInitial = false) => {
      try {
        // Cancel previous request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        let response;
        if (feedType === "following") {
          response = await postsAPI.getFeed(pageNum, 20);
        } else if (feedType === "trending") {
          response = await postsAPI.getTrendingPosts(pageNum, 20, 24); // 24 hours for trending
        } else {
          response = await postsAPI.getExplorePosts(pageNum, 20);
        }
        console.log(`🔍 Feed response for ${feedType}:`, response);

        setPosts((prevPosts) => {
          if (isInitial) {
            return response.posts || response.items || [];
          }
          // Avoid duplicates
          const existingIds = new Set(prevPosts.map((p) => p.id));
          const newPosts = (response.posts || response.items || []).filter(
            (p) => !existingIds.has(p.id)
          );
          return [...prevPosts, ...newPosts];
        });

        setHasMore(response.has_next || false);
        setPage(response.page + 1);
        setError(null);
        retryCountRef.current = 0;
      } catch (err: any) {
        if (err.name === "AbortError") {
          return; // Request was cancelled, ignore
        }

        console.error(`Error fetching ${feedType} posts:`, err);
        setError(err.message || `Failed to load ${feedType} posts`);

        // Retry logic for network errors
        if (retryCountRef.current < maxRetries && isInitial) {
          retryCountRef.current++;
          setTimeout(() => {
            fetchPosts(pageNum, isInitial);
          }, 1000 * retryCountRef.current);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [feedType]
  );

  // Initial load and refresh effect
  useEffect(() => {
    setLoading(true);
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    fetchPosts(1, true);
  }, [fetchPosts, refreshTrigger]);

  // Load more posts
  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore && !error) {
      setLoadingMore(true);
      fetchPosts(page);
    }
  }, [loadingMore, hasMore, error, page, fetchPosts]);

  // Intersection Observer for infinite scroll
  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || loadingMore) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            loadMore();
          }
        },
        { threshold: 0.1 }
      );

      if (node) observer.observe(node);

      return () => {
        if (node) observer.unobserve(node);
      };
    },
    [loading, loadingMore, hasMore, loadMore]
  );

  // Handle post interactions with optimistic updates
  const handleLike = useCallback(async (postId: string) => {
    // Optimistic update
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              is_liked: !post.is_liked,
              like_count: post.is_liked
                ? post.like_count - 1
                : post.like_count + 1,
            }
          : post
      )
    );

    try {
      const response = await postsAPI.likePost(postId);

      // Update the actual like data from response
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                is_liked: response.is_liked,
                like_count: response.like_count,
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
      // Revert optimistic update
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                is_liked: !post.is_liked,
                like_count: post.is_liked
                  ? post.like_count + 1
                  : post.like_count - 1,
              }
            : post
        )
      );
    }
  }, []);

  const handleComment = useCallback((postId: string) => {
    // Update comment count optimistically
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, comment_count: post.comment_count + 1 }
          : post
      )
    );
  }, []);

  const handleShare = useCallback((postId: string) => {
    // Update share count optimistically
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, share_count: post.share_count + 1 }
          : post
      )
    );
  }, []);

  // Handle post updates (for likes, comments, etc.)
  const handlePostUpdate = useCallback((updatedPost: Post) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  }, []);

  // Retry function
  const handleRetry = useCallback(() => {
    setError(null);
    setLoading(true);
    fetchPosts(1, true);
  }, [fetchPosts]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Loading state
  if (loading && posts.length === 0) {
    return <FeedSkeleton />;
  }

  // Error state
  if (error && posts.length === 0) {
    return (
      <div className="space-y-4">
        <Alert className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            {error}
          </AlertDescription>
        </Alert>
        <div className="text-center">
          <Button onClick={handleRetry} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!loading && posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-teal-100 to-blue-100 dark:from-teal-900 dark:to-blue-900 rounded-full flex items-center justify-center">
          <RefreshCw className="w-8 h-8 text-teal-600 dark:text-teal-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          No posts yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {feedType === "following"
            ? "Follow some people to see their posts here"
            : "Be the first to share something interesting"}
        </p>
        <Button onClick={handleRetry} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post, index) => (
        <div
          key={post.id}
          ref={index === posts.length - 1 ? lastPostRef : null}
        >
          <PostCardNew post={post} onPostUpdate={handlePostUpdate} />
        </div>
      ))}

      {/* Loading more indicator */}
      {loadingMore && (
        <div className="py-4">
          <FeedSkeleton />
        </div>
      )}

      {/* End of feed indicator */}
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-teal-100 to-blue-100 dark:from-teal-900 dark:to-blue-900 rounded-full flex items-center justify-center">
            ✨
          </div>
          <p className="text-sm">You&apos;re all caught up!</p>
        </div>
      )}

      {/* Error indicator for load more */}
      {error && posts.length > 0 && (
        <div className="text-center py-4">
          <Alert className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              Failed to load more posts
            </AlertDescription>
          </Alert>
          <Button
            onClick={() => fetchPosts(page)}
            variant="outline"
            size="sm"
            className="mt-2 gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};
