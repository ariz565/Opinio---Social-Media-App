"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ChevronDown, BellOff, Ban, MoreVertical } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { ChatWindow } from "./chat-window";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

interface ChatUser {
  id: string;
  name: string;
  image: string;
  status: "online" | "offline";
  lastMessage: string;
}

interface ChatUserListProps {
  onlineStatus: "online" | "away" | "offline";
  mutedUsers: string[];
  blockedUsers: string[];
  onToggleMute: (userId: string) => void;
  onToggleBlock: (userId: string) => void;
}

const onlineUsers: ChatUser[] = [
  {
    id: "1",
    name: "Emma Wilson",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    status: "online",
    lastMessage: "Hey, how are you?",
  },
  {
    id: "2",
    name: "James Miller",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    status: "online",
    lastMessage: "The project looks great!",
  },
  {
    id: "3",
    name: "Sophia Chen",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    status: "offline",
    lastMessage: "Thanks for your help!",
  },
];

export function ChatUserList({
  onlineStatus,
  mutedUsers,
  blockedUsers,
  onToggleMute,
  onToggleBlock,
}: ChatUserListProps) {
  return (
    <>
      {onlineUsers.map((user) => (
        <Sheet key={user.id}>
          <SheetTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer hover:bg-muted p-2 rounded-lg">
              <div className="relative">
                <Avatar>
                  <AvatarImage src={user.image} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div
                  className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                    user.status === "online" ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{user.name}</p>
                  <div className="flex items-center gap-1">
                    {mutedUsers.includes(user.id) && (
                      <BellOff className="h-4 w-4 text-muted-foreground" />
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onToggleMute(user.id)}>
                          <BellOff className="h-4 w-4 mr-2" />
                          {mutedUsers.includes(user.id)
                            ? "Unmute"
                            : "Mute"}{" "}
                          messages
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => onToggleBlock(user.id)}
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          {blockedUsers.includes(user.id)
                            ? "Unblock"
                            : "Block"}{" "}
                          user
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {user.lastMessage}
                </p>
              </div>
            </div>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Chat with {user.name}</SheetTitle>
            </SheetHeader>
            <ChatWindow user={user} />
          </SheetContent>
        </Sheet>
      ))}
    </>
  );
}
