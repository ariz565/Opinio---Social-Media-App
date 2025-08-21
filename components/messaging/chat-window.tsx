"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Phone,
  Video,
  Info,
  MoreHorizontal,
  Smile,
  Paperclip,
  Send,
  ArrowLeft,
  Mic,
  Camera,
  Image as ImageIcon,
  FileText,
  MapPin,
  Heart,
  ThumbsUp,
  Laugh,
  Angry,
  Frown,
  Reply,
  Forward,
  Copy,
  Trash2,
  Edit,
  Star,
  Check,
  CheckCheck,
  Clock,
  Shield,
  Volume2,
  Play,
  Download,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Chat {
  id: string;
  type: "direct" | "group";
  name: string;
  avatar?: string;
  participants: string[];
  isOnline?: boolean;
  encryption: boolean;
}

interface Message {
  id: string;
  chatId: string;
  sender: string;
  content: string;
  type: "text" | "image" | "video" | "voice" | "file" | "location";
  timestamp: Date;
  isRead: boolean;
  reactions: { emoji: string; users: string[] }[];
  replyTo?: string;
  isForwarded: boolean;
  isEdited: boolean;
  editHistory?: { content: string; timestamp: Date }[];
  deliveryStatus: "sending" | "sent" | "delivered" | "read";
  isDisappearing?: boolean;
  disappearAfter?: number;
}

interface ChatWindowProps {
  chat: Chat;
  messages: Message[];
  onShowInfo: () => void;
  isTyping: boolean;
  currentUser: any;
}

const reactionEmojis = [
  { emoji: "👍", icon: ThumbsUp },
  { emoji: "❤️", icon: Heart },
  { emoji: "😂", icon: Laugh },
  { emoji: "😮", icon: Frown },
  { emoji: "😢", icon: Frown },
  { emoji: "😡", icon: Angry },
];

export default function ChatWindow({
  chat,
  messages,
  onShowInfo,
  isTyping,
  currentUser,
}: ChatWindowProps) {
  const [messageText, setMessageText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageText.trim() && !isRecording) return;

    // In a real app, this would send the message to the server
    console.log("Sending message:", messageText);
    setMessageText("");
    setReplyToMessage(null);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReaction = (messageId: string, emoji: string) => {
    // In a real app, this would send the reaction to the server
    console.log("Adding reaction:", messageId, emoji);
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (timestamp.toDateString() === today.toDateString()) {
      return "Today";
    } else if (timestamp.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};

    messages.forEach((message) => {
      const dateKey = message.timestamp.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });

    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="md:hidden">
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={chat.avatar} alt={chat.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {chat.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {chat.isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-gray-900 dark:text-white">
                {chat.name}
              </h2>
              {chat.encryption && (
                <Tooltip>
                  <TooltipTrigger>
                    <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </TooltipTrigger>
                  <TooltipContent>End-to-end encrypted</TooltipContent>
                </Tooltip>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {chat.isOnline ? "Online" : "Last seen recently"}
              {isTyping && " • typing..."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 rounded-full"
              >
                <Phone className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Voice call</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 rounded-full"
              >
                <Video className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Video call</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 rounded-full"
                onClick={onShowInfo}
              >
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Chat info</TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 rounded-full"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Star className="h-4 w-4 mr-2" />
                Star Chat
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Volume2 className="h-4 w-4 mr-2" />
                Mute Notifications
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 dark:text-red-400">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {Object.entries(messageGroups).map(([dateKey, dayMessages]) => (
            <div key={dateKey}>
              {/* Date separator */}
              <div className="flex items-center justify-center my-4">
                <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    {formatDate(new Date(dateKey))}
                  </span>
                </div>
              </div>

              {/* Messages for this date */}
              <div className="space-y-4">
                {dayMessages.map((message, index) => {
                  const isOwnMessage = message.sender === currentUser?.username;
                  const previousMessage =
                    index > 0 ? dayMessages[index - 1] : null;
                  const showAvatar =
                    !isOwnMessage &&
                    (!previousMessage ||
                      previousMessage.sender !== message.sender);

                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex gap-3 group",
                        isOwnMessage ? "justify-end" : "justify-start"
                      )}
                    >
                      {!isOwnMessage && (
                        <div className="w-8">
                          {showAvatar && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={chat.avatar}
                                alt={message.sender}
                              />
                              <AvatarFallback className="text-xs">
                                {message.sender.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      )}

                      <div
                        className={cn(
                          "flex flex-col max-w-xs lg:max-w-md",
                          isOwnMessage ? "items-end" : "items-start"
                        )}
                      >
                        {/* Reply reference */}
                        {message.replyTo && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Replying to message
                          </div>
                        )}

                        {/* Message bubble */}
                        <div
                          className={cn(
                            "relative px-4 py-2 rounded-2xl shadow-sm",
                            isOwnMessage
                              ? "bg-blue-600 text-white rounded-br-md"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md"
                          )}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            setSelectedMessage(message.id);
                          }}
                        >
                          {/* Message content */}
                          <div className="break-words">
                            {message.isForwarded && (
                              <div className="text-xs opacity-75 mb-1">
                                <Forward className="h-3 w-3 inline mr-1" />
                                Forwarded
                              </div>
                            )}

                            {message.type === "text" && (
                              <p>{message.content}</p>
                            )}

                            {message.type === "image" && (
                              <div className="relative w-64 h-48">
                                <Image
                                  src={message.content}
                                  alt="Shared image"
                                  fill
                                  className="rounded-lg object-cover"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            )}

                            {message.type === "voice" && (
                              <div className="flex items-center gap-2 min-w-48">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 rounded-full"
                                >
                                  <Play className="h-4 w-4" />
                                </Button>
                                <div className="flex-1 h-1 bg-gray-300 dark:bg-gray-600 rounded">
                                  <div className="h-full w-1/3 bg-blue-500 rounded"></div>
                                </div>
                                <span className="text-xs">0:15</span>
                              </div>
                            )}

                            {message.isEdited && (
                              <span className="text-xs opacity-75 ml-2">
                                (edited)
                              </span>
                            )}
                          </div>

                          {/* Reactions */}
                          {message.reactions.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {message.reactions.map((reaction, idx) => (
                                <button
                                  key={idx}
                                  className="flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full text-xs"
                                  onClick={() =>
                                    handleReaction(message.id, reaction.emoji)
                                  }
                                >
                                  <span>{reaction.emoji}</span>
                                  <span>{reaction.users.length}</span>
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Message actions */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 right-0 flex gap-1">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 bg-white dark:bg-gray-800 shadow-md"
                                >
                                  <Smile className="h-3 w-3" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-2">
                                <div className="flex gap-1">
                                  {reactionEmojis.map((reaction) => (
                                    <button
                                      key={reaction.emoji}
                                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                      onClick={() =>
                                        handleReaction(
                                          message.id,
                                          reaction.emoji
                                        )
                                      }
                                    >
                                      {reaction.emoji}
                                    </button>
                                  ))}
                                </div>
                              </PopoverContent>
                            </Popover>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 bg-white dark:bg-gray-800 shadow-md"
                              onClick={() => setReplyToMessage(message)}
                            >
                              <Reply className="h-3 w-3" />
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 bg-white dark:bg-gray-800 shadow-md"
                                >
                                  <MoreHorizontal className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Forward className="h-4 w-4 mr-2" />
                                  Forward
                                </DropdownMenuItem>
                                {isOwnMessage && (
                                  <>
                                    <DropdownMenuItem>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600 dark:text-red-400">
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {/* Message info */}
                        <div
                          className={cn(
                            "flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400",
                            isOwnMessage ? "flex-row-reverse" : "flex-row"
                          )}
                        >
                          <span>{formatTime(message.timestamp)}</span>
                          {isOwnMessage && (
                            <div>
                              {message.deliveryStatus === "read" && (
                                <CheckCheck className="h-3 w-3 text-blue-500" />
                              )}
                              {message.deliveryStatus === "delivered" && (
                                <CheckCheck className="h-3 w-3" />
                              )}
                              {message.deliveryStatus === "sent" && (
                                <Check className="h-3 w-3" />
                              )}
                              {message.deliveryStatus === "sending" && (
                                <Clock className="h-3 w-3" />
                              )}
                            </div>
                          )}
                        </div>

                        {/* Disappearing message indicator */}
                        {message.isDisappearing && (
                          <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            Disappearing message
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={chat.avatar} alt={chat.name} />
                <AvatarFallback className="text-xs">
                  {chat.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-2xl rounded-bl-md">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:100ms]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:200ms]"></div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Reply banner */}
      <AnimatePresence>
        {replyToMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-3 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-700"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Reply className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  Replying to {replyToMessage.sender}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyToMessage(null)}
                className="h-6 w-6 text-blue-600 dark:text-blue-400"
              >
                ×
              </Button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 truncate">
              {replyToMessage.content}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-end gap-3">
          {/* Attachment button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 rounded-full"
              >
                <Paperclip className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start">
              <DropdownMenuItem>
                <Camera className="h-4 w-4 mr-2" />
                Camera
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ImageIcon className="h-4 w-4 mr-2" />
                Gallery
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="h-4 w-4 mr-2" />
                Document
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MapPin className="h-4 w-4 mr-2" />
                Location
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Message input */}
          <div className="flex-1">
            <Input
              ref={inputRef}
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              className="resize-none border-0 bg-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 rounded-full px-4"
            />
          </div>

          {/* Voice/Send button */}
          {messageText.trim() ? (
            <Button
              onClick={handleSendMessage}
              className="h-10 w-10 rounded-full bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 rounded-full"
              onMouseDown={() => setIsRecording(true)}
              onMouseUp={() => setIsRecording(false)}
              onMouseLeave={() => setIsRecording(false)}
            >
              <Mic
                className={cn(
                  "h-5 w-5",
                  isRecording
                    ? "text-red-500"
                    : "text-gray-500 dark:text-gray-400"
                )}
              />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
