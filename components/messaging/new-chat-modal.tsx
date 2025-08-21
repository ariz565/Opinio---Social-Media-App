"use client";

import { useState } from "react";
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
import { cn } from "@/lib/utils";

interface User {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  mutualConnections?: number;
}

interface NewChatModalProps {
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
  },
  {
    id: "2",
    username: "mike.chen",
    name: "Mike Chen",
    avatar: "https://github.com/shadcn.png",
    isOnline: false,
    mutualConnections: 8,
  },
  {
    id: "3",
    username: "alex.martinez",
    name: "Alex Martinez",
    avatar: "https://github.com/shadcn.png",
    isOnline: true,
    mutualConnections: 15,
  },
  {
    id: "4",
    username: "emma.wilson",
    name: "Emma Wilson",
    avatar: "https://github.com/shadcn.png",
    isOnline: false,
    mutualConnections: 5,
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

export default function NewChatModal({
  isOpen,
  onClose,
  onCreateChat,
}: NewChatModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("contacts");
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [groupName, setGroupName] = useState("");

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserSelect = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleCreateDirectMessage = (userId: string) => {
    const user = mockUsers.find((u) => u.id === userId);
    if (user) {
      onCreateChat({
        type: "direct",
        participantId: userId,
        participantName: user.name,
      });
    }
  };

  const handleCreateGroupChat = () => {
    if (selectedUsers.length < 2) return;

    onCreateChat({
      type: "group",
      name: groupName || `Group with ${selectedUsers.length} members`,
      participants: selectedUsers,
    });
  };

  const selectedUsersData = selectedUsers
    .map((id) => mockUsers.find((user) => user.id === id))
    .filter(Boolean);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-[600px] p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold">
                {isCreatingGroup ? "Create Group" : "New Message"}
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          {/* Search */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search people..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Selected users (when creating group) */}
          <AnimatePresence>
            {selectedUsers.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="p-4 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    {selectedUsers.length} selected
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedUsersData.map(
                    (user) =>
                      user && (
                        <div
                          key={user.id}
                          className="flex items-center gap-2 bg-white dark:bg-gray-700 rounded-full px-3 py-1 border"
                        >
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="text-xs">
                              {user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium">
                            {user.name}
                          </span>
                          <button
                            onClick={() => handleUserSelect(user.id)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            title="Remove user"
                            aria-label="Remove user"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )
                  )}
                </div>

                {selectedUsers.length >= 2 && (
                  <div className="space-y-3">
                    {!isCreatingGroup ? (
                      <Button
                        onClick={() => setIsCreatingGroup(true)}
                        className="w-full gap-2"
                        variant="outline"
                      >
                        <Users className="h-4 w-4" />
                        Create Group Chat
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <Input
                          placeholder="Group name (optional)"
                          value={groupName}
                          onChange={(e) => setGroupName(e.target.value)}
                          className="bg-white dark:bg-gray-700"
                        />
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsCreatingGroup(false);
                              setGroupName("");
                            }}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleCreateGroupChat}
                            className="flex-1 gap-2"
                          >
                            <MessageSquare className="h-4 w-4" />
                            Create
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content */}
          <div className="flex-1">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="h-full flex flex-col"
            >
              <TabsList className="grid w-full grid-cols-2 mx-4 mt-4">
                <TabsTrigger value="contacts">Contacts</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
              </TabsList>

              <TabsContent value="contacts" className="flex-1 mt-0">
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-2">
                    {filteredUsers.map((user) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50",
                          selectedUsers.includes(user.id) &&
                            "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700"
                        )}
                        onClick={() => {
                          if (selectedUsers.length > 0 || isCreatingGroup) {
                            handleUserSelect(user.id);
                          } else {
                            handleCreateDirectMessage(user.id);
                          }
                        }}
                      >
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                              {user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {user.isOnline && (
                            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            @{user.username}
                            {user.mutualConnections && (
                              <span className="ml-2">
                                • {user.mutualConnections} mutual
                              </span>
                            )}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {user.isOnline && (
                            <Badge
                              variant="outline"
                              className="text-green-600 border-green-600"
                            >
                              Online
                            </Badge>
                          )}

                          {selectedUsers.length > 0 || isCreatingGroup ? (
                            <Checkbox
                              checked={selectedUsers.includes(user.id)}
                              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                            />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </motion.div>
                    ))}

                    {filteredUsers.length === 0 && (
                      <div className="text-center py-8">
                        <Circle className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">
                          No users found
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="recent" className="flex-1 mt-0">
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-2">
                    {recentChats.map((chat) => (
                      <div
                        key={chat.id}
                        className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        onClick={() =>
                          onCreateChat({ type: "existing", chatId: chat.id })
                        }
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={chat.avatar} alt={chat.name} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {chat.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900 dark:text-white truncate">
                              {chat.name}
                            </p>
                            {chat.type === "group" && (
                              <Users className="h-3 w-3 text-gray-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {chat.lastActive}
                          </p>
                        </div>

                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    ))}

                    {recentChats.length === 0 && (
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">
                          No recent chats
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Shield className="h-3 w-3" />
              <span>All messages are end-to-end encrypted</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
