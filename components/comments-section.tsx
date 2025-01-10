'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Heart, Reply } from 'lucide-react';
import { cn } from '@/lib/utils';

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
}

interface CommentProps {
  comment: Comment;
  level?: number;
}

function CommentComponent({ comment, level = 0 }: CommentProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  return (
    <div className={cn('space-y-4', level > 0 && 'ml-12 pt-4')}>
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
          </div>
          <div className="flex gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={() => setLiked(!liked)}
            >
              <Heart
                className={cn('h-4 w-4', liked && 'fill-red-500 text-red-500')}
              />
              {comment.likes}
            </Button>
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
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsReplying(false)}
                  >
                    Cancel
                  </Button>
                  <Button size="sm">Reply</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {comment.replies?.map((reply) => (
        <CommentComponent key={reply.id} comment={reply} level={level + 1} />
      ))}
    </div>
  );
}

export function CommentsSection() {
  const comments: Comment[] = [
    {
      id: '1',
      author: {
        name: 'Sarah Wilson',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        username: 'sarahw',
      },
      content: 'This is amazing! Thanks for sharing.',
      timestamp: '2h ago',
      likes: 12,
      replies: [
        {
          id: '2',
          author: {
            name: 'Alex Chen',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
            username: 'alexc',
          },
          content: 'Completely agree! The design is stunning.',
          timestamp: '1h ago',
          likes: 5,
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