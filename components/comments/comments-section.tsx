"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Heart, Reply, Image as ImageIcon, Smile } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { EmojiPicker } from "../posts/emoji-picker";

interface Comment {
  id: string;
  author: {
    name: string;
    image: string;
    username: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
  images?: string[];
}

interface CommentProps {
  comment: Comment;
  level?: number;
}

function CommentComponent({ comment, level = 0 }: CommentProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyImages, setReplyImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReplyImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn("space-y-4", level > 0 && "ml-12 pt-4")}
    >
      <div className="flex gap-4">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.author.image} />
          <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold">{comment.author.name}</span>
                <span className="text-sm text-muted-foreground ml-2">
                  @{comment.author.username}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {comment.timestamp}
              </span>
            </div>
            <p className="mt-2">{comment.content}</p>
            {comment.images && comment.images.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {comment.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Comment image ${index + 1}`}
                    className="rounded-lg object-cover w-full h-32"
                  />
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Heart
                className={cn("h-4 w-4", liked && "fill-red-500 text-red-500")}
              />
              {comment.likes + (liked ? 1 : 0)}
            </motion.button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={() => setIsReplying(!isReplying)}
            >
              <Reply className="h-4 w-4" />
              Reply
            </Button>
          </div>
          {isReplying && (
            <div className="flex gap-4 mt-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>ME</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  placeholder="Write a reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="resize-none"
                />
                {replyImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {replyImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Upload preview ${index + 1}`}
                          className="rounded-lg object-cover w-full h-32"
                        />
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() =>
                            setReplyImages((prev) =>
                              prev.filter((_, i) => i !== index)
                            )
                          }
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      aria-label="Upload files"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsReplying(false);
                        setReplyContent("");
                        setReplyImages([]);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button size="sm">Reply</Button>
                  </div>
                </div>
                {showEmojiPicker && (
                  <div className="absolute z-10">
                    <EmojiPicker
                      onSelect={(emoji) => {
                        setReplyContent((prev) => prev + emoji);
                        setShowEmojiPicker(false);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <AnimatePresence>
        {comment.replies?.map((reply) => (
          <CommentComponent key={reply.id} comment={reply} level={level + 1} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

export function CommentsSection() {
  const comments: Comment[] = [
    {
      id: "1",
      author: {
        name: "Sarah Wilson",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
        username: "sarahw",
      },
      content: "This is amazing! Thanks for sharing.",
      timestamp: "2h ago",
      likes: 12,
      replies: [
        {
          id: "2",
          author: {
            name: "Alex Chen",
            image:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
            username: "alexc",
          },
          content: "Completely agree! The design is stunning.",
          timestamp: "1h ago",
          likes: 5,
          images: [
            "https://images.unsplash.com/photo-1516321497487-e288fb19713f",
          ],
        },
      ],
    },
  ];

  return (
    <div className="space-y-6 mt-4 pl-4">
      {comments.map((comment) => (
        <CommentComponent key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
