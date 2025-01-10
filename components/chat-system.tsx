"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ChevronDown, MessageSquare, Send } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

const onlineUsers = [
  {
    name: "Emma Wilson",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    status: "online",
    lastMessage: "Hey, whats up?",
  },
  {
    name: "James Miller",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    status: "online",
    lastMessage: "The project looks great!",
  },
  {
    name: "Sophia Chen",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    status: "offline",
    lastMessage: "Thanks for your help!",
  },
];

export function ChatSystem() {
  const [selectedUser, setSelectedUser] = useState(onlineUsers[0]);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Messages
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {onlineUsers.map((user, index) => (
          <Sheet key={index}>
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
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {user.lastMessage}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Chat with {user.name}</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col h-full">
                <div className="flex-1 py-4">
                  {/* Chat messages would go here */}
                </div>
                <div className="flex gap-2 pt-4 border-t">
                  <Input placeholder="Type a message..." />
                  <Button size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        ))}
      </CardContent>
    </Card>
  );
}
