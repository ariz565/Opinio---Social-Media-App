"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Video,
  Info,
  Smile,
  Paperclip,
  Send,
  MoreHorizontal,
  ArrowLeft,
  Shield,
  Lock,
  UserX,
  AlertTriangle,
  Clock,
  Check,
  CheckCheck,
  Heart,
  ThumbsUp,
  Laugh,
  Angry,
  Frown,
  Edit,
  Trash2,
  Copy,
  Reply,
  Forward,
  Camera,
  Mic,
  Image as ImageIcon,
  FileText,
  MapPin,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { messagingApi, useMessagingPermission } from "@/lib/connections-api";
import { useWebSocketContext } from "@/components/providers/websocket-provider";
import { useToast } from "@/hooks/use-toast";

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

interface Chat {
  id: string;
  type: "direct" | "group";
  name: string;
  avatar?: string;
  participants: {
    id: string;
    name: string;
    avatar?: string;
    isOnline?: boolean;
  }[];
  isOnline?: boolean;
  encryption: boolean;
  connectionStatus?: "connected" | "pending" | "not_connected" | "blocked";
}

interface ConnectionAwareChatWindowProps {
  chat: Chat | null;
  currentUserId: string;
  onBack?: () => void;
  onShowInfo?: () => void;
}

const mockMessages: Message[] = [
  {
    id: "1",
    chatId: "1",
    sender: "Sarah Johnson",
    content: "Hey! How's the project coming along?",
    type: "text",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    isRead: true,
    reactions: [
      { emoji: "👍", users: ["current_user"] },
      { emoji: "❤️", users: ["mike.chen"] },
    ],
    replyTo: undefined,
    isForwarded: false,
    isEdited: false,
    deliveryStatus: "read",
  },
  {
    id: "2",
    chatId: "1",
    sender: "current_user",
    content: "Going great! Just finished the UI mockups. Want to take a look?",
    type: "text",
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    isRead: true,
    reactions: [],
    replyTo: "1",
    isForwarded: false,
    isEdited: false,
    deliveryStatus: "read",
  },
];

const ConnectionStatusAlert = ({ chat }: { chat: Chat }) => {
  // Always call the hook, but with a fallback userId
  const otherParticipant = chat?.participants.find(
    (p) => p.id !== "current_user"
  );
  const userId = otherParticipant?.id || "";

  const { canMessage, reason, loading } = useMessagingPermission(userId);

  // Don't render anything if it's not a direct chat or no other participant
  if (!chat || chat.type === "group" || !otherParticipant) return null;

  if (loading) {
    return (
      <Alert className="mb-4">
        <Clock className="h-4 w-4" />
        <AlertDescription>Checking messaging permissions...</AlertDescription>
      </Alert>
    );
  }

  if (!canMessage) {
    return (
      <Alert variant="destructive" className="mb-4">
        <Lock className="h-4 w-4" />
        <AlertDescription>
          {reason ||
            "You cannot message this user. You need to be connected to send messages."}
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default function ConnectionAwareChatWindow({
  chat,
  currentUserId,
  onBack,
  onShowInfo,
}: ConnectionAwareChatWindowProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [canSendMessage, setCanSendMessage] = useState(true);
  const [messagingReason, setMessagingReason] = useState<string | null>(null);

  // WebSocket integration
  const {
    lastMessage,
    sendMessage: sendWebSocketMessage,
    isConnected,
  } = useWebSocketContext();
  const { toast } = useToast();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check messaging permissions for direct chats
  useEffect(() => {
    if (chat?.type === "direct") {
      const otherParticipant = chat.participants.find(
        (p) => p.id !== currentUserId
      );
      if (otherParticipant) {
        messagingApi
          .canMessageUser(otherParticipant.id)
          .then((result) => {
            setCanSendMessage(result.can_message);
            setMessagingReason(result.reason);
          })
          .catch(() => {
            setCanSendMessage(false);
            setMessagingReason("Unable to check messaging permission");
          });
      }
    } else {
      setCanSendMessage(true);
      setMessagingReason(null);
    }
  }, [chat, currentUserId]);

  // WebSocket message listener
  useEffect(() => {
    if (lastMessage && chat) {
      if (
        lastMessage.type === "message" &&
        lastMessage.data.chatId === chat.id
      ) {
        const newMessage: Message = {
          id: lastMessage.data.messageId,
          chatId: lastMessage.data.chatId,
          sender: lastMessage.data.senderId,
          content: lastMessage.data.content,
          type: lastMessage.data.messageType || "text",
          timestamp: new Date(lastMessage.data.timestamp),
          isRead: false,
          reactions: [],
          isForwarded: false,
          isEdited: false,
          deliveryStatus: "delivered",
        };

        setMessages((prev) => {
          // Avoid duplicates
          if (prev.find((msg) => msg.id === newMessage.id)) {
            return prev;
          }
          return [...prev, newMessage];
        });

        // Show notification if the message is not from current user
        if (lastMessage.data.senderId !== currentUserId) {
          toast({
            title: "New Message",
            description: `${lastMessage.data.senderName}: ${lastMessage.data.content}`,
          });
        }
      }
    }
  }, [lastMessage, chat, currentUserId, toast]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !chat || !canSendMessage) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      chatId: chat.id,
      sender: currentUserId,
      content: message.trim(),
      type: "text",
      timestamp: new Date(),
      isRead: false,
      reactions: [],
      replyTo: replyTo?.id,
      isForwarded: false,
      isEdited: false,
      deliveryStatus: "sending",
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
    setReplyTo(null);

    try {
      const response = await messagingApi.sendMessage(
        chat.id,
        newMessage.content,
        newMessage.type,
        newMessage.replyTo
      );

      // Update message with response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id
            ? { ...msg, id: response.id, deliveryStatus: "sent" }
            : msg
        )
      );
    } catch (error) {
      console.error("Failed to send message:", error);
      // Update message status to failed
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, deliveryStatus: "sending" } : msg
        )
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions.find((r) => r.emoji === emoji);
          if (existingReaction) {
            if (existingReaction.users.includes(currentUserId)) {
              // Remove reaction
              return {
                ...msg,
                reactions: msg.reactions
                  .map((r) =>
                    r.emoji === emoji
                      ? {
                          ...r,
                          users: r.users.filter((u) => u !== currentUserId),
                        }
                      : r
                  )
                  .filter((r) => r.users.length > 0),
              };
            } else {
              // Add reaction
              return {
                ...msg,
                reactions: msg.reactions.map((r) =>
                  r.emoji === emoji
                    ? { ...r, users: [...r.users, currentUserId] }
                    : r
                ),
              };
            }
          } else {
            // New reaction
            return {
              ...msg,
              reactions: [...msg.reactions, { emoji, users: [currentUserId] }],
            };
          }
        }
        return msg;
      })
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getDeliveryStatusIcon = (status: Message["deliveryStatus"]) => {
    switch (status) {
      case "sending":
        return <Clock className="w-3 h-3 text-muted-foreground" />;
      case "sent":
        return <Check className="w-3 h-3 text-muted-foreground" />;
      case "delivered":
        return <CheckCheck className="w-3 h-3 text-muted-foreground" />;
      case "read":
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
    }
  };

  if (!chat) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/20">
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
          <p className="text-muted-foreground">
            Choose from your existing conversations or start a new one
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}

          <div className="relative">
            <Avatar className="w-10 h-10">
              <AvatarImage src={chat.avatar} alt={chat.name} />
              <AvatarFallback>
                {chat.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            {chat.isOnline && chat.type === "direct" && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium truncate">{chat.name}</h3>
              {chat.encryption && (
                <Tooltip>
                  <TooltipTrigger>
                    <Shield className="w-4 h-4 text-green-600" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>End-to-end encrypted</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {chat.connectionStatus && (
                <Badge variant="outline" className="text-xs">
                  {chat.connectionStatus}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {chat.type === "group"
                ? `${chat.participants.length} members`
                : isTyping
                ? "Typing..."
                : chat.isOnline
                ? "Online"
                : "Last seen recently"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Phone className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Voice call</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Video className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Video call</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={onShowInfo}>
                  <Info className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Chat info</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Connection Status Alert */}
      <ConnectionStatusAlert chat={chat} />

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages
            .filter((msg) => msg.chatId === chat.id)
            .map((msg, index) => {
              const isOwn = msg.sender === currentUserId;
              const showAvatar =
                !isOwn &&
                (index === 0 ||
                  messages[index - 1]?.sender !== msg.sender ||
                  new Date(msg.timestamp).getTime() -
                    new Date(messages[index - 1]?.timestamp).getTime() >
                    5 * 60 * 1000);

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-3 group",
                    isOwn ? "justify-end" : "justify-start"
                  )}
                >
                  {!isOwn && (
                    <div className="w-8">
                      {showAvatar ? (
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={chat.avatar} alt={msg.sender} />
                          <AvatarFallback className="text-xs">
                            {msg.sender
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      ) : null}
                    </div>
                  )}

                  <div
                    className={cn(
                      "max-w-[70%] space-y-1",
                      isOwn ? "items-end" : "items-start"
                    )}
                  >
                    {msg.replyTo && (
                      <div className="text-xs text-muted-foreground bg-muted p-2 rounded border-l-2 border-primary">
                        Replying to:{" "}
                        {messages.find((m) => m.id === msg.replyTo)?.content}
                      </div>
                    )}

                    <div
                      className={cn(
                        "relative px-4 py-2 rounded-2xl max-w-full break-words",
                        isOwn
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted",
                        selectedMessages.includes(msg.id) &&
                          "ring-2 ring-primary"
                      )}
                    >
                      {editingMessage === msg.id ? (
                        <div className="space-y-2">
                          <Input
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                // Handle edit save
                                setEditingMessage(null);
                                setEditContent("");
                              } else if (e.key === "Escape") {
                                setEditingMessage(null);
                                setEditContent("");
                              }
                            }}
                            className="text-sm"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => {
                                setEditingMessage(null);
                                setEditContent("");
                              }}
                            >
                              Save
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingMessage(null);
                                setEditContent("");
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm">{msg.content}</p>
                          {msg.isEdited && (
                            <span className="text-xs opacity-70">(edited)</span>
                          )}
                        </>
                      )}

                      {/* Message reactions */}
                      {msg.reactions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {msg.reactions.map((reaction) => (
                            <button
                              key={reaction.emoji}
                              onClick={() =>
                                handleReaction(msg.id, reaction.emoji)
                              }
                              className={cn(
                                "text-xs px-2 py-1 rounded-full border bg-background/50 hover:bg-background/80 transition-colors flex items-center gap-1",
                                reaction.users.includes(currentUserId) &&
                                  "bg-primary/10 border-primary/20"
                              )}
                            >
                              <span>{reaction.emoji}</span>
                              <span className="text-muted-foreground">
                                {reaction.users.length}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div
                      className={cn(
                        "flex items-center gap-2 text-xs text-muted-foreground",
                        isOwn ? "justify-end" : "justify-start"
                      )}
                    >
                      <span>{formatTime(msg.timestamp)}</span>
                      {isOwn && getDeliveryStatusIcon(msg.deliveryStatus)}
                    </div>
                  </div>

                  {/* Message actions */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <MoreHorizontal className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setReplyTo(msg)}>
                          <Reply className="w-4 h-4 mr-2" />
                          Reply
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Forward className="w-4 h-4 mr-2" />
                          Forward
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </DropdownMenuItem>
                        {isOwn && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingMessage(msg.id);
                                setEditContent(msg.content);
                              }}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              );
            })}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Reply Preview */}
      {replyTo && (
        <div className="px-4 py-2 bg-muted/50 border-t border-b">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground">
                Replying to {replyTo.sender}
              </div>
              <div className="text-sm truncate">{replyTo.content}</div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyTo(null)}
              className="h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t bg-background">
        {!canSendMessage ? (
          <Alert variant="destructive" className="mb-4">
            <Lock className="h-4 w-4" />
            <AlertDescription>
              {messagingReason || "You cannot send messages in this chat."}
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="flex items-end gap-2">
          <div className="flex gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" disabled={!canSendMessage}>
                    <Paperclip className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Attach file</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" disabled={!canSendMessage}>
                    <Camera className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Take photo</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" disabled={!canSendMessage}>
                    <ImageIcon className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Send image</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                canSendMessage
                  ? "Type a message..."
                  : "You cannot send messages in this chat"
              }
              disabled={!canSendMessage}
              className="pr-10"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              disabled={!canSendMessage}
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" disabled={!canSendMessage}>
                    <Mic className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Voice message</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || !canSendMessage}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
