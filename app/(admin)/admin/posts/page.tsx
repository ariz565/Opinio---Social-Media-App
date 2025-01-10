'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Search, ThumbsUp, MessageSquare, Flag } from 'lucide-react';

const posts = [
  {
    id: '1',
    author: {
      name: 'Demo Test',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    },
    content: 'Just launched our new feature! Check it out! #tech #innovation',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    likes: 1234,
    comments: 89,
    reports: 2,
    status: 'Active',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    author: {
      name: 'Sarah Smith',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    },
    content: 'Beautiful sunset at the beach today! 🌅 #nature #peace',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    likes: 2543,
    comments: 167,
    reports: 0,
    status: 'Active',
    timestamp: '5 hours ago',
  },
];

export default function PostsPage() {
  const [search, setSearch] = useState('');

  return (
    <main className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Posts</h2>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="flex items-center space-x-2">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="h-8 w-8 rounded-full"
                />
                <div>
                  <CardTitle className="text-sm font-medium">
                    {post.author.name}
                  </CardTitle>
                  <CardDescription>{post.timestamp}</CardDescription>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Hide</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{post.content}</p>
              {post.image && (
                <img
                  src={post.image}
                  alt="Post content"
                  className="rounded-lg object-cover"
                  style={{ height: '200px', width: '100%' }}
                />
              )}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" /> {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" /> {post.comments}
                  </span>
                </div>
                {post.reports > 0 && (
                  <span className="flex items-center gap-1 text-red-500">
                    <Flag className="h-4 w-4" /> {post.reports} reports
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}