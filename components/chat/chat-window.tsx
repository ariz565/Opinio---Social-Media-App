'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Send } from 'lucide-react';
import { ChatMessage } from './chat-message';

interface ChatWindowProps {
  user: {
    name: string;
    image: string;
  };
}

export function ChatWindow({ user }: ChatWindowProps) {
  const [message, setMessage] = useState('');

  const messages = [
    {
      id: '1',
      message: 'Hey, how are you?',
      timestamp: '2:30 PM',
      author: user,
      isOwn: false,
    },
    {
      id: '2',
      message: "I'm good, thanks! How about you?",
      timestamp: '2:31 PM',
      author: {
        name: 'Me',
        image: 'https://github.com/shadcn.png',
      },
      isOwn: true,
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} {...msg} />
        ))}
      </div>
      <div className="flex gap-2 p-4 border-t">
        <Input
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}