"use client";

import { useEffect, useState } from "react";
import { PostCard } from "@/components/post-card";

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
    <div className="space-y-4">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold">#{tag}</h1>
        <p className="text-muted-foreground">
          {filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""}
        </p>
      </div>
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => <PostCard key={post.id} {...post} />)
      ) : (
        <p className="text-muted-foreground">No posts found for #{tag}</p>
      )}
    </div>
  );
}
