"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  UserPlus,
  UserCheck,
  UserX,
  Clock,
  MessageCircle,
  Shield,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface User {
  id: string;
  username: string;
  full_name: string;
  profile_picture?: string;
  bio?: string;
  is_verified: boolean;
  mutual_connections?: number;
}

interface ConnectionButtonProps {
  user: User;
  currentConnectionStatus: string; // "none", "pending_sent", "pending_received", "accepted", "blocked"
  canSendRequest: boolean;
  onStatusChange?: () => void;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "ghost";
}

export default function ConnectionButton({
  user,
  currentConnectionStatus,
  canSendRequest,
  onStatusChange,
  size = "md",
  variant = "default",
}: ConnectionButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState("");

  const sendConnectionRequest = async (message?: string) => {
    setLoading(true);
    try {
      // API call would go here
      const response = await fetch("/api/connections/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          receiver_id: user.id,
          message: message || undefined,
          connection_type: "standard",
        }),
      });

      if (response.ok) {
        toast({
          title: "Connection request sent",
          description: `Connection request sent to ${user.full_name}`,
        });
        setShowConnectionModal(false);
        setConnectionMessage("");
        onStatusChange?.();
      } else {
        throw new Error("Failed to send request");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send connection request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelConnectionRequest = async () => {
    setLoading(true);
    try {
      // API call to cancel would go here
      toast({
        title: "Request cancelled",
        description: "Connection request has been cancelled.",
      });
      onStatusChange?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel connection request.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const respondToRequest = async (accept: boolean) => {
    setLoading(true);
    try {
      // API call would go here
      toast({
        title: accept ? "Connection accepted" : "Connection declined",
        description: accept
          ? `You are now connected with ${user.full_name}!`
          : "Connection request declined.",
      });
      onStatusChange?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to respond to connection request.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeConnection = async () => {
    setLoading(true);
    try {
      // API call would go here
      toast({
        title: "Connection removed",
        description: `Connection with ${user.full_name} has been removed.`,
      });
      onStatusChange?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove connection.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    if (currentConnectionStatus === "none" && canSendRequest) {
      setShowConnectionModal(true);
    } else if (currentConnectionStatus === "pending_sent") {
      cancelConnectionRequest();
    }
  };

  const getButtonContent = () => {
    switch (currentConnectionStatus) {
      case "none":
        if (!canSendRequest) {
          return {
            icon: Shield,
            text: "Can't Connect",
            variant: "ghost" as const,
            disabled: true,
          };
        }
        return {
          icon: UserPlus,
          text: "Connect",
          variant: variant,
          disabled: false,
        };

      case "pending_sent":
        return {
          icon: Clock,
          text: "Pending",
          variant: "outline" as const,
          disabled: false,
        };

      case "pending_received":
        return {
          icon: UserCheck,
          text: "Respond",
          variant: "default" as const,
          disabled: false,
        };

      case "accepted":
        return {
          icon: UserCheck,
          text: "Connected",
          variant: "outline" as const,
          disabled: false,
        };

      case "blocked":
        return {
          icon: UserX,
          text: "Blocked",
          variant: "ghost" as const,
          disabled: true,
        };

      default:
        return {
          icon: UserPlus,
          text: "Connect",
          variant: variant,
          disabled: false,
        };
    }
  };

  const buttonContent = getButtonContent();
  const Icon = buttonContent.icon;

  // Special handling for pending received - show accept/decline buttons
  if (currentConnectionStatus === "pending_received") {
    return (
      <div className="flex gap-2">
        <Button
          size={size}
          onClick={() => respondToRequest(true)}
          disabled={loading}
          className="flex-1"
        >
          <UserCheck className="h-4 w-4 mr-1" />
          Accept
        </Button>
        <Button
          size={size}
          variant="outline"
          onClick={() => respondToRequest(false)}
          disabled={loading}
          className="flex-1"
        >
          <UserX className="h-4 w-4 mr-1" />
          Decline
        </Button>
      </div>
    );
  }

  // Special handling for connected status - show message and remove options
  if (currentConnectionStatus === "accepted") {
    return (
      <div className="flex gap-2">
        <Button size={size} className="flex-1">
          <MessageCircle className="h-4 w-4 mr-1" />
          Message
        </Button>
        <Button
          size={size}
          variant="outline"
          onClick={removeConnection}
          disabled={loading}
        >
          <UserX className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button
        size={size}
        variant={buttonContent.variant}
        onClick={handleButtonClick}
        disabled={buttonContent.disabled || loading}
        className="relative"
      >
        <Icon className="h-4 w-4 mr-1" />
        {loading ? "Loading..." : buttonContent.text}
        {currentConnectionStatus === "pending_sent" && (
          <Badge
            variant="secondary"
            className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs"
          >
            !
          </Badge>
        )}
      </Button>

      {/* Connection Request Modal */}
      <Dialog open={showConnectionModal} onOpenChange={setShowConnectionModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Connection Request</DialogTitle>
            <DialogDescription>
              Send a connection request to {user.full_name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* User Preview */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="relative">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {user.full_name.charAt(0).toUpperCase()}
                </div>
                {user.is_verified && (
                  <CheckCircle className="absolute -bottom-1 -right-1 h-4 w-4 text-blue-500 bg-white rounded-full" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="font-medium">{user.full_name}</div>
                </div>
                <div className="text-sm text-gray-500">@{user.username}</div>
                {user.bio && (
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                    {user.bio}
                  </div>
                )}
                {user.mutual_connections && user.mutual_connections > 0 && (
                  <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    {user.mutual_connections} mutual connection
                    {user.mutual_connections !== 1 ? "s" : ""}
                  </div>
                )}
              </div>
            </div>

            {/* Message Input */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Add a message (optional)
              </label>
              <Textarea
                placeholder="Hi! I'd like to connect with you on this platform."
                value={connectionMessage}
                onChange={(e) => setConnectionMessage(e.target.value)}
                rows={3}
                maxLength={500}
                className="resize-none"
              />
              <div className="text-xs text-gray-500 mt-1 text-right">
                {connectionMessage.length}/500
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowConnectionModal(false);
                  setConnectionMessage("");
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={() => sendConnectionRequest(connectionMessage)}
                disabled={loading}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                ) : (
                  <UserPlus className="h-4 w-4 mr-2" />
                )}
                {loading ? "Sending..." : "Send Request"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Helper component for showing connection status badge
export function ConnectionStatusBadge({
  status,
  mutualConnections,
}: {
  status: string;
  mutualConnections?: number;
}) {
  const getStatusConfig = () => {
    switch (status) {
      case "accepted":
        return {
          variant: "default" as const,
          icon: UserCheck,
          text: "Connected",
          color: "bg-green-500",
        };
      case "pending_sent":
        return {
          variant: "secondary" as const,
          icon: Clock,
          text: "Request Sent",
          color: "bg-yellow-500",
        };
      case "pending_received":
        return {
          variant: "destructive" as const,
          icon: UserPlus,
          text: "Pending Response",
          color: "bg-blue-500",
        };
      case "blocked":
        return {
          variant: "destructive" as const,
          icon: UserX,
          text: "Blocked",
          color: "bg-red-500",
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  if (!config) return null;

  const Icon = config.icon;

  return (
    <div className="flex items-center gap-2">
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
      {mutualConnections && mutualConnections > 0 && (
        <Badge variant="outline" className="text-xs">
          {mutualConnections} mutual
        </Badge>
      )}
    </div>
  );
}
