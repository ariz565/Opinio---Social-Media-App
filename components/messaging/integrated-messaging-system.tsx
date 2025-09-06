"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  MessageSquare,
  Shield,
  Settings,
  Search,
  Plus,
  UserCheck,
  Clock,
  UserX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { connectionsApi, messagingApi } from "@/lib/connections-api";
import EnhancedNewChatModal from "./enhanced-new-chat-modal";
import ConnectionAwareChatWindow from "./connection-aware-chat-window";
import ChatList from "./chat-list";
import ChatInfo from "./chat-info";
import { ConnectionsManager } from "@/components/connections";

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
  participants: string[]; // Keep compatible with existing ChatList
  participantDetails?: {
    id: string;
    name: string;
    avatar?: string;
    isOnline?: boolean;
  }[]; // Extended info
  isOnline?: boolean;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  isArchived: boolean;
  encryption: boolean;
  connectionStatus?: "connected" | "pending" | "not_connected" | "blocked";
}

interface DetailedChat {
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
  participants: {
    id: string;
    name: string;
    avatar?: string;
    isOnline?: boolean;
  }[];
  isOnline?: boolean;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  isArchived: boolean;
  encryption: boolean;
  connectionStatus?: "connected" | "pending" | "not_connected" | "blocked";
}

interface Connection {
  id: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    isOnline?: boolean;
  };
  status: "connected" | "pending" | "received";
  createdAt: Date;
  message?: string;
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
    participantDetails: [
      {
        id: "sarah.johnson",
        name: "Sarah Johnson",
        avatar: "https://github.com/shadcn.png",
        isOnline: true,
      },
      { id: "current_user", name: "You", isOnline: true },
    ],
    isOnline: true,
    unreadCount: 2,
    isPinned: true,
    isMuted: false,
    isArchived: false,
    encryption: true,
    connectionStatus: "connected",
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
    participantDetails: [
      {
        id: "mike.chen",
        name: "Mike Chen",
        avatar: "https://github.com/shadcn.png",
        isOnline: false,
      },
      {
        id: "sarah.johnson",
        name: "Sarah Johnson",
        avatar: "https://github.com/shadcn.png",
        isOnline: true,
      },
      {
        id: "alex.martinez",
        name: "Alex Martinez",
        avatar: "https://github.com/shadcn.png",
        isOnline: true,
      },
      { id: "current_user", name: "You", isOnline: true },
    ],
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    isArchived: false,
    encryption: true,
  },
];

export default function IntegratedMessagingSystem() {
  const [activeView, setActiveView] = useState<"chats" | "connections">(
    "chats"
  );
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [stats, setStats] = useState({
    totalConnections: 0,
    totalChats: 0,
    unreadMessages: 0,
    pendingRequests: 0,
  });
  const [loading, setLoading] = useState(false);

  const currentUserId = "current_user";

  // Convert Chat to DetailedChat for ConnectionAwareChatWindow
  const convertToDetailedChat = (chat: Chat): DetailedChat => ({
    ...chat,
    participants:
      chat.participantDetails ||
      chat.participants.map((id) => ({
        id,
        name: id === currentUserId ? "You" : id,
        avatar: undefined,
        isOnline: false,
      })),
  });

  // Convert DetailedChat back to Chat
  const convertFromDetailedChat = (detailedChat: DetailedChat): Chat => ({
    ...detailedChat,
    participants: detailedChat.participants.map((p) => p.id),
    participantDetails: detailedChat.participants,
  });

  // Load initial data
  useEffect(() => {
    loadChats();
    loadConnections();
    loadStats();
  }, []);

  const loadChats = async () => {
    try {
      setLoading(true);
      const response = await messagingApi.getChats();
      // Transform API response to match Chat interface
      const transformedChats =
        response.chats?.map((chat: any) => ({
          ...chat,
          lastMessage: {
            ...chat.last_message,
            timestamp: new Date(chat.last_message.timestamp),
          },
          participants: chat.participants || [],
          connectionStatus: chat.connection_status || "connected",
        })) || [];
      setChats(transformedChats);
    } catch (error) {
      console.error("Failed to load chats:", error);
      // Use mock data on error
      setChats(mockChats);
    } finally {
      setLoading(false);
    }
  };

  const loadConnections = async () => {
    try {
      const response = await connectionsApi.getConnections();
      const transformedConnections =
        response.connections?.map((conn: any) => ({
          id: conn.id,
          user: conn.user,
          status: conn.status,
          createdAt: new Date(conn.created_at),
          message: conn.message,
        })) || [];
      setConnections(transformedConnections);
    } catch (error) {
      console.error("Failed to load connections:", error);
    }
  };

  const loadStats = async () => {
    try {
      const [connectionStats, chatsResponse] = await Promise.all([
        connectionsApi.getStats(),
        messagingApi.getChats(),
      ]);

      const unreadCount =
        chatsResponse.chats?.reduce(
          (total: number, chat: any) => total + (chat.unread_count || 0),
          0
        ) || 0;

      setStats({
        totalConnections: connectionStats.total_connections || 0,
        totalChats: chatsResponse.chats?.length || 0,
        unreadMessages: unreadCount,
        pendingRequests: connectionStats.pending_requests || 0,
      });
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const handleCreateChat = async (chatData: any) => {
    try {
      const newChat = await messagingApi.createChat(
        chatData.participant_ids,
        chatData.chat_type,
        chatData.chat_name
      );

      // Transform and add to local state
      const transformedChat: Chat = {
        id: newChat.id,
        type: newChat.chat_type,
        name: newChat.chat_name || newChat.participants[0]?.name || "New Chat",
        avatar: newChat.participants[0]?.avatar,
        lastMessage: {
          content: "Chat created",
          timestamp: new Date(),
          sender: "System",
          isRead: true,
        },
        participants: newChat.participants.map((p: any) => ({
          id: p.id,
          name: p.name,
          avatar: p.avatar,
          isOnline: p.is_online,
        })),
        unreadCount: 0,
        isPinned: false,
        isMuted: false,
        isArchived: false,
        encryption: true,
        connectionStatus: "connected",
      };

      setChats((prev) => [transformedChat, ...prev]);
      setSelectedChat(transformedChat);
      setShowNewChatModal(false);
    } catch (error) {
      console.error("Failed to create chat:", error);
    }
  };

  const filteredChats = chats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const connectedChats = filteredChats.filter(
    (chat) => chat.connectionStatus === "connected" || chat.type === "group"
  );

  const pendingChats = filteredChats.filter(
    (chat) => chat.connectionStatus === "pending"
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">Messages</h1>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNewChatModal(true)}
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-accent rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Chats</span>
              </div>
              <div className="text-2xl font-bold">{stats.totalChats}</div>
              {stats.unreadMessages > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {stats.unreadMessages} unread
                </Badge>
              )}
            </div>
            <div className="bg-accent rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">Connections</span>
              </div>
              <div className="text-2xl font-bold">{stats.totalConnections}</div>
              {stats.pendingRequests > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {stats.pendingRequests} pending
                </Badge>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs
          value={activeView}
          onValueChange={(value: any) => setActiveView(value)}
          className="flex-1 flex flex-col"
        >
          <div className="px-4 pt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chats" className="text-sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                Chats
              </TabsTrigger>
              <TabsTrigger value="connections" className="text-sm">
                <Users className="w-4 h-4 mr-2" />
                Connections
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="chats" className="mt-4 h-full">
              <div className="px-4 mb-4">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    You can only message connected users. Connect with people to
                    start conversations.
                  </AlertDescription>
                </Alert>
              </div>

              {/* Connection-based chat organization */}
              <div className="space-y-4">
                {/* Connected Chats */}
                {connectedChats.length > 0 && (
                  <div className="px-4">
                    <div className="flex items-center gap-2 mb-3">
                      <UserCheck className="w-4 h-4 text-green-600" />
                      <h3 className="font-medium text-sm">
                        Connected ({connectedChats.length})
                      </h3>
                    </div>
                    <ChatList
                      chats={connectedChats}
                      activeChat={selectedChat}
                      onChatSelect={setSelectedChat}
                      onlineUsers={[]}
                    />
                  </div>
                )}

                {/* Pending Connection Chats */}
                {pendingChats.length > 0 && (
                  <div className="px-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4 text-yellow-600" />
                      <h3 className="font-medium text-sm">
                        Pending Connections ({pendingChats.length})
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {pendingChats.map((chat) => (
                        <div
                          key={chat.id}
                          className="p-3 rounded-lg bg-muted/50 border border-dashed"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                              <span className="text-sm font-medium">
                                {chat.name}
                              </span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              Connection Pending
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Accept connection request to start messaging
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No connected chats */}
                {connectedChats.length === 0 && pendingChats.length === 0 && (
                  <div className="text-center py-12 px-4">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      No conversations yet
                    </h3>
                    <p className="text-muted-foreground mb-4 text-sm">
                      Connect with people to start messaging them
                    </p>
                    <Button onClick={() => setActiveView("connections")}>
                      <Users className="w-4 h-4 mr-2" />
                      View Connections
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="connections" className="mt-4 h-full">
              <div className="h-full overflow-hidden">
                <ConnectionsManager />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Chat Window */}
        <div className="flex-1">
          <ConnectionAwareChatWindow
            chat={selectedChat ? convertToDetailedChat(selectedChat) : null}
            currentUserId={currentUserId}
            onBack={() => setSelectedChat(null)}
            onShowInfo={() => setShowChatInfo(true)}
          />
        </div>

        {/* Chat Info Sidebar */}
        <AnimatePresence>
          {showChatInfo && selectedChat && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-l bg-background overflow-hidden"
            >
              <ChatInfo
                chat={selectedChat}
                onClose={() => setShowChatInfo(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* New Chat Modal */}
      <EnhancedNewChatModal
        isOpen={showNewChatModal}
        onClose={() => setShowNewChatModal(false)}
        onCreateChat={handleCreateChat}
      />
    </div>
  );
}
