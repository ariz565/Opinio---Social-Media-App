"use client";

import { useState } from "react";
import {
  MessageSquare,
  ChevronUp,
  X,
  Maximize2,
  Minimize2,
  MoreVertical,
} from "lucide-react";
import { Button } from "../ui/button";
import { ChatUserList } from "./chat-user-list";
import { ScrollArea } from "../ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

export function ChatSystem() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState<
    "online" | "away" | "offline"
  >("online");
  const [mutedUsers, setMutedUsers] = useState<string[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);

  const toggleMuteUser = (userId: string) => {
    setMutedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleBlockUser = (userId: string) => {
    setBlockedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="fixed bottom-0 right-4 z-50">
      <div className="flex flex-col">
        {isOpen && !isMinimized && (
          <div className="bg-background border rounded-t-lg shadow-lg w-80 mb-[3.5rem]">
            <div className="flex items-center justify-between p-3 border-b">
              <h3 className="font-semibold">Messages</h3>
              <div className="flex gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="px-3 py-2">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="online-status">Online Status</Label>
                        <select
                          id="online-status"
                          aria-label="Online Status"
                          value={onlineStatus}
                          onChange={(e) =>
                            setOnlineStatus(e.target.value as any)
                          }
                          className="ml-auto"
                        >
                          <option value="online">Online</option>
                          <option value="away">Away</option>
                          <option value="offline">Offline</option>
                        </select>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Mute all notifications</DropdownMenuItem>
                    <DropdownMenuItem>Message requests</DropdownMenuItem>
                    <DropdownMenuItem>Archived chats</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setIsMinimized(true)}
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <ScrollArea className="h-96">
              <ChatUserList
                onlineStatus={onlineStatus}
                mutedUsers={mutedUsers}
                blockedUsers={blockedUsers}
                onToggleMute={toggleMuteUser}
                onToggleBlock={toggleBlockUser}
              />
            </ScrollArea>
          </div>
        )}
        <Button
          className="fixed bottom-4 right-4 gap-2"
          onClick={() => {
            setIsOpen(!isOpen);
            setIsMinimized(false);
          }}
        >
          <MessageSquare className="h-4 w-[26px]" />
          Messages
          <ChevronUp
            className={`h-4 w-4 transform transition-transform ${
              isOpen && !isMinimized ? "rotate-180" : ""
            }`}
          />
        </Button>
      </div>
    </div>
  );
}
