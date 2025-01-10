"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";
import { PostCard } from "../post-card";

interface Post {
  id: string;
  author: {
    name: string;
    image: string;
    username: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
  trending?: boolean;
}

interface InfiniteFeedProps {
  type: "following" | "explore";
  sortBy: "top" | "recent";
}

const POSTS_PER_PAGE = 5;

// Sample data for different feed types
const FOLLOWING_POSTS = [
  {
    name: "Emma Wilson",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    content:
      "Just launched our new product! Check it out at https://example.com #tech",
  },
  {
    name: "James Miller",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    content: "Excited to share my latest #design project!",
  },
];

const EXPLORE_POSTS = [
  {
    name: "Sarah Chen",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    content: "Thoughts on the future of #AI and #MachineLearning",
  },
  {
    name: "Alex Johnson",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    content: "Breaking news in #technology: https://techexample.com",
  },
];

export function InfiniteFeed({ type, sortBy }: InfiniteFeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();

  const fetchPosts = async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const samplePosts = type === "following" ? FOLLOWING_POSTS : EXPLORE_POSTS;
    const newPosts: Post[] = Array.from({ length: POSTS_PER_PAGE }, (_, i) => {
      const sample = samplePosts[i % samplePosts.length];
      return {
        id: `${page}-${i}`,
        author: {
          name: sample.name,
          image: sample.image,
          username: sample.name.toLowerCase().replace(" ", ""),
        },
        content: sample.content,
        image:
          Math.random() > 0.5
            ? "https://images.unsplash.com/photo-1516321497487-e288fb19713f"
            : undefined,
        likes: Math.floor(Math.random() * 100),
        comments: Math.floor(Math.random() * 20),
        timestamp: `${Math.floor(Math.random() * 24)}h ago`,
        trending: sortBy === "top" ? Math.random() > 0.5 : false,
      };
    });

    setPosts((prev) => [...prev, ...newPosts]);
    setPage((prev) => prev + 1);
    setLoading(false);

    if (page > 4) {
      setHasMore(false);
    }
  };

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
  }, [type, sortBy]);

  useEffect(() => {
    if (inView && hasMore) {
      fetchPosts();
    }
  }, [inView, type, sortBy]);

  return (
    <div className="space-y-0">
      {posts.map((post) => (
        <PostCard key={post.id} {...post} />
      ))}
      {hasMore && (
        <div ref={ref} className="flex justify-center p-4">
          {loading && <Loader2 className="h-6 w-6 animate-spin" />}
        </div>
      )}
      {!hasMore && posts.length > 0 && (
        <div className="text-center p-4 text-muted-foreground">
          No more posts to load
        </div>
      )}
    </div>
  );
}
