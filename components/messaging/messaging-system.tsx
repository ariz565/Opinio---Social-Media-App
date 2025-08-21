"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  MoreHorizontal,
  Phone,
  Video,
  Info,
  Smile,
  Paperclip,
  Send,
  ArrowLeft,
  Users,
  Settings,
  Archive,
  Star,
  Shield,
  Clock,
  Check,
  CheckCheck,
  Volume2,
  VolumeX,
  Edit,
  Trash2,
  Copy,
  Reply,
  Forward,
  Heart,
  ThumbsUp,
  Laugh,
  Angry,
  Frown,
  Camera,
  Mic,
  Image as ImageIcon,
  FileText,
  MapPin,
  X,
  Circle,
  MessageSquare,
  UserPlus,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCurrentUser } from "@/lib/api";
import ChatList from "./chat-list";
import ChatWindow from "./chat-window";
import ChatInfo from "./chat-info";
import NewChatModal from "./new-chat-modal";

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

const mockChats: Chat[] = [
  {
    id: "1",
    type: "direct",
    name: "Sarah Johnson",
    avatar: "https://github.com/shadcn.png",
    lastMessage: {
      content: "Hey! How's the project coming along?",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      sender: "Sarah Johnson",
      isRead: false,
    },
    participants: ["sarah.johnson", "current_user"],
    isOnline: true,
    unreadCount: 2,
    isPinned: true,
    isMuted: false,
    isArchived: false,
    encryption: true,
  },
  {
    id: "2",
    type: "group",
    name: "Product Team",
    avatar: "https://github.com/shadcn.png",
    lastMessage: {
      content: "Meeting at 3 PM today",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      sender: "Mike Chen",
      isRead: true,
    },
    participants: [
      "mike.chen",
      "sarah.johnson",
      "alex.martinez",
      "current_user",
    ],
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    isArchived: false,
    encryption: true,
  },
  {
    id: "3",
    type: "direct",
    name: "Alex Martinez",
    avatar: "https://github.com/shadcn.png",
    lastMessage: {
      content: "Thanks for the feedback!",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      sender: "current_user",
      isRead: true,
    },
    participants: ["alex.martinez", "current_user"],
    isOnline: false,
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    isArchived: false,
    encryption: true,
  },
];

const mockMessages: Message[] = [
  {
    id: "1",
    chatId: "1",
    sender: "Sarah Johnson",
    content: "Hey! How's the project coming along?",
    type: "text",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    isRead: false,
    reactions: [],
    isForwarded: false,
    isEdited: false,
    deliveryStatus: "delivered",
  },
  {
    id: "2",
    chatId: "1",
    sender: "Sarah Johnson",
    content: "I saw the latest updates and they look amazing! 🚀",
    type: "text",
    timestamp: new Date(Date.now() - 3 * 60 * 1000),
    isRead: false,
    reactions: [{ emoji: "👍", users: ["current_user"] }],
    isForwarded: false,
    isEdited: false,
    deliveryStatus: "delivered",
  },
];

export default function MessagingSystem() {
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>(["Sarah Johnson"]);
  const [selectedView, setSelectedView] = useState<
    "all" | "unread" | "archived"
  >("all");
  const currentUser = getCurrentUser();

  const filteredChats = chats.filter((chat) => {
    const matchesSearch = chat.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesView =
      selectedView === "all"
        ? !chat.isArchived
        : selectedView === "unread"
        ? chat.unreadCount > 0 && !chat.isArchived
        : selectedView === "archived"
        ? chat.isArchived
        : true;

    return matchesSearch && matchesView;
  });

  const activeMessages = messages.filter(
    (msg) => msg.chatId === activeChat?.id
  );

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Messages
              </h1>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowNewChatModal(true)}
                      className="h-8 w-8 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      <Plus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Start new chat</TooltipContent>
                </Tooltip>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 rounded-full"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Chat Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Archive className="h-4 w-4 mr-2" />
                      Archived Chats
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Star className="h-4 w-4 mr-2" />
                      Starred Messages
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex mt-3 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {[
                {
                  key: "all",
                  label: "All",
                  count: chats.filter((c) => !c.isArchived).length,
                },
                {
                  key: "unread",
                  label: "Unread",
                  count: chats.filter((c) => c.unreadCount > 0).length,
                },
                {
                  key: "archived",
                  label: "Archived",
                  count: chats.filter((c) => c.isArchived).length,
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedView(tab.key as any)}
                  className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    selectedView === tab.key
                      ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 h-4 px-1.5 text-xs"
                    >
                      {tab.count}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chat List */}
          <ChatList
            chats={filteredChats}
            activeChat={activeChat}
            onChatSelect={setActiveChat}
            onlineUsers={onlineUsers}
          />
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {activeChat ? (
            <>
              <ChatWindow
                chat={activeChat}
                messages={activeMessages}
                onShowInfo={() => setShowChatInfo(true)}
                isTyping={isTyping}
                currentUser={currentUser}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Choose from your existing conversations or start a new one
                </p>
                <Button
                  onClick={() => setShowNewChatModal(true)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Start New Chat
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Chat Info Sidebar */}
        <AnimatePresence>
          {showChatInfo && activeChat && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700"
            >
              <ChatInfo
                chat={activeChat}
                onClose={() => setShowChatInfo(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* New Chat Modal */}
        <NewChatModal
          isOpen={showNewChatModal}
          onClose={() => setShowNewChatModal(false)}
          onCreateChat={(chatData: any) => {
            // Handle new chat creation
            console.log("Creating new chat:", chatData);
            setShowNewChatModal(false);
          }}
        />
      </div>
    </TooltipProvider>
  );
}
