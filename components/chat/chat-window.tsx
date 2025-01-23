"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Send, Image, File, Smile, Paperclip } from "lucide-react";
import { ChatMessage } from "./chat-message";
import { EmojiPicker } from "../posts/emoji-picker";
import { cn } from "@/lib/utils";

interface ChatWindowProps {
  user: {
    name: string;
    image: string;
  };
}

export function ChatWindow({ user }: ChatWindowProps) {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const messages = [
    {
      id: "1",
      message: "Hey, how are you?",
      timestamp: "2:30 PM",
      author: user,
      isOwn: false,
    },
    {
      id: "2",
      message: "I'm good, thanks! How about you?",
      timestamp: "2:31 PM",
      author: {
        name: "Me",
        image: "https://github.com/shadcn.png",
      },
      isOwn: true,
    },
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleSendMessage = () => {
    if (!message.trim() && files.length === 0) return;

    // TODO: Implement message sending with files
    console.log("Sending message:", message, files);

    setMessage("");
    setFiles([]);
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea ref={scrollRef} className="flex-1 p-4 space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} {...msg} />
        ))}

        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="relative bg-muted rounded-lg p-2 flex items-center gap-2"
              >
                <File className="h-4 w-4" />
                <span className="text-sm truncate max-w-[150px]">
                  {file.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setFiles(files.filter((_, i) => i !== index))}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="border-t p-4 space-y-4">
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            onChange={handleFileSelect}
            aria-label="Upload files"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile className="h-4 w-4" />
          </Button>
          {showEmojiPicker && (
            <div className="absolute bottom-20 left-0">
              <EmojiPicker
                onSelect={(emoji) => {
                  setMessage((prev) => prev + emoji);
                  setShowEmojiPicker(false);
                }}
              />
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="flex-1"
          />
          <Button onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
