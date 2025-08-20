"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  MoreHorizontal,
  MapPin,
  Clock,
  Eye,
  EyeOff,
  Users,
  Lock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatTimeAgo } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { LazyImage } from "./ui/lazy-image";
import { ImageViewer } from "./ui/image-viewer";
import { Post } from "@/lib/api";

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
  className?: string;
}

export const PostCard = ({
  post,
  onLike,
  onComment,
  onShare,
  onBookmark,
  className = "",
}: PostCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [imageViewerIndex, setImageViewerIndex] = useState(0);
  const [showFullContent, setShowFullContent] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Content processing
  const processedContent = useMemo(() => {
    if (!post.content) return "";

    // Limit content length for collapsed view
    const maxLength = 200;
    if (!showFullContent && post.content.length > maxLength) {
      return post.content.substring(0, maxLength) + "...";
    }

    return post.content;
  }, [post.content, showFullContent]);

  // Check if content needs expansion
  const needsExpansion = useMemo(() => {
    return post.content && post.content.length > 200;
  }, [post.content]);

  // Handle interactions
  const handleLike = useCallback(() => {
    onLike?.(post.id);
  }, [onLike, post.id]);

  const handleComment = useCallback(() => {
    onComment?.(post.id);
  }, [onComment, post.id]);

  const handleShare = useCallback(() => {
    onShare?.(post.id);
  }, [onShare, post.id]);

  const handleBookmark = useCallback(() => {
    onBookmark?.(post.id);
  }, [onBookmark, post.id]);

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

  // Visibility icon
  const getVisibilityIcon = () => {
    switch (post.visibility) {
      case "private":
        return <Lock className="w-3 h-3" />;
      case "close_friends":
        return <Users className="w-3 h-3" />;
      case "followers":
        return <Users className="w-3 h-3" />;
      default:
        return <Eye className="w-3 h-3" />;
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card
      className={`overflow-hidden transition-all duration-200 hover:shadow-lg border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-900/80 ${className}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Link href={`/profile/${post.author?.username || "unknown"}`}>
              <Avatar className="h-10 w-10 ring-2 ring-white/50 dark:ring-gray-700/50 shadow-sm">
                <AvatarImage
                  src={post.author?.avatar_url}
                  alt={post.author?.full_name || "Unknown User"}
                />
                <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-500 text-white text-sm font-semibold">
                  {getUserInitials(post.author?.full_name || "Unknown User")}
                </AvatarFallback>
              </Avatar>
            </Link>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Link
                  href={`/profile/${post.author?.username || "unknown"}`}
                  className="font-semibold text-gray-900 dark:text-gray-100 hover:underline truncate"
                >
                  {post.author?.full_name || "Unknown User"}
                </Link>
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  @{post.author?.username || "unknown"}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTimeAgo(post.created_at)}
                </span>

                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  {getVisibilityIcon()}
                  <span className="capitalize">{post.visibility}</span>
                </div>

                {post.location && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {post.location?.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            >
              <DropdownMenuItem className="hover:bg-gray-50 dark:hover:bg-gray-700">
                Save post
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-50 dark:hover:bg-gray-700">
                Copy link
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-50 dark:hover:bg-gray-700">
                Report post
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                Hide post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Post Content */}
        <div className="space-y-3">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-wrap">
              {processedContent}
            </p>

            {needsExpansion && (
              <Button
                variant="link"
                size="sm"
                onClick={() => setShowFullContent(!showFullContent)}
                className="p-0 h-auto text-teal-600 hover:text-teal-700 dark:text-teal-400"
              >
                {showFullContent ? "Show less" : "Show more"}
              </Button>
            )}
          </div>

          {/* Hashtags */}
          {post.hashtags && post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.hashtags.map((hashtag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs bg-teal-50 text-teal-700 hover:bg-teal-100 dark:bg-teal-900/30 dark:text-teal-300 cursor-pointer"
                >
                  #{hashtag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Media */}
        {post.media && post.media.length > 0 && (
          <div className="mt-4">
            {post.media.length === 1 ? (
              // Single media item
              <div className="rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 group">
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
                          fill={true}
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
                    <LazyImage
                      src={post.media[0].url}
                      alt="Post image 1"
                      aspectRatio="square"
                      fill={true}
                      className="group-hover:scale-105 transition-transform duration-300"
                    />
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
                        <LazyImage
                          src={item.url}
                          alt={`Post image ${index + 2}`}
                          fill={true}
                          className="group-hover:scale-105 transition-transform duration-300 h-full"
                        />
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
                      <LazyImage
                        src={item.url}
                        alt={`Post image ${index + 1}`}
                        aspectRatio="square"
                        fill={true}
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
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
                    <LazyImage
                      src={post.media[3].url}
                      alt="Post image 4"
                      aspectRatio="square"
                      fill={true}
                      className="group-hover:scale-105 transition-transform duration-300"
                    />
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
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4">
            {post.like_count > 0 && (
              <span className="hover:text-red-600 dark:hover:text-red-400 cursor-pointer transition-colors">
                {post.like_count} likes
              </span>
            )}
            {post.comment_count > 0 && (
              <span className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">
                {post.comment_count} comments
              </span>
            )}
          </div>
          {post.share_count > 0 && (
            <span className="hover:text-green-600 dark:hover:text-green-400 cursor-pointer transition-colors">
              {post.share_count} shares
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                post.is_liked
                  ? "text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              }`}
            >
              <Heart
                className={`w-4 h-4 transition-all ${
                  post.is_liked ? "fill-current scale-110" : ""
                }`}
              />
              <span className="text-sm font-medium">Like</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleComment}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Comment</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200"
            >
              <Share className="w-4 h-4" />
              <span className="text-sm font-medium">Share</span>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all duration-200"
          >
            <Bookmark className="w-4 h-4" />
          </Button>
        </div>
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
};
