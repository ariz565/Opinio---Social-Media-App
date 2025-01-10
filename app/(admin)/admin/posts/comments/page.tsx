"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, ThumbsUp, Flag } from "lucide-react";

const comments = [
  {
    id: "1",
    content: "Great article! Very informative.",
    author: "John Doe",
    post: "Getting Started with Web Development",
    likes: 15,
    reports: 0,
    status: "Approved",
    timestamp: "2024-03-15 14:30",
  },
  {
    id: "2",
    content: "This is spam content that needs moderation.",
    author: "Unknown User",
    post: "Digital Marketing Trends",
    likes: 0,
    reports: 3,
    status: "Flagged",
    timestamp: "2024-03-15 14:25",
  },
];

export default function CommentsPage() {
  const [search, setSearch] = useState("");

  return (
    <main className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Comments</h2>
        <div className="flex space-x-2">
          <Button variant="outline">Bulk Approve</Button>
          <Button variant="outline">Bulk Delete</Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search comments..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Comment</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Post</TableHead>
              <TableHead>Engagement</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comments.map((comment) => (
              <TableRow key={comment.id}>
                <TableCell className="max-w-[300px] truncate">
                  {comment.content}
                </TableCell>
                <TableCell>{comment.author}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {comment.post}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" /> {comment.likes}
                    </span>
                    {comment.reports > 0 && (
                      <span className="flex items-center gap-1 text-red-500">
                        <Flag className="h-4 w-4" /> {comment.reports}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      comment.status === "Approved" ? "secondary" : "destructive"
                    }
                  >
                    {comment.status}
                  </Badge>
                </TableCell>
                <TableCell>{comment.timestamp}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View</DropdownMenuItem>
                      <DropdownMenuItem>Approve</DropdownMenuItem>
                      <DropdownMenuItem>Flag</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
