"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Loader2, MessageCircle, Send } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Comment, commentsAPI, getCurrentUser } from "@/lib/api";
import { CommentItem } from "../ui/comment-item";

interface CommentsListProps {
  postId: string;
  isOpen: boolean;
  onClose?: () => void;
  onCommentCountChange?: (newCount: number) => void;
}

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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

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
    if (!isOpen || !postId || loading) return;

    const fetchComments = async () => {
      setLoading(true);
      try {
        const response = await commentsAPI.getPostComments(
          postId,
          1,
          20,
          "newest"
        );

        const commentsData = response.items || [];
        setComments(commentsData);
        onCommentCountChange?.(commentsData.length);
        setHasMore(commentsData.length === 20);
        setPage(1);
      } catch (error) {
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
  }, [isOpen, postId, toast, onCommentCountChange]);

  const loadMoreComments = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await commentsAPI.getPostComments(
        postId,
        page + 1,
        20,
        "newest"
      );

      const commentsData = response.items || [];
      setComments((prev) => {
        const newComments = [...prev, ...commentsData];
        onCommentCountChange?.(newComments.length);
        return newComments;
      });

      setHasMore(commentsData.length === 20);
      setPage((prev) => prev + 1);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load more comments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [postId, page, loading, hasMore, toast, onCommentCountChange]);

  const handleAddComment = useCallback(async () => {
    if (!commentText.trim()) return;

    setIsCommenting(true);
    try {
      const newComment = await commentsAPI.createComment(postId, {
        content: commentText.trim(),
      });

      // Add the new comment to the top of the list
      setComments((prev) => {
        const newComments = [newComment, ...prev];
        // Notify parent about the new comment count
        onCommentCountChange?.(newComments.length);
        return newComments;
      });
      setCommentText("");

      toast({
        title: "Success",
        description: "Comment added successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCommenting(false);
    }
  }, [commentText, postId, toast, onCommentCountChange]);

  const handleCommentUpdate = useCallback((updatedComment: Comment) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === updatedComment.id ? updatedComment : comment
      )
    );
  }, []);

  const handleCommentDelete = useCallback(
    (commentId: string) => {
      setComments((prev) => {
        const newComments = prev.filter((comment) => comment.id !== commentId);
        // Notify parent about the new comment count
        onCommentCountChange?.(newComments.length);
        return newComments;
      });
    },
    [onCommentCountChange]
  );

  const handleReply = useCallback(
    (parentId: string, content: string) => {
      // Refresh comments to show the new reply and update count
      loadComments(1, false);
    },
    [loadComments]
  );

  const loadMoreComments = useCallback(() => {
    if (hasMore && !loading) {
      loadComments(page + 1, true);
    }
  }, [hasMore, loading, page, loadComments]);

  if (!isOpen) return null;

  return (
    <div className="space-y-4">
      <Separator />

      {/* Comments Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center">
          <MessageCircle className="mr-2 h-5 w-5" />
          Comments ({comments.length})
        </h3>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            Hide Comments
          </Button>
        )}
      </div>

      {/* Add Comment Form */}
      <div className="space-y-3">
        <Textarea
          value={commentText}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setCommentText(e.target.value)
          }
          placeholder="Write a comment..."
          className="min-h-[100px] resize-none"
        />
        <div className="flex justify-end">
          <Button
            onClick={handleAddComment}
            disabled={isCommenting || !commentText.trim()}
            className="flex items-center"
          >
            {isCommenting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {isCommenting ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </div>

      <Separator />

      {/* Comments List */}
      <div className="space-y-6 max-h-[500px] overflow-y-auto">
        {loading && comments.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading comments...</span>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <MessageCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <>
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onUpdate={handleCommentUpdate}
                onDelete={handleCommentDelete}
                onReply={handleReply}
                currentUserId={currentUser?.id}
              />
            ))}

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  onClick={loadMoreComments}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Load More Comments
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
