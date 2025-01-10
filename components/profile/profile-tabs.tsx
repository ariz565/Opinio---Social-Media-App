"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { PostCard } from "../post-card";
import { ScrollArea } from "../ui/scroll-area";

interface ProfileTabsProps {
  posts: any[];
  media: any[];
  likes: any[];
}

export function ProfileTabs({ posts, media, likes }: ProfileTabsProps) {
  return (
    <Tabs defaultValue="posts" className="mt-6">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="media">Media</TabsTrigger>
        <TabsTrigger value="likes">Likes</TabsTrigger>
      </TabsList>
      <ScrollArea className="h-[calc(100vh-300px)]">
        <TabsContent value="posts" className="mt-4 space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </TabsContent>
        <TabsContent value="media" className="mt-4">
          <div className="grid grid-cols-3 gap-1">
            {media.map((item) => (
              <img
                key={item.id}
                src={item.url}
                alt={item.description}
                className="aspect-square object-cover"
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="likes" className="mt-4 space-y-4">
          {likes.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </TabsContent>
      </ScrollArea>
    </Tabs>
  );
}
