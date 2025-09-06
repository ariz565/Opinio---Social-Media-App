"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Search,
  Users,
  UserPlus,
  Check,
  ChevronRight,
  Circle,
  MessageSquare,
  Shield,
  AlertTriangle,
  Lock,
  UserCheck,
  UserX,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { messagingApi, useMessagingPermission } from "@/lib/connections-api";

interface User {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  mutualConnections?: number;
  connectionStatus?: "connected" | "pending" | "not_connected" | "blocked";
}

interface ConnectionPermissionCheckProps {
  userId: string;
  user: User;
  onCanMessage: (canMessage: boolean, reason?: string) => void;
}

const ConnectionPermissionCheck = ({
  userId,
  user,
  onCanMessage,
}: ConnectionPermissionCheckProps) => {
  const { canMessage, reason, loading } = useMessagingPermission(userId);

  useEffect(() => {
    if (!loading) {
      onCanMessage(canMessage, reason || undefined);
    }
  }, [canMessage, reason, loading, onCanMessage]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Circle className="w-3 h-3 animate-spin" />
        Checking...
      </div>
    );
  }

  if (!canMessage) {
    return (
      <div className="flex items-center gap-2 text-sm text-destructive">
        <Lock className="w-3 h-3" />
        {reason || "Cannot message this user"}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-green-600">
      <UserCheck className="w-3 h-3" />
      Can message
    </div>
  );
};

interface EnhancedNewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChat: (chatData: any) => void;
}

const mockUsers: User[] = [
  {
    id: "1",
    username: "sarah.johnson",
    name: "Sarah Johnson",
    avatar: "https://github.com/shadcn.png",
    isOnline: true,
    mutualConnections: 12,
    connectionStatus: "connected",
  },
  {
    id: "2",
    username: "mike.chen",
    name: "Mike Chen",
    avatar: "https://github.com/shadcn.png",
    isOnline: false,
    mutualConnections: 8,
    connectionStatus: "pending",
  },
  {
    id: "3",
    username: "alex.martinez",
    name: "Alex Martinez",
    avatar: "https://github.com/shadcn.png",
    isOnline: true,
    mutualConnections: 15,
    connectionStatus: "connected",
  },
  {
    id: "4",
    username: "emma.wilson",
    name: "Emma Wilson",
    avatar: "https://github.com/shadcn.png",
    isOnline: false,
    mutualConnections: 5,
    connectionStatus: "not_connected",
  },
];

const recentChats = [
  {
    id: "1",
    name: "Design Team",
    avatar: "https://github.com/shadcn.png",
    type: "group",
    lastActive: "2 hours ago",
  },
  {
    id: "2",
    name: "John Doe",
    avatar: "https://github.com/shadcn.png",
    type: "direct",
    lastActive: "1 day ago",
  },
];

export default function EnhancedNewChatModal({
  isOpen,
  onClose,
  onCreateChat,
}: EnhancedNewChatModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("connections");
  const [groupName, setGroupName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [messagingPermissions, setMessagingPermissions] = useState<
    Record<string, { canMessage: boolean; reason?: string }>
  >({});

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const connectedUsers = filteredUsers.filter(
    (user) => user.connectionStatus === "connected"
  );
  const pendingUsers = filteredUsers.filter(
    (user) => user.connectionStatus === "pending"
  );
  const suggestedUsers = filteredUsers.filter(
    (user) => user.connectionStatus === "not_connected"
  );

  const handleUserSelect = (userId: string) => {
    // Only allow selection if user can be messaged
    const permission = messagingPermissions[userId];
    if (!permission?.canMessage) return;

    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateChat = async () => {
    if (selectedUsers.length === 0) return;

    setIsCreating(true);
    try {
      const chatData = {
        participant_ids: selectedUsers,
        chat_type: selectedUsers.length === 1 ? "direct" : "group",
        chat_name: selectedUsers.length > 1 ? groupName : undefined,
      };

      const response = await messagingApi.createChat(
        chatData.participant_ids,
        chatData.chat_type,
        chatData.chat_name
      );

      onCreateChat(response);
      onClose();

      // Reset form
      setSelectedUsers([]);
      setGroupName("");
      setSearchQuery("");
    } catch (error) {
      console.error("Failed to create chat:", error);
      // Could show error toast here
    } finally {
      setIsCreating(false);
    }
  };

  const handlePermissionUpdate = (
    userId: string,
    canMessage: boolean,
    reason?: string
  ) => {
    setMessagingPermissions((prev) => ({
      ...prev,
      [userId]: { canMessage, reason },
    }));
  };

  const getConnectionStatusBadge = (status: User["connectionStatus"]) => {
    switch (status) {
      case "connected":
        return (
          <Badge variant="default" className="bg-green-100 text-green-700">
            Connected
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
            Pending
          </Badge>
        );
      case "not_connected":
        return <Badge variant="outline">Not Connected</Badge>;
      case "blocked":
        return <Badge variant="destructive">Blocked</Badge>;
      default:
        return null;
    }
  };

  const UserListItem = ({ user }: { user: User }) => {
    const isSelected = selectedUsers.includes(user.id);
    const permission = messagingPermissions[user.id];
    const canSelect = permission?.canMessage !== false;

    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors",
          isSelected
            ? "bg-primary/10 border-primary/20 border"
            : "hover:bg-accent",
          !canSelect && "opacity-50 cursor-not-allowed"
        )}
        onClick={() => canSelect && handleUserSelect(user.id)}
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            {user.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-sm truncate">{user.name}</h4>
              {getConnectionStatusBadge(user.connectionStatus)}
            </div>
            <p className="text-xs text-muted-foreground truncate">
              @{user.username}
              {user.mutualConnections && (
                <span className="ml-2">
                  {user.mutualConnections} mutual connections
                </span>
              )}
            </p>
            <ConnectionPermissionCheck
              userId={user.id}
              user={user}
              onCanMessage={(canMessage, reason) =>
                handlePermissionUpdate(user.id, canMessage, reason)
              }
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canSelect && (
            <Checkbox
              checked={isSelected}
              onChange={() => handleUserSelect(user.id)}
              className="pointer-events-none"
            />
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Start a new conversation</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-4 flex-1 min-h-0">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Connection Info Alert */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              You can only message users you&apos;re connected with. Send
              connection requests to start conversations.
            </AlertDescription>
          </Alert>

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="bg-accent rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-medium text-sm">
                  Selected ({selectedUsers.length})
                </h4>
                {selectedUsers.length > 1 && (
                  <Badge variant="secondary">Group chat</Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((userId) => {
                  const user = mockUsers.find((u) => u.id === userId);
                  if (!user) return null;
                  return (
                    <div
                      key={userId}
                      className="flex items-center gap-2 bg-background rounded-full px-3 py-1 text-sm"
                    >
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="text-xs">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 hover:bg-transparent"
                        onClick={() => handleUserSelect(userId)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  );
                })}
              </div>
              {selectedUsers.length > 1 && (
                <div className="mt-3">
                  <Input
                    placeholder="Group name (optional)"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="text-sm"
                  />
                </div>
              )}
            </div>
          )}

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col min-h-0"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="connections" className="text-xs">
                Connections ({connectedUsers.length})
              </TabsTrigger>
              <TabsTrigger value="pending" className="text-xs">
                Pending ({pendingUsers.length})
              </TabsTrigger>
              <TabsTrigger value="suggested" className="text-xs">
                Suggested ({suggestedUsers.length})
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 min-h-0 mt-4">
              <TabsContent value="connections" className="mt-0 h-full">
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {connectedUsers.length > 0 ? (
                      connectedUsers.map((user) => (
                        <UserListItem key={user.id} user={user} />
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No connections found</p>
                        <p className="text-sm">
                          Connect with people to start messaging
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="pending" className="mt-0 h-full">
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {pendingUsers.length > 0 ? (
                      pendingUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-accent/50"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium text-sm">
                                {user.name}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                Connection request pending
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            Pending
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No pending requests</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="suggested" className="mt-0 h-full">
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {suggestedUsers.length > 0 ? (
                      suggestedUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-dashed"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium text-sm">
                                {user.name}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {user.mutualConnections} mutual connections
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <UserX className="w-4 h-4" />
                            Not connected
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <UserPlus className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No suggestions available</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </div>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateChat}
              disabled={selectedUsers.length === 0 || isCreating}
              className="min-w-[100px]"
            >
              {isCreating ? (
                <Circle className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Start Chat
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
