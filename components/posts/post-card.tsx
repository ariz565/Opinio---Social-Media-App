"use client";

import { useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import {
  Heart,
  MessageSquare,
  Share,
  MoreHorizontal,
  Flag,
  Ban,
  EyeOff,
  Bookmark,
} from "lucide-react";
import { cn } from "@/lib/utils";
import CommentsSystem from "../comments/comments-system";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { isAuthenticated, postsAPI } from "@/lib/api";

interface PostCardProps {
  _id: string;
  author: {
    _id: string;
    name: string;
    image: string;
    username: string;
  };
  content: string;
  image?: string;
  likes: string[];
  comments: number;
  timestamp: string;
  trending?: boolean;
}

export function PostCard({
  _id,
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
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();
  const isAuth = isAuthenticated();

  if (isHidden) return null;

  const handleLike = async () => {
    if (!isAuth) {
      toast({
        title: "Authentication Required",
        description: "Please log in to like posts",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = liked
        ? await postsAPI.unlikePost(_id)
        : await postsAPI.likePost(_id);

      setLiked(response.is_liked);
      // Update the likes count - we'll need to manage this differently since we don't get the full likes array
    } catch (error) {
      console.error("Error liking post:", error);
      toast({
        title: "Error",
        description: "Failed to like post",
        variant: "destructive",
      });
    }
  };

  const formatContent = (text: string) => {
    return text
      .split(" ")
      .map((word, i) => {
        if (word.startsWith("#")) {
          return `<span key="${i}" class="text-primary hover:underline cursor-pointer">${word}</span>`;
        }
        if (word.match(/^https?:\/\//)) {
          return `<a key="${i}" href="${word}" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">${word}</a>`;
        }
        return word;
      })
      .join(" ");
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full"
    >
      <Card className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href={`/profile/${author.username}`}>
                <Avatar className="h-10 w-10 hover:ring-2 hover:ring-blue-500 transition-all">
                  <AvatarImage src={author.image} alt={author.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                    {author.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/profile/${author.username}`}
                    className="font-semibold text-gray-900 dark:text-white hover:underline"
                  >
                    {author.name}
                  </Link>
                  {trending && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-pink-500 to-orange-500 text-white">
                      🔥 Trending
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  @{author.username} • {timestamp}
                </span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setIsSaved(!isSaved)}>
                  <Bookmark
                    className={cn("h-4 w-4 mr-2", isSaved && "fill-current")}
                  />
                  {isSaved ? "Remove from bookmarks" : "Save post"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsHidden(true)}>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Hide this post
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Flag className="h-4 w-4 mr-2" />
                  Report post
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Ban className="h-4 w-4 mr-2" />
                  Block {author.name}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="pb-3">
          <div
            className="text-gray-900 dark:text-white leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: formatContent(content),
            }}
          />
          {image && (
            <div className="mt-3 relative w-full h-96">
              <Image
                src={image}
                alt="Post content"
                fill
                className="rounded-lg object-cover"
              />
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-3 pb-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={cn(
                  "flex items-center gap-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors",
                  liked && "text-red-600 dark:text-red-400"
                )}
              >
                <Heart
                  className={cn(
                    "h-5 w-5 transition-all",
                    liked && "fill-current scale-110"
                  )}
                />
                <span className="font-medium">{likes.length}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  console.log(
                    "Comments button clicked, current state:",
                    showComments
                  );
                  setShowComments(!showComments);
                }}
                className={cn(
                  "flex items-center gap-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors",
                  showComments && "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
                )}
              >
                <MessageSquare
                  className={cn("h-5 w-5", showComments && "fill-current")}
                />
                <span className="font-medium">{comments}</span>
                <span className="text-xs opacity-70">
                  {showComments ? "Hide" : "View"}
                </span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 rounded-full hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
              >
                <Share className="h-5 w-5" />
                <span className="font-medium">Share</span>
              </Button>
            </div>
          </div>
        </CardFooter>

        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
            >
              <div className="p-4">
                <CommentsSystem postId={_id} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
