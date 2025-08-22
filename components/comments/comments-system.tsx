"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Heart, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { isAuthenticated, getCurrentUser, commentsAPI } from "@/lib/api";
import { cn, formatDistanceToNow } from "@/lib/utils";

interface CommentsSystemProps {
  postId: string;
}

function CommentsSystem({ postId }: CommentsSystemProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const { toast } = useToast();
  const currentUser = getCurrentUser();
  const isAuth = isAuthenticated();

  useEffect(() => {
    console.log("CommentsSystem mounted for postId:", postId);
    const loadComments = async () => {
      try {
        setIsFetching(true);
        console.log("Fetching comments for post:", postId);
        const response = await commentsAPI.getPostComments(postId, 1, 20);
        console.log("Comments response:", response);
        setComments(response.items || []);
      } catch (error) {
        console.error("Error fetching comments:", error);
        toast({
          title: "Error",
          description: "Failed to load comments",
          variant: "destructive",
        });
      } finally {
        setIsFetching(false);
      }
    };

    loadComments();
  }, [postId, toast]);

  const submitComment = async () => {
    if (!isAuth) {
      toast({
        title: "Authentication Required",
        description: "Please log in to comment",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) return;

    try {
      setIsLoading(true);
      console.log("Submitting comment:", newComment.trim());
      const commentData = await commentsAPI.createComment(postId, {
        content: newComment.trim(),
      });
      console.log("Comment created:", commentData);

      setComments((prev) => [commentData, ...prev]);
      setNewComment("");

      toast({
        title: "Success",
        description: "Comment posted successfully",
      });
    } catch (error) {
      console.error("Error creating comment:", error);
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const CommentItem = ({ comment }: { comment: any }) => {
    const userInfo = comment.user || {};

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <div className="flex space-x-3">
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage
              src={userInfo.avatar_url || userInfo.avatar}
              alt={userInfo.full_name || userInfo.username || "User"}
            />
            <AvatarFallback className="text-xs">
              {(userInfo.full_name || userInfo.username || "U")
                .charAt(0)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl px-4 py-3">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-semibold text-sm text-gray-900 dark:text-white">
                  {userInfo.full_name || userInfo.username || "Unknown User"}
                </span>
                <span className="text-xs text-gray-500">
                  @{userInfo.username || "unknown"}
                </span>
              </div>

              <p className="text-gray-900 dark:text-gray-100 text-sm leading-relaxed">
                {comment.content}
              </p>
            </div>

            <div className="flex items-center space-x-4 mt-2 px-2">
              <span className="text-xs text-gray-400">
                {formatDistanceToNow(new Date(comment.created_at))} ago
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Comments {comments.length > 0 && `(${comments.length})`}
        </h3>
        {isFetching && (
          <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
        )}
      </div>

      {isAuth ? (
        <div className="flex space-x-3">
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage
              src={currentUser?.avatar_url || currentUser?.avatar}
              alt={currentUser?.username}
            />
            <AvatarFallback>
              {(currentUser?.username || "U").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="min-h-[80px] resize-none"
              disabled={isLoading}
            />
            <div className="flex justify-end mt-2">
              <Button
                onClick={submitComment}
                disabled={!newComment.trim() || isLoading}
                size="sm"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Comment
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500 bg-gray-50 dark:bg-gray-900 rounded-lg">
          Please log in to comment
        </div>
      )}

      <div className="space-y-4">
        {isFetching && comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            Loading comments...
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            No comments yet. Be the first to comment!
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentsSystem;
