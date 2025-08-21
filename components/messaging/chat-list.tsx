"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Pin,
  Volume2,
  VolumeX,
  Circle,
  Check,
  CheckCheck,
  Archive,
  MoreHorizontal,
  Star,
  Trash2,
  Shield,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Chat {
  id: string;
  type: "direct" | "group";
  name: string;
  avatar?: string;
  lastMessage: {
    content: string;
    timestamp: Date;
    sender: string;
    isRead: boolean;
  };
  participants: string[];
  isOnline?: boolean;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  isArchived: boolean;
  encryption: boolean;
}

interface ChatListProps {
  chats: Chat[];
  activeChat: Chat | null;
  onChatSelect: (chat: Chat) => void;
  onlineUsers: string[];
}

export default function ChatList({
  chats,
  activeChat,
  onChatSelect,
  onlineUsers,
}: ChatListProps) {
  const [hoveredChat, setHoveredChat] = useState<string | null>(null);

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return timestamp.toLocaleDateString();
  };

  const truncateMessage = (message: string, maxLength: number = 50) => {
    return message.length > maxLength
      ? `${message.substring(0, maxLength)}...`
      : message;
  };

  const sortedChats = [...chats].sort((a, b) => {
    // Pinned chats first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    // Then by last message time
    return (
      b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime()
    );
  });

  return (
    <ScrollArea className="flex-1">
      <div className="p-2">
        {sortedChats.map((chat) => {
          const isActive = activeChat?.id === chat.id;
          const isUserOnline =
            chat.type === "direct" && onlineUsers.includes(chat.name);

          return (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01 }}
              className={cn(
                "relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 group",
                isActive
                  ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
              )}
              onClick={() => onChatSelect(chat)}
              onMouseEnter={() => setHoveredChat(chat.id)}
              onMouseLeave={() => setHoveredChat(null)}
            >
              {/* Avatar with online indicator */}
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={chat.avatar} alt={chat.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                    {chat.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* Online indicator */}
                {isUserOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                )}

                {/* Encryption indicator */}
                {chat.encryption && (
                  <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-600 rounded-full flex items-center justify-center">
                    <Shield className="h-2.5 w-2.5 text-white" />
                  </div>
                )}
              </div>

              {/* Chat info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1">
                    <h3
                      className={cn(
                        "font-medium truncate",
                        isActive
                          ? "text-blue-900 dark:text-blue-100"
                          : "text-gray-900 dark:text-white"
                      )}
                    >
                      {chat.name}
                    </h3>

                    {/* Chat indicators */}
                    <div className="flex items-center gap-1 ml-1">
                      {chat.isPinned && (
                        <Pin className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                      )}
                      {chat.isMuted && (
                        <VolumeX className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTime(chat.lastMessage.timestamp)}
                    </span>

                    {/* Message status for sent messages */}
                    {chat.lastMessage.sender === "current_user" && (
                      <div className="ml-1">
                        {chat.lastMessage.isRead ? (
                          <CheckCheck className="h-3 w-3 text-blue-500" />
                        ) : (
                          <Check className="h-3 w-3 text-gray-400" />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p
                    className={cn(
                      "text-sm truncate",
                      chat.unreadCount > 0
                        ? "text-gray-900 dark:text-white font-medium"
                        : "text-gray-500 dark:text-gray-400"
                    )}
                  >
                    {chat.lastMessage.sender !== "current_user" &&
                      chat.type === "group" && (
                        <span className="text-blue-600 dark:text-blue-400">
                          {chat.lastMessage.sender}:
                        </span>
                      )}
                    {truncateMessage(chat.lastMessage.content)}
                  </p>

                  <div className="flex items-center gap-2 ml-2">
                    {/* Unread count */}
                    {chat.unreadCount > 0 && (
                      <Badge
                        variant="default"
                        className="h-5 min-w-5 px-1.5 text-xs bg-blue-600 hover:bg-blue-700"
                      >
                        {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                      </Badge>
                    )}

                    {/* More options */}
                    {(hoveredChat === chat.id || isActive) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem>
                            <Pin className="h-4 w-4 mr-2" />
                            {chat.isPinned ? "Unpin" : "Pin"} Chat
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            {chat.isMuted ? (
                              <>
                                <Volume2 className="h-4 w-4 mr-2" />
                                Unmute
                              </>
                            ) : (
                              <>
                                <VolumeX className="h-4 w-4 mr-2" />
                                Mute
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Star className="h-4 w-4 mr-2" />
                            Add to Favorites
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Archive className="h-4 w-4 mr-2" />
                            Archive Chat
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 dark:text-red-400">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Chat
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {sortedChats.length === 0 && (
          <div className="text-center py-8">
            <Circle className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              No conversations found
            </p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
