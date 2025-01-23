"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { PostCard } from "../posts/post-card";
import { Plus } from "lucide-react";

interface ProfileActivityProps {
  username: string;
}

export function ProfileActivity({ username }: ProfileActivityProps) {
  const activities = [
    {
      type: "post",
      content: "Excited to share that I",
      timestamp: "2d ago",
      likes: 45,
      comments: 12,
      author: {
        name: username,
        image: "https://github.com/shadcn.png",
        username: username,
      },
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Activity</CardTitle>
          <p className="text-sm text-muted-foreground">1,234 followers</p>
        </div>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Create a post
        </Button>
      </CardHeader>
      <CardContent>
        {activities.map((activity, index) => (
          <PostCard key={index} {...activity} />
        ))}
      </CardContent>
    </Card>
  );
}
