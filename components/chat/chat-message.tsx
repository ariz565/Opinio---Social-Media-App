'use client';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: string;
  timestamp: string;
  isOwn?: boolean;
  author: {
    name: string;
    image: string;
  };
}

export function ChatMessage({ message, timestamp, isOwn, author }: ChatMessageProps) {
  return (
    <div className={cn('flex gap-2', isOwn && 'flex-row-reverse')}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={author.image} />
        <AvatarFallback>{author.name[0]}</AvatarFallback>
      </Avatar>
      <div className={cn('flex flex-col', isOwn && 'items-end')}>
        <div
          className={cn(
            'rounded-lg px-3 py-2 max-w-[70%]',
            isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted'
          )}
        >
          {message}
        </div>
        <span className="text-xs text-muted-foreground mt-1">{timestamp}</span>
      </div>
    </div>
  );
}