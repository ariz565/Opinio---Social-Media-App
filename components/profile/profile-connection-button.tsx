"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  UserPlus,
  UserCheck,
  MessageSquare,
  UserX,
  Clock,
  Loader2,
} from "lucide-react";
import { connectionsApi } from "@/lib/connections-api";
import { useWebSocketContext } from "@/components/providers/websocket-provider";
import { useToast } from "@/hooks/use-toast";

interface ProfileConnectionButtonProps {
  userId: string;
  userName: string;
  userAvatar?: string;
  currentUserId: string;
}

export function ProfileConnectionButton({
  userId,
  userName,
  userAvatar,
  currentUserId,
}: ProfileConnectionButtonProps) {
  const [connectionStatus, setConnectionStatus] = useState<
    | "not_connected"
    | "pending_sent"
    | "pending_received"
    | "connected"
    | "blocked"
  >("not_connected");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const { sendMessage, lastMessage } = useWebSocketContext();
  const { toast } = useToast();

  // Check initial connection status
  useEffect(() => {
    const checkConnectionStatus = async () => {
      if (!userId) {
        console.warn(
          "ProfileConnectionButton: userId is undefined, skipping connection status check"
        );
        setLoading(false);
        return;
      }

      try {
        const response = await connectionsApi.getConnectionStatus(userId);
        setConnectionStatus(response.status);
      } catch (error) {
        console.error("Failed to check connection status:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId !== currentUserId) {
      checkConnectionStatus();
    } else {
      setLoading(false);
    }
  }, [userId, currentUserId]);

  // Listen for WebSocket updates
  useEffect(() => {
    if (lastMessage && lastMessage.data && lastMessage.data.userId === userId) {
      if (lastMessage.type === "connection_request") {
        setConnectionStatus("pending_received");
      } else if (lastMessage.type === "connection_accepted") {
        setConnectionStatus("connected");
        toast({
          title: "Connection Accepted",
          description: `You are now connected with ${userName}`,
        });
      } else if (lastMessage.type === "connection_declined") {
        setConnectionStatus("not_connected");
      }
    }
  }, [lastMessage, userId, userName, toast]);

  const handleSendConnectionRequest = async () => {
    setActionLoading(true);
    try {
      await connectionsApi.sendRequest(userId);
      setConnectionStatus("pending_sent");
      toast({
        title: "Connection Request Sent",
        description: `Connection request sent to ${userName}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send connection request",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleAcceptConnection = async () => {
    setActionLoading(true);
    try {
      // For this we need the connection ID, which we would get from the initial status check
      // For now, we'll make a simplified call
      await connectionsApi.respondToRequest(userId, true);
      setConnectionStatus("connected");
      toast({
        title: "Connection Accepted",
        description: `You are now connected with ${userName}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept connection request",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeclineConnection = async () => {
    setActionLoading(true);
    try {
      await connectionsApi.respondToRequest(userId, false);
      setConnectionStatus("not_connected");
      toast({
        title: "Connection Declined",
        description: `Connection request from ${userName} declined`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to decline connection request",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Don't show anything for own profile
  if (userId === currentUserId) {
    return null;
  }

  if (loading) {
    return (
      <Button disabled>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Loading...
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {connectionStatus === "not_connected" && (
        <Button
          onClick={handleSendConnectionRequest}
          disabled={actionLoading}
          className="w-full"
        >
          {actionLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <UserPlus className="w-4 h-4 mr-2" />
          )}
          Connect
        </Button>
      )}

      {connectionStatus === "pending_sent" && (
        <div className="flex flex-col gap-2">
          <Badge variant="outline" className="w-full justify-center">
            <Clock className="w-4 h-4 mr-2" />
            Request Pending
          </Badge>
        </div>
      )}

      {connectionStatus === "pending_received" && (
        <div className="flex gap-2">
          <Button
            onClick={handleAcceptConnection}
            disabled={actionLoading}
            className="flex-1"
          >
            {actionLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <UserCheck className="w-4 h-4 mr-2" />
            )}
            Accept
          </Button>
          <Button
            variant="outline"
            onClick={handleDeclineConnection}
            disabled={actionLoading}
            className="flex-1"
          >
            <UserX className="w-4 h-4 mr-2" />
            Decline
          </Button>
        </div>
      )}

      {connectionStatus === "connected" && (
        <div className="flex gap-2">
          <Badge variant="default" className="flex-1 justify-center">
            <UserCheck className="w-4 h-4 mr-2" />
            Connected
          </Badge>
          <Button variant="outline" size="sm">
            <MessageSquare className="w-4 h-4 mr-2" />
            Message
          </Button>
        </div>
      )}

      {connectionStatus === "blocked" && (
        <Badge variant="destructive" className="w-full justify-center">
          <UserX className="w-4 h-4 mr-2" />
          Blocked
        </Badge>
      )}
    </div>
  );
}
