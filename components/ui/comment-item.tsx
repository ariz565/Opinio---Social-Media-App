"use client";

import React, { useState, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Reply,
  Edit2,
  Trash2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { Textarea } from "./textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Comment, commentsAPI, reactionsAPI } from "@/lib/api";
import { cn } from "@/lib/utils";

interface CommentItemProps {
  comment: Comment;
  depth?: number;
  maxDepth?: number;
  onUpdate?: (updatedComment: Comment) => void;
  onDelete?: (commentId: string) => void;
  onReply?: (parentId: string, content: string) => void;
  currentUserId?: string;
}

export function CommentItem({
  comment,
  depth = 0,
  maxDepth = 3,
  onUpdate,
  onDelete,
  onReply,
  currentUserId,
}: CommentItemProps) {
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(comment.reactions?.like || 0);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [isUpdating, setIsUpdating] = useState(false);

  const isOwner = currentUserId === comment.user_id;
  const canReply = depth < maxDepth;

  const formatTimeAgo = useCallback((dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Unknown time";
    }
  }, []);

  const handleLike = useCallback(async () => {
    try {
      if (isLiked) {
        await reactionsAPI.removeReaction("comments", comment.id, "like");
        setIsLiked(false);
        setLikesCount((prev) => Math.max(0, prev - 1));
      } else {
        await reactionsAPI.addReaction("comments", comment.id, "like");
        setIsLiked(true);
        setLikesCount((prev) => prev + 1);
      }

      toast({
        title: "Success",
        description: isLiked ? "Like removed" : "Comment liked!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      });
    }
  }, [isLiked, comment.id, toast]);

  const handleReply = useCallback(async () => {
    if (!replyText.trim()) return;

    setIsReplying(true);
    try {
      const newReply = await commentsAPI.replyToComment(comment.id, {
        content: replyText.trim(),
      });

      if (onReply) {
        onReply(comment.id, replyText.trim());
      }

      setReplyText("");
      setShowReplyForm(false);
      setShowReplies(true);

      toast({
        title: "Success",
        description: "Reply added successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsReplying(false);
    }
  }, [replyText, comment.id, onReply, toast]);

  const handleEdit = useCallback(async () => {
    if (!editText.trim()) return;

    setIsUpdating(true);
    try {
      const updatedComment = await commentsAPI.updateComment(comment.id, {
        content: editText.trim(),
      });

      if (onUpdate) {
        onUpdate(updatedComment);
      }

      setIsEditing(false);

      toast({
        title: "Success",
        description: "Comment updated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  }, [editText, comment.id, onUpdate, toast]);

  const handleDelete = useCallback(async () => {
    try {
      await commentsAPI.deleteComment(comment.id);

      if (onDelete) {
        onDelete(comment.id);
      }

      toast({
        title: "Success",
        description: "Comment deleted successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete comment. Please try again.",
        variant: "destructive",
      });
    }
  }, [comment.id, onDelete, toast]);

  return (
    <div
      className={cn(
        "group",
        depth > 0 && "ml-8 pl-4 border-l-2 border-gray-200 dark:border-gray-700"
      )}
    >
      <div className="flex space-x-3">
        {/* Avatar */}
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={comment.user?.avatar_url || ""} />
          <AvatarFallback>
            {comment.user?.full_name?.[0] || comment.user?.username?.[0] || "U"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Comment Header */}
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {comment.user?.full_name ||
                comment.user?.username ||
                "Unknown User"}
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatTimeAgo(comment.created_at)}
            </span>
            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Comment Content */}
          {isEditing ? (
            <div className="mt-2 space-y-2">
              <Textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="Edit your comment..."
                className="min-h-[80px] resize-none"
              />
              <div className="flex space-x-2">
                <Button
                  onClick={handleEdit}
                  disabled={isUpdating || !editText.trim()}
                  size="sm"
                >
                  {isUpdating ? "Updating..." : "Update"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditText(comment.content);
                  }}
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-1">
              <p className="text-sm text-gray-800 dark:text-gray-200">
                {comment.content}
              </p>
            </div>
          )}

          {/* Comment Actions */}
          {!isEditing && (
            <div className="mt-2 flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={cn(
                  "h-6 px-2 text-xs",
                  isLiked
                    ? "text-red-600 hover:text-red-700"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                )}
              >
                <Heart
                  className={cn("mr-1 h-3 w-3", isLiked && "fill-current")}
                />
                {likesCount > 0 && likesCount}
              </Button>

              {canReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <Reply className="mr-1 h-3 w-3" />
                  Reply
                </Button>
              )}

              {comment.reply_count > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplies(!showReplies)}
                  className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <MessageCircle className="mr-1 h-3 w-3" />
                  {comment.reply_count}{" "}
                  {comment.reply_count === 1 ? "reply" : "replies"}
                </Button>
              )}
            </div>
          )}

          {/* Reply Form */}
          {showReplyForm && canReply && (
            <div className="mt-3 space-y-2">
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="min-h-[80px] resize-none"
              />
              <div className="flex space-x-2">
                <Button
                  onClick={handleReply}
                  disabled={isReplying || !replyText.trim()}
                  size="sm"
                >
                  {isReplying ? "Replying..." : "Reply"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyText("");
                  }}
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Nested Replies */}
          {showReplies && comment.replies && comment.replies.length > 0 && (
            <div className="mt-3">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  depth={depth + 1}
                  maxDepth={maxDepth}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  onReply={onReply}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
