"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  X,
  Settings,
  Users,
  Star,
  Volume2,
  VolumeX,
  Shield,
  Trash2,
  Archive,
  Bell,
  BellOff,
  Image as ImageIcon,
  FileText,
  Video,
  Link as LinkIcon,
  Calendar,
  Clock,
  Search,
  Download,
  Copy,
  Share2,
  Edit,
  UserPlus,
  UserMinus,
  Crown,
  Timer,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Chat {
  id: string;
  type: "direct" | "group";
  name: string;
  avatar?: string;
  participants: string[];
  encryption: boolean;
}

interface ChatInfoProps {
  chat: Chat;
  onClose: () => void;
}

const mockMedia = [
  {
    id: "1",
    type: "image",
    url: "https://picsum.photos/200/200?random=1",
    timestamp: new Date(),
  },
  {
    id: "2",
    type: "image",
    url: "https://picsum.photos/200/200?random=2",
    timestamp: new Date(),
  },
  {
    id: "3",
    type: "video",
    url: "https://picsum.photos/200/200?random=3",
    timestamp: new Date(),
  },
  {
    id: "4",
    type: "image",
    url: "https://picsum.photos/200/200?random=4",
    timestamp: new Date(),
  },
];

const mockFiles = [
  {
    id: "1",
    name: "project-proposal.pdf",
    size: "2.4 MB",
    timestamp: new Date(),
  },
  {
    id: "2",
    name: "design-assets.zip",
    size: "15.8 MB",
    timestamp: new Date(),
  },
  {
    id: "3",
    name: "meeting-notes.docx",
    size: "1.2 MB",
    timestamp: new Date(),
  },
];

const mockParticipants = [
  {
    username: "sarah.johnson",
    name: "Sarah Johnson",
    avatar: "https://github.com/shadcn.png",
    isOnline: true,
    role: "admin",
  },
  {
    username: "mike.chen",
    name: "Mike Chen",
    avatar: "https://github.com/shadcn.png",
    isOnline: false,
    role: "member",
  },
  {
    username: "alex.martinez",
    name: "Alex Martinez",
    avatar: "https://github.com/shadcn.png",
    isOnline: true,
    role: "member",
  },
];

export default function ChatInfo({ chat, onClose }: ChatInfoProps) {
  const [notifications, setNotifications] = useState(true);
  const [disappearingMessages, setDisappearingMessages] = useState(false);
  const [selectedTab, setSelectedTab] = useState("media");

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Chat Info
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 rounded-full"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Chat Header */}
          <div className="text-center">
            <Avatar className="h-20 w-20 mx-auto mb-3">
              <AvatarImage src={chat.avatar} alt={chat.name} />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {chat.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
              {chat.name}
            </h3>

            <div className="flex items-center justify-center gap-2 mb-3">
              {chat.type === "group" && (
                <Badge variant="secondary" className="gap-1">
                  <Users className="h-3 w-3" />
                  {chat.participants.length} members
                </Badge>
              )}

              {chat.encryption && (
                <Badge
                  variant="outline"
                  className="gap-1 text-green-600 border-green-600"
                >
                  <Shield className="h-3 w-3" />
                  Encrypted
                </Badge>
              )}
            </div>

            <div className="flex justify-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Bell className="h-4 w-4" />
                Call
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Video className="h-4 w-4" />
                Video
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Search className="h-4 w-4" />
                Search
              </Button>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Chat Settings
            </h4>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Notifications
                  </span>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Timer className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Disappearing Messages
                  </span>
                </div>
                <Switch
                  checked={disappearingMessages}
                  onCheckedChange={setDisappearingMessages}
                />
              </div>

              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-left"
              >
                <Star className="h-4 w-4" />
                Starred Messages
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-left"
              >
                <Archive className="h-4 w-4" />
                Archive Chat
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-left"
              >
                <VolumeX className="h-4 w-4" />
                Mute Chat
              </Button>
            </div>
          </div>

          {/* Participants (for group chats) */}
          {chat.type === "group" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Participants ({mockParticipants.length})
                </h4>
                <Button variant="ghost" size="sm" className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add
                </Button>
              </div>

              <div className="space-y-3">
                {mockParticipants.map((participant) => (
                  <div
                    key={participant.username}
                    className="flex items-center gap-3"
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={participant.avatar}
                          alt={participant.name}
                        />
                        <AvatarFallback>
                          {participant.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {participant.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {participant.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {participant.isOnline ? "Online" : "Last seen recently"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {participant.role === "admin" && (
                        <Crown className="h-4 w-4 text-yellow-500" />
                      )}
                      <Button variant="ghost" size="sm" className="h-8 w-8">
                        <UserMinus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shared Content */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Shared Content
            </h4>

            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="media" className="gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Media
                </TabsTrigger>
                <TabsTrigger value="files" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Files
                </TabsTrigger>
                <TabsTrigger value="links" className="gap-2">
                  <LinkIcon className="h-4 w-4" />
                  Links
                </TabsTrigger>
              </TabsList>

              <TabsContent value="media" className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  {mockMedia.map((item) => (
                    <div
                      key={item.id}
                      className="relative aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden group cursor-pointer"
                    >
                      <Image
                        src={item.url}
                        alt="Shared media"
                        fill
                        className="object-cover"
                      />
                      {item.type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-black/50 rounded-full p-2">
                            <Video className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </div>
                  ))}
                </div>
                {mockMedia.length > 6 && (
                  <Button variant="ghost" className="w-full">
                    View All Media
                  </Button>
                )}
              </TabsContent>

              <TabsContent value="files" className="space-y-3">
                {mockFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                  >
                    <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {file.size} • {file.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="links" className="space-y-3">
                <div className="text-center py-8">
                  <LinkIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No links shared yet
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Privacy & Security */}
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between">
                <div className="flex items-center gap-3">
                  <Lock className="h-4 w-4" />
                  Privacy & Security
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 mt-3">
              <div className="pl-7 space-y-3">
                <Button variant="ghost" className="w-full justify-start">
                  Encryption Keys
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Safety Number
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Block Contact
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Danger Zone */}
          <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              <Archive className="h-4 w-4" />
              Archive Chat
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              <Trash2 className="h-4 w-4" />
              Delete Chat
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
