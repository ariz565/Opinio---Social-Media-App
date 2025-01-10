"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import {
  Heart,
  MessageSquare,
  Share,
  MoreHorizontal,
  Flag,
  Ban,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CommentsSection } from "./comments-section";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface PostCardProps {
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

export function PostCard({
  author,
  content,
  image,
  likes: initialLikes,
  comments,
  timestamp,
  trending,
}: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [showComments, setShowComments] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  if (isHidden) return null;

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const formatContent = (text: string) => {
    const formattedText = text
      .split(" ")
      .map((word, i) => {
        if (word.startsWith("#")) {
          return `<Link href="/hashtag/${word.slice(
            1
          )}" class="text-primary hover:underline">${word}</Link>`;
        }
        if (word.match(/^https?:\/\//)) {
          return `<a href="${word}" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">${word}</a>`;
        }
        return word;
      })
      .join(" ");

    return <div dangerouslySetInnerHTML={{ __html: formattedText }} />;
  };

  return (
    <Card className="border-0 border-b rounded-none">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <Link
          href={`/profile/${author.username}`}
          className="flex items-center gap-4 hover:opacity-80"
        >
          <Avatar>
            <AvatarImage src={author.image} alt={author.name} />
            <AvatarFallback>{author.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="font-semibold leading-none">{author.name}</p>
            <p className="text-sm text-muted-foreground">@{author.username}</p>
          </div>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{timestamp}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsHidden(true)}>
                <EyeOff className="h-4 w-4 mr-2" />
                Hide post
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Ban className="h-4 w-4 mr-2" />
                Block @{author.username}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Flag className="h-4 w-4 mr-2" />
                Report post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        {formatContent(content)}
        {image && (
          <img
            src={image}
            alt="Post content"
            className="mt-3 rounded-lg max-h-96 object-cover w-full"
          />
        )}
      </CardContent>
      <CardFooter className="flex gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1"
          onClick={handleLike}
        >
          <Heart
            className={cn("h-4 w-4", liked && "fill-red-500 text-red-500")}
          />
          {likes}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageSquare className="h-4 w-4" />
          {comments}
        </Button>
        <Button variant="ghost" size="sm">
          <Share className="h-4 w-4" />
        </Button>
      </CardFooter>
      {showComments && <CommentsSection />}
    </Card>
  );
}
