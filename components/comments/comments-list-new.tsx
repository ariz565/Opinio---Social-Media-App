"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Loader2, MessageCircle, Send, Heart, Reply } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Comment, commentsAPI, getCurrentUser } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface CommentsListProps {
  postId: string;
  isOpen: boolean;
  onClose?: () => void;
  onCommentCountChange?: (newCount: number) => void;
}

interface CommentItemProps {
  comment: Comment;
  onReply: (parentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  currentUserId?: string;
  depth?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onReply,
  onDelete,
  currentUserId,
  depth = 0,
}) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(comment.reactions?.total || 0);

  const handleReply = async () => {
    if (!replyContent.trim()) return;

    setIsReplying(true);
    try {
      console.log("🔍 Replying to comment:", comment);
      console.log("🔍 Comment ID:", comment.id);
      await onReply(comment.id, replyContent.trim());
      setReplyContent("");
      setShowReplyBox(false);
    } finally {
      setIsReplying(false);
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const timeAgo = formatDistanceToNow(new Date(comment.created_at), {
    addSuffix: true,
  });

  return (
    <div
      className={cn(
        "group transition-all duration-200",
        depth > 0 && "ml-6 pl-4 border-l border-gray-200 dark:border-gray-700"
      )}
    >
      <div className="flex gap-3 py-2">
        {/* Avatar */}
        <Avatar
          className={cn(
            "flex-shrink-0 ring-1 ring-gray-100 dark:ring-gray-700",
            depth === 0 ? "h-9 w-9" : "h-7 w-7"
          )}
        >
          <AvatarImage src={comment.user?.avatar_url || comment.user?.avatar} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium text-xs">
            {comment.user?.full_name?.charAt(0)?.toUpperCase() ||
              comment.user?.username?.charAt(0)?.toUpperCase() ||
              "U"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Comment Bubble */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                    {comment.user?.full_name || comment.user?.username}
                  </span>
                  {comment.user?.is_verified && (
                    <svg
                      className="w-4 h-4 text-blue-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {timeAgo}
                  </span>
                </div>
                <p className="text-sm text-gray-900 dark:text-white leading-relaxed whitespace-pre-wrap break-words">
                  {comment.content}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mt-1.5 px-2">
            <button
              onClick={handleLike}
              className={cn(
                "flex items-center gap-1.5 text-xs font-medium transition-all duration-200 hover:scale-105",
                liked
                  ? "text-red-500"
                  : "text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
              )}
            >
              <Heart className={cn("w-3.5 h-3.5", liked && "fill-current")} />
              {likesCount > 0 && <span>{likesCount.toLocaleString()}</span>}
            </button>

            <button
              onClick={() => setShowReplyBox(!showReplyBox)}
              className="text-xs font-medium text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
            >
              Reply
            </button>

            {currentUserId === comment.user_id && (
              <button
                onClick={() => onDelete(comment.id || (comment as any)._id)}
                className="text-xs font-medium text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200"
              >
                Delete
              </button>
            )}
          </div>

          {/* Reply Box */}
          {showReplyBox && (
            <div className="mt-3 pl-2">
              <div className="flex gap-2">
                <Avatar className="h-6 w-6 flex-shrink-0">
                  <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs">
                    U
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder={`Reply to ${
                      comment.user?.full_name || comment.user?.username
                    }...`}
                    className="min-h-[60px] text-sm resize-none border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:border-blue-500 transition-all duration-200"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleReply}
                      disabled={!replyContent.trim() || isReplying}
                      className="h-7 px-3 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-full"
                    >
                      {isReplying ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        "Reply"
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setShowReplyBox(false);
                        setReplyContent("");
                      }}
                      className="h-7 px-3 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2 space-y-1">
          {comment.replies
            .slice(0, depth < 2 ? comment.replies.length : 3)
            .map((reply, index) => (
              <CommentItem
                key={reply.id || (reply as any)._id || `reply-${index}`}
                comment={reply}
                onReply={onReply}
                onDelete={onDelete}
                currentUserId={currentUserId}
                depth={depth + 1}
              />
            ))}

          {/* View More Replies Button */}
          {depth < 2 && comment.replies.length > 3 && (
            <button className="ml-10 text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium py-1 transition-colors">
              View {comment.replies.length - 3} more replies
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export function CommentsList({
  postId,
  isOpen,
  onClose,
  onCommentCountChange,
}: CommentsListProps) {
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const hasLoadedRef = useRef(false);

  // Get current user
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Failed to load current user:", error);
      }
    };

    loadCurrentUser();
  }, []);

  // Load comments when component opens
  useEffect(() => {
    if (!isOpen || !postId || hasLoadedRef.current) return;

    const fetchComments = async () => {
      setLoading(true);
      hasLoadedRef.current = true;
      try {
        const response = await commentsAPI.getPostComments(
          postId,
          1,
          20,
          "newest"
        );

        const commentsData = response.items || [];
        console.log("🔍 Raw comments data:", commentsData);

        // Transform comments to ensure id field exists
        const transformedComments = commentsData.map((comment: any) => ({
          ...comment,
          id: comment.id || comment._id, // Ensure id field exists
        }));

        console.log("🔍 Transformed comments:", transformedComments);
        setComments(transformedComments);
        setHasMore(transformedComments.length === 20);

        // Update comment count after state is set (prevent setState during render)
        if (onCommentCountChange) {
          setTimeout(() => onCommentCountChange(transformedComments.length), 0);
        }
      } catch (error) {
        console.error("Failed to load comments:", error);
        toast({
          title: "Error",
          description: "Failed to load comments. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [isOpen, postId, onCommentCountChange, toast]);

  // Reset hasLoadedRef when postId changes
  useEffect(() => {
    hasLoadedRef.current = false;
  }, [postId]);

  const handleAddComment = useCallback(async () => {
    if (!commentText.trim()) return;

    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please log in to comment on posts.",
        variant: "destructive",
      });
      return;
    }

    setIsCommenting(true);
    try {
      const newComment = await commentsAPI.createComment(postId, {
        content: commentText.trim(),
      });

      // Add the new comment to the list
      setComments((prev) => {
        const transformedComment = {
          ...newComment,
          id: newComment.id || (newComment as any)._id,
        };
        const newComments = [transformedComment, ...prev];

        // Update count after state change
        setTimeout(() => onCommentCountChange?.(newComments.length), 0);
        return newComments;
      });

      setCommentText("");
      toast({
        title: "Success",
        description: "Comment added successfully!",
      });
    } catch (error) {
      console.error("Failed to add comment:", error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCommenting(false);
    }
  }, [commentText, postId, toast, onCommentCountChange, currentUser]);

  const handleReply = useCallback(
    async (parentId: string, content: string) => {
      console.log("🔍 HandleReply called with parentId:", parentId);

      if (!currentUser) {
        toast({
          title: "Authentication Required",
          description: "Please log in to reply to comments.",
          variant: "destructive",
        });
        return;
      }

      if (!parentId) {
        toast({
          title: "Error",
          description: "Invalid comment ID. Cannot reply.",
          variant: "destructive",
        });
        return;
      }

      try {
        const newReply = await commentsAPI.replyToComment(parentId, {
          content,
        });

        // Refresh comments to show the new reply
        const response = await commentsAPI.getPostComments(
          postId,
          1,
          20,
          "newest"
        );
        const updatedComments = response.items || [];

        // Transform comments to ensure id field exists
        const transformedComments = updatedComments.map((comment: any) => ({
          ...comment,
          id: comment.id || comment._id,
        }));

        setComments(transformedComments);
        onCommentCountChange?.(transformedComments.length);

        toast({
          title: "Success",
          description: "Reply added successfully!",
        });
      } catch (error) {
        console.error("Failed to add reply:", error);
        toast({
          title: "Error",
          description: "Failed to add reply. Please try again.",
          variant: "destructive",
        });
      }
    },
    [postId, toast, onCommentCountChange, currentUser]
  );

  const handleDeleteComment = useCallback(
    async (commentId: string) => {
      try {
        await commentsAPI.deleteComment(commentId);

        setComments((prev) => {
          const newComments = prev.filter(
            (comment) => comment.id !== commentId
          );
          onCommentCountChange?.(newComments.length);
          return newComments;
        });

        toast({
          title: "Success",
          description: "Comment deleted successfully!",
        });
      } catch (error) {
        console.error("Failed to delete comment:", error);
        toast({
          title: "Error",
          description: "Failed to delete comment. Please try again.",
          variant: "destructive",
        });
      }
    },
    [toast, onCommentCountChange]
  );

  const loadMoreComments = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const currentPage = Math.ceil(comments.length / 20) + 1;
      const response = await commentsAPI.getPostComments(
        postId,
        currentPage,
        20,
        "newest"
      );

      const newComments = response.items || [];
      setComments((prev) => [...prev, ...newComments]);
      setHasMore(newComments.length === 20);
    } catch (error) {
      console.error("Failed to load more comments:", error);
      toast({
        title: "Error",
        description: "Failed to load more comments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingMore(false);
    }
  }, [postId, comments.length, hasMore, loadingMore, toast]);

  if (!isOpen) return null;

  return (
    <div className="space-y-4 mt-4">
      <Separator />

      {/* Comments Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Comments ({comments.length})
        </h3>
      </div>

      {/* Add Comment Box */}
      {currentUser ? (
        <div className="flex gap-3 pb-4 border-b border-gray-100 dark:border-gray-700">
          <Avatar className="h-9 w-9 flex-shrink-0 ring-2 ring-gray-100 dark:ring-gray-700">
            <AvatarImage src={currentUser?.avatar_url || currentUser?.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
              {currentUser?.full_name?.charAt(0)?.toUpperCase() ||
                currentUser?.username?.charAt(0)?.toUpperCase() ||
                "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts..."
              className="min-h-[80px] resize-none border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
            />
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {commentText.length > 0 && `${commentText.length} characters`}
              </div>
              <Button
                onClick={handleAddComment}
                disabled={!commentText.trim() || isCommenting}
                className="h-9 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
              >
                {isCommenting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                {isCommenting ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Please log in to comment on this post
          </p>
          <Button
            onClick={() => (window.location.href = "/auth/login")}
            variant="outline"
            size="sm"
          >
            Log In
          </Button>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-3 pt-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Loading comments...
              </p>
            </div>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
              <MessageCircle className="w-10 h-10 text-gray-400" />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900 dark:text-white">
                No comments yet
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Be the first to share your thoughts on this post!
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-1">
              {comments.map((comment, index) => (
                <CommentItem
                  key={comment.id || (comment as any)._id || `comment-${index}`}
                  comment={comment}
                  onReply={handleReply}
                  onDelete={handleDeleteComment}
                  currentUserId={currentUser?.id}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center pt-6">
                <Button
                  variant="ghost"
                  onClick={loadMoreComments}
                  disabled={loadingMore}
                  className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full px-6 py-2"
                >
                  {loadingMore ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  {loadingMore ? "Loading..." : "View more comments"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
