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
  Settings,
  Archive,
  Star,
  Shield,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
];

export default function ProfessionalMessagingSystem() {
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [selectedView, setSelectedView] = useState<
    "all" | "unread" | "archived"
  >("all");
  const [onlineUsers] = useState<string[]>(["Sarah Johnson"]);
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
      <div className="flex h-screen bg-white dark:bg-gray-900 pt-16">
        {/* Professional Sidebar */}
        <Card className="w-80 border-0 border-r border-gray-200 dark:border-gray-700 rounded-none shadow-sm">
          <CardHeader className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                Messages
              </h1>
              <div className="flex items-center gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowNewChatModal(true)}
                      className="h-9 w-9 rounded-xl border-gray-300 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Start new conversation</TooltipContent>
                </Tooltip>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 w-9 rounded-xl border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuLabel className="font-medium">
                      Chat Options
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-3">
                      <Settings className="h-4 w-4" />
                      Settings & Privacy
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-3">
                      <Archive className="h-4 w-4" />
                      Archived Chats
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-3">
                      <Star className="h-4 w-4" />
                      Starred Messages
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Professional Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-xl text-sm"
              />
            </div>

            {/* Professional Filter Tabs */}
            <div className="flex mt-5 bg-gray-50 dark:bg-gray-800 rounded-xl p-1">
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
                  className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    selectedView === tab.key
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-2 h-5 px-2 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    >
                      {tab.count}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <ChatList
              chats={filteredChats}
              activeChat={activeChat}
              onChatSelect={setActiveChat}
              onlineUsers={onlineUsers}
            />
          </CardContent>
        </Card>

        {/* Professional Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
          {activeChat ? (
            <ChatWindow
              chat={activeChat}
              messages={activeMessages}
              onShowInfo={() => setShowChatInfo(true)}
              isTyping={false}
              currentUser={currentUser}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <MessageSquare className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Select a conversation
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                  Choose from your existing conversations, start a new one, or
                  manage your messaging preferences.
                </p>
                <Button
                  onClick={() => setShowNewChatModal(true)}
                  className="gap-2 bg-blue-600 hover:bg-blue-700 rounded-xl px-6 py-2.5"
                >
                  <Plus className="h-4 w-4" />
                  Start New Conversation
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Professional Chat Info Sidebar */}
        <AnimatePresence>
          {showChatInfo && activeChat && (
            <motion.div
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-80 border-l border-gray-200 dark:border-gray-700"
            >
              <ChatInfo
                chat={activeChat}
                onClose={() => setShowChatInfo(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Professional New Chat Modal */}
        <NewChatModal
          isOpen={showNewChatModal}
          onClose={() => setShowNewChatModal(false)}
          onCreateChat={(chatData: any) => {
            console.log("Creating new chat:", chatData);
            setShowNewChatModal(false);
          }}
        />
      </div>
    </TooltipProvider>
  );
}
