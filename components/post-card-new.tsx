"use client";

import { useState, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  ThumbsUp,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { LazyImage } from "./ui/lazy-image";
import { ImageViewer } from "./ui/image-viewer";
import { CommentsList } from "./comments/comments-list";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { type Post, reactionsAPI, commentsAPI } from "@/lib/api";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  onPostUpdate?: (updatedPost: Post) => void;
}

export function PostCard({ post, onPostUpdate }: PostCardProps) {
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(post.is_liked || false);
  const [likesCount, setLikesCount] = useState(post.like_count || 0);
  const [showComments, setShowComments] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [imageViewerIndex, setImageViewerIndex] = useState(0);

  const formatTimeAgo = useCallback((dateString: string) => {
    try {
      let date: Date;

      if (
        dateString.includes("T") &&
        !dateString.includes("Z") &&
        !dateString.includes("+") &&
        !dateString.includes("-", 10)
      ) {
        date = new Date(dateString + "Z");
      } else {
        date = new Date(dateString);
      }

      if (isNaN(date.getTime())) {
        return "Unknown time";
      }

      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Unknown time";
    }
  }, []);

  const handleLike = useCallback(async () => {
    try {
      const optimisticLiked = !isLiked;
      const optimisticCount = optimisticLiked ? likesCount + 1 : likesCount - 1;

      setIsLiked(optimisticLiked);
      setLikesCount(optimisticCount);

      if (optimisticLiked) {
        await reactionsAPI.addReaction("posts", post.id, "like");
      } else {
        await reactionsAPI.removeReaction("posts", post.id, "like");
      }
    } catch (error) {
      setIsLiked(!isLiked);
      setLikesCount(likesCount);

      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      });
    }
  }, [isLiked, likesCount, post.id, toast]);

  const handleImageClick = useCallback((index: number) => {
    setImageViewerIndex(index);
    setImageViewerOpen(true);
  }, []);

  const getImageUrls = useCallback(() => {
    return (
      post.media
        ?.filter((item) => item.type === "image")
        .map((item) => item.url) || []
    );
  }, [post.media]);

  const truncateContent = (content: string, maxLength: number) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength);
  };

  const shouldShowExpandButton = post.content.length > 200;
  const displayContent = isExpanded
    ? post.content
    : truncateContent(post.content, 200);

  return (
    <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <Avatar className="h-11 w-11 border-2 border-white shadow-md ring-2 ring-gray-100 dark:ring-gray-700">
              <AvatarImage src={post.author?.avatar_url || ""} />
              <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-600 text-white font-semibold">
                {post.author?.full_name?.charAt(0)?.toUpperCase() ||
                  post.author?.username?.charAt(0)?.toUpperCase() ||
                  "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                  {post.author?.full_name || post.author?.username}
                </h3>
                <span className="text-gray-500 dark:text-gray-400">•</span>
                <time className="text-sm text-gray-500 dark:text-gray-400">
                  {formatTimeAgo(post.created_at)}
                </time>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 rounded-full"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Save post</DropdownMenuItem>
              <DropdownMenuItem>Hide post</DropdownMenuItem>
              <DropdownMenuItem>Report post</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Post Content */}
        <div className="space-y-3">
          <div className="text-gray-900 dark:text-white leading-relaxed">
            {displayContent}

            {shouldShowExpandButton && (
              <>
                {!isExpanded && "..."}
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-0 h-auto text-teal-600 hover:text-teal-700 ml-2"
                >
                  {isExpanded ? (
                    <>
                      Show less <ChevronUp className="h-4 w-4 ml-1" />
                    </>
                  ) : (
                    <>
                      Show more <ChevronDown className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
              </>
            )}
          </div>

          {/* Hashtags */}
          {post.hashtags && post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.hashtags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 hover:bg-teal-200 dark:hover:bg-teal-800 cursor-pointer transition-colors"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Post Image/Media */}
        {post.media && post.media.length > 0 && (
          <div className="mt-4">
            {post.media.length === 1 ? (
              // Single media item
              <div className="rounded-xl overflow-hidden group">
                {post.media[0].type === "image" ? (
                  <div
                    className="cursor-pointer"
                    onClick={() => handleImageClick(0)}
                  >
                    <LazyImage
                      src={post.media[0].url}
                      alt="Post image"
                      aspectRatio="video"
                      className="group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <video
                    src={post.media[0].url}
                    controls
                    className="w-full aspect-video"
                    preload="metadata"
                  />
                )}
              </div>
            ) : post.media.length === 2 ? (
              // Two media items - side by side
              <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden">
                {post.media.map((item, index) => (
                  <div key={index} className="group">
                    {item.type === "image" ? (
                      <div
                        className="cursor-pointer"
                        onClick={() => handleImageClick(index)}
                      >
                        <LazyImage
                          src={item.url}
                          alt={`Post image ${index + 1}`}
                          aspectRatio="square"
                          className="group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        <video
                          src={item.url}
                          controls
                          className="w-full h-full object-cover"
                          preload="metadata"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : post.media.length === 3 ? (
              // Three media items - one large, two small
              <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden">
                <div className="group">
                  {post.media[0].type === "image" ? (
                    <div
                      className="cursor-pointer"
                      onClick={() => handleImageClick(0)}
                    >
                      <LazyImage
                        src={post.media[0].url}
                        alt="Post image 1"
                        aspectRatio="square"
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <video
                        src={post.media[0].url}
                        controls
                        className="w-full h-full object-cover"
                        preload="metadata"
                      />
                    </div>
                  )}
                </div>
                <div className="grid grid-rows-2 gap-2">
                  {post.media.slice(1).map((item, index) => (
                    <div key={index + 1} className="group">
                      {item.type === "image" ? (
                        <div
                          className="cursor-pointer h-full"
                          onClick={() => handleImageClick(index + 1)}
                        >
                          <LazyImage
                            src={item.url}
                            alt={`Post image ${index + 2}`}
                            className="group-hover:scale-105 transition-transform duration-300 h-full"
                          />
                        </div>
                      ) : (
                        <div className="relative bg-gray-100 dark:bg-gray-800 overflow-hidden h-full">
                          <video
                            src={item.url}
                            controls
                            className="w-full h-full object-cover"
                            preload="metadata"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Four or more media items - 2x2 grid with overflow indicator
              <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden">
                {post.media.slice(0, 3).map((item, index) => (
                  <div key={index} className="group">
                    {item.type === "image" ? (
                      <div
                        className="cursor-pointer"
                        onClick={() => handleImageClick(index)}
                      >
                        <LazyImage
                          src={item.url}
                          alt={`Post image ${index + 1}`}
                          aspectRatio="square"
                          className="group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        <video
                          src={item.url}
                          controls
                          className="w-full h-full object-cover"
                          preload="metadata"
                        />
                      </div>
                    )}
                  </div>
                ))}
                <div className="relative group">
                  {post.media[3].type === "image" ? (
                    <div
                      className="cursor-pointer"
                      onClick={() => handleImageClick(3)}
                    >
                      <LazyImage
                        src={post.media[3].url}
                        alt="Post image 4"
                        aspectRatio="square"
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <video
                        src={post.media[3].url}
                        controls
                        className="w-full h-full object-cover"
                        preload="metadata"
                      />
                    </div>
                  )}
                  {post.media.length > 4 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white text-lg font-semibold">
                        +{post.media.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Engagement Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-2">
          <div className="flex items-center gap-4">
            {likesCount > 0 && (
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4 text-blue-500" />
                {likesCount}
              </span>
            )}
            {(post.comment_count || 0) > 0 && (
              <span>
                {post.comment_count} comment
                {post.comment_count !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {(post.share_count || 0) > 0 && (
            <span>
              {post.share_count} share{post.share_count !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <Separator className="bg-gray-200 dark:bg-gray-700" />

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={cn(
                "flex items-center gap-2 rounded-xl transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20",
                isLiked && "text-red-500 bg-red-50 dark:bg-red-900/20"
              )}
            >
              <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
              <span className="font-medium">{likesCount || "Like"}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="font-medium">Comment</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200"
            >
              <Share2 className="h-5 w-5" />
              <span className="font-medium">Share</span>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={cn(
              "rounded-xl transition-all duration-200 hover:bg-yellow-50 dark:hover:bg-yellow-900/20",
              isBookmarked &&
                "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20"
            )}
          >
            <Bookmark
              className={cn("h-5 w-5", isBookmarked && "fill-current")}
            />
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <CommentsList
            postId={post.id}
            isOpen={showComments}
            onClose={() => setShowComments(false)}
          />
        )}
      </CardContent>

      {/* Image Viewer Modal */}
      <ImageViewer
        images={getImageUrls()}
        initialIndex={imageViewerIndex}
        isOpen={imageViewerOpen}
        onClose={() => setImageViewerOpen(false)}
      />
    </Card>
  );
}
