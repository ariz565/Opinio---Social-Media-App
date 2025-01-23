"use client";

import { useEffect, useState } from "react";
import { PostCard } from "@/components/posts/post-card";
import { ProfileCard } from "@/components/sidebar/left-sidebar.tsx/profile-card";
import { PagesSection } from "@/components/sidebar/left-sidebar.tsx/pages-section";
import { TrendingCard } from "@/components/sidebar/right-sidebar.tsx/trending-card";
import { ChatSystem } from "@/components/chat/chat-system";
import { Footer } from "@/components/footer/footer";

const posts = [
  {
    id: "1",
    author: {
      name: "Sarah Wilson",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      username: "sarahw",
    },
    content: "Check out my latest project! #WebDevelopment #Programming",
    likes: 42,
    comments: 5,
    timestamp: "2h ago",
  },
  {
    id: "2",
    author: {
      name: "James Miller",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      username: "jamesm",
    },
    content:
      "Excited to share my thoughts on #ArtificialIntelligence #Innovation",
    likes: 31,
    comments: 3,
    timestamp: "4h ago",
  },
  {
    id: "3",
    author: {
      name: "Emily Davis",
      image: "https://images.unsplash.com/photo-1554151228-14d9def656e4",
      username: "emilyd",
    },
    content: "Loving the latest trends in #Programming #Technology",
    likes: 20,
    comments: 2,
    timestamp: "1d ago",
  },
];

export function HashtagClientPage({ tag }: { tag: string }) {
  const [filteredPosts, setFilteredPosts] = useState(() =>
    posts.filter((post) =>
      post.content.toLowerCase().includes(`#${tag.toLowerCase()}`)
    )
  );

  useEffect(() => {
    // Any additional client-side logic can go here
  }, [tag]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {/* Left Sidebar */}
          <div className="md:col-span-1">
            <div className="sticky top-6 space-y-6">
              <ProfileCard />
              {/* <PagesSection /> */}
            </div>
          </div>

          {/* Main Content - Hashtag Posts */}
          <div className="md:col-span-2">
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h1 className="text-3xl font-bold">#{tag}</h1>
                <p className="text-muted-foreground">
                  {filteredPosts.length} post
                  {filteredPosts.length !== 1 ? "s" : ""}
                </p>
              </div>
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <PostCard key={post.id} {...post} />
                ))
              ) : (
                <p className="text-muted-foreground">
                  No posts found for #{tag}
                </p>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:col-span-1 lg:block">
            <div className="sticky top-6 space-y-6">
              <TrendingCard />
              <ChatSystem />
              {/* Footer */}
              <div className="mt-8">
                <Footer />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
