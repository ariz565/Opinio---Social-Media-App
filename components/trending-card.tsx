"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TrendingUp } from "lucide-react";
import Link from "next/link";

export function TrendingCard() {
  const trendingTopics = [
    {
      topic: "WebDevelopment",
      posts: "12.5K posts",
    },
    {
      topic: "ArtificialIntelligence",
      posts: "8.2K posts",
    },
    {
      topic: "Innovation",
      posts: "6.7K posts",
    },
    {
      topic: "Technology",
      posts: "5.9K posts",
    },
    {
      topic: "Programming",
      posts: "4.3K posts",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Trending Topics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trendingTopics.map((item, index) => (
            <div key={index} className="flex justify-between">
              <Link
                href={`/hashtag/${item.topic}`}
                className="font-medium hover:text-primary"
              >
                #{item.topic}
              </Link>
              <span className="text-sm text-muted-foreground">
                {item.posts}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
