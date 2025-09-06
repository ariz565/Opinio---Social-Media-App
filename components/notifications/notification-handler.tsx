"use client";

import { useEffect } from "react";
import { useWebSocketContext } from "@/components/providers/websocket-provider";
import { useToast } from "@/hooks/use-toast";
import { Bell, MessageSquare, UserPlus, Heart } from "lucide-react";

export function NotificationHandler() {
  const { lastMessage } = useWebSocketContext();
  const { toast } = useToast();

  useEffect(() => {
    if (lastMessage) {
      switch (lastMessage.type) {
        case 'connection_request':
          toast({
            title: "New Connection Request",
            description: `${lastMessage.data.senderName} wants to connect with you`,
            action: (
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                <span>View</span>
              </div>
            ),
          });
          break;

        case 'connection_accepted':
          toast({
            title: "Connection Accepted",
            description: `${lastMessage.data.senderName} accepted your connection request`,
            action: (
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span>View Profile</span>
              </div>
            ),
          });
          break;

        case 'new_message':
          toast({
            title: "New Message",
            description: `${lastMessage.data.senderName}: ${lastMessage.data.content}`,
            action: (
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>Reply</span>
              </div>
            ),
          });
          break;

        case 'user_status':
          // Handle user status updates (online/offline) - could show subtle notifications
          if (lastMessage.data.status === 'online') {
            console.log(`${lastMessage.data.userId} is now online`);
          }
          break;

        case 'typing':
          // Handle typing indicators - this would update UI state rather than show toast
          console.log(`${lastMessage.data.userId} is typing in chat ${lastMessage.data.chatId}`);
          break;

        default:
          console.log('Unknown message type:', lastMessage.type);
      }
    }
  }, [lastMessage, toast]);

  // This component doesn't render anything visible
  return null;
}
