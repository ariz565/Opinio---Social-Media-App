"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Users,
  Search,
  X,
  Minimize2,
  Maximize2,
  Plus,
  Settings,
  Phone,
  Video,
  Send,
  Paperclip,
  Smile,
  MoreHorizontal,
  Circle,
  Check,
  CheckCheck,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { isAuthenticated, getCurrentUser } from "@/lib/api";

interface ChatContact {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  isOnline: boolean;
  lastMessage?: string;
  unreadCount: number;
  timestamp?: Date;
}

interface ActiveChat {
  id: string;
  contact: ChatContact;
  messages: Message[];
  isMinimized: boolean;
}

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  isRead: boolean;
}

const mockContacts: ChatContact[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    username: "sarah.johnson",
    avatar: "https://github.com/shadcn.png",
    isOnline: true,
    lastMessage: "Thanks for the collaboration!",
    unreadCount: 2,
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: "2",
    name: "Mike Chen",
    username: "mike.chen",
    avatar: "https://github.com/shadcn.png",
    isOnline: true,
    lastMessage: "Let's discuss the project tomorrow",
    unreadCount: 0,
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: "3",
    name: "Alex Martinez",
    username: "alex.martinez",
    avatar: "https://github.com/shadcn.png",
    isOnline: false,
    lastMessage: "Great work on the presentation!",
    unreadCount: 1,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
];

export default function ChatSidebar() {
  const [isAuth, setIsAuth] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeChats, setActiveChats] = useState<ActiveChat[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const authenticated = isAuthenticated();
    setIsAuth(authenticated);
    if (authenticated) {
      setCurrentUser(getCurrentUser());
    }
  }, []);

  const filteredContacts = mockContacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactClick = (contact: ChatContact) => {
    const existingChat = activeChats.find(
      (chat) => chat.contact.id === contact.id
    );

    if (!existingChat) {
      const newChat: ActiveChat = {
        id: contact.id,
        contact,
        messages: [],
        isMinimized: false,
      };
      setActiveChats((prev) => [...prev, newChat]);
    } else {
      setActiveChats((prev) =>
        prev.map((chat) =>
          chat.id === contact.id ? { ...chat, isMinimized: false } : chat
        )
      );
    }
  };

  const handleCloseChat = (chatId: string) => {
    setActiveChats((prev) => prev.filter((chat) => chat.id !== chatId));
  };

  const handleMinimizeChat = (chatId: string) => {
    setActiveChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, isMinimized: !chat.isMinimized } : chat
      )
    );
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return timestamp.toLocaleDateString();
  };

  if (!isAuth) return null;

  return (
    <>
      {/* Chat Sidebar */}
      <div className="fixed right-4 bottom-0 z-40">
        <Card
          className={cn(
            "transition-all duration-300 ease-in-out shadow-xl border-0",
            isExpanded ? "w-80 h-96" : "w-64 h-14"
          )}
        >
          <CardHeader
            className="p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                  Messaging
                </h3>
                {mockContacts.reduce(
                  (total, contact) => total + contact.unreadCount,
                  0
                ) > 0 && (
                  <Badge className="h-5 px-1.5 text-xs bg-red-500 hover:bg-red-600">
                    {mockContacts.reduce(
                      (total, contact) => total + contact.unreadCount,
                      0
                    )}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Edit3 className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                  }}
                >
                  {isExpanded ? (
                    <Minimize2 className="h-3 w-3" />
                  ) : (
                    <Maximize2 className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CardContent className="p-0">
                  {/* Search */}
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-3 w-3 text-gray-400" />
                      <Input
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 h-8 text-sm bg-gray-50 dark:bg-gray-700 border-0"
                      />
                    </div>
                  </div>

                  {/* Contacts List */}
                  <ScrollArea className="h-80">
                    <div className="p-2">
                      {filteredContacts.map((contact) => (
                        <div
                          key={contact.id}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                          onClick={() => handleContactClick(contact)}
                        >
                          <div className="relative">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={contact.avatar}
                                alt={contact.name}
                              />
                              <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                                {contact.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            {contact.isOnline && (
                              <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-green-500 rounded-full border border-white dark:border-gray-800" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                                {contact.name}
                              </p>
                              {contact.timestamp && (
                                <span className="text-xs text-gray-500">
                                  {formatTime(contact.timestamp)}
                                </span>
                              )}
                            </div>
                            {contact.lastMessage && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {contact.lastMessage}
                              </p>
                            )}
                          </div>

                          {contact.unreadCount > 0 && (
                            <Badge className="h-4 px-1.5 text-xs bg-blue-600">
                              {contact.unreadCount}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>

      {/* Active Chat Windows */}
      <div className="fixed bottom-0 right-0 z-50 flex items-end gap-4 pr-4 pb-4">
        {activeChats.map((chat, index) => (
          <ChatWindow
            key={chat.id}
            chat={chat}
            onClose={() => handleCloseChat(chat.id)}
            onMinimize={() => handleMinimizeChat(chat.id)}
            style={{ marginRight: index === 0 ? "320px" : "0" }}
          />
        ))}
      </div>
    </>
  );
}

// Individual Chat Window Component
function ChatWindow({
  chat,
  onClose,
  onMinimize,
  style,
}: {
  chat: ActiveChat;
  onClose: () => void;
  onMinimize: () => void;
  style?: React.CSSProperties;
}) {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (!message.trim()) return;
    // Handle sending message
    setMessage("");
  };

  return (
    <Card
      className={cn(
        "w-80 transition-all duration-300 shadow-2xl border-0",
        chat.isMinimized ? "h-12" : "h-96"
      )}
      style={style}
    >
      {/* Chat Header */}
      <CardHeader className="p-3 bg-blue-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={chat.contact.avatar} alt={chat.contact.name} />
              <AvatarFallback className="text-xs bg-blue-500 text-white">
                {chat.contact.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-sm font-medium">{chat.contact.name}</h4>
              <p className="text-xs opacity-90">
                {chat.contact.isOnline ? "Active now" : "Offline"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-white hover:bg-blue-700"
            >
              <Phone className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-white hover:bg-blue-700"
            >
              <Video className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-white hover:bg-blue-700"
              onClick={onMinimize}
            >
              <Minimize2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-white hover:bg-blue-700"
              onClick={onClose}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <AnimatePresence>
        {!chat.isMinimized && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col"
          >
            {/* Messages Area */}
            <ScrollArea className="flex-1 h-80 p-3">
              <div className="space-y-3">
                {chat.messages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      Start a conversation
                    </p>
                  </div>
                ) : (
                  chat.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex",
                        msg.sender === "me" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-xs px-3 py-2 rounded-lg text-sm",
                          msg.sender === "me"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                        )}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Paperclip className="h-3 w-3" />
                </Button>
                <div className="flex-1">
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="h-8 text-sm border-0 bg-gray-50 dark:bg-gray-700"
                  />
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Smile className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  className="h-8 px-3 bg-blue-600 hover:bg-blue-700"
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                >
                  <Send className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
