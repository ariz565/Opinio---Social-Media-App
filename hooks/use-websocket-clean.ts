"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { toast } from "@/hooks/use-toast";

interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

interface UseWebSocketOptions {
  onMessage?: (message: WebSocketMessage) => void;
  onConnectionStatusChange?: (connected: boolean) => void;
  autoReconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const {
    onMessage,
    onConnectionStatusChange,
    autoReconnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const getWebSocketUrl = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const wsUrl = baseUrl.replace(/^https?:/, protocol);

    return `${wsUrl}/ws?token=${encodeURIComponent(token)}`;
  };

  const handleWebSocketMessage = (message: WebSocketMessage) => {
    switch (message.type) {
      case "connection_established":
        toast({
          title: "Connected",
          description: "Real-time notifications enabled",
        });
        break;

      case "connection_request":
        toast({
          title: "New Connection Request",
          description: `${
            message.data?.sender_name || "Someone"
          } wants to connect with you`,
          duration: 5000,
        });
        break;

      case "connection_response":
        const status = message.accepted ? "accepted" : "rejected";
        toast({
          title: `Connection ${status}`,
          description: `${
            message.data?.responder_name || "Someone"
          } ${status} your connection request`,
          duration: 5000,
        });
        break;

      case "new_message":
        if (!document.hasFocus()) {
          toast({
            title: "New message",
            description: `${message.message?.sender_name || "Someone"}: ${
              message.message?.content || "Sent a message"
            }`,
            duration: 4000,
          });
        }
        break;

      case "message_reaction":
        toast({
          title: "Message Reaction",
          description: `${
            message.reaction?.user_name || "Someone"
          } reacted with ${message.reaction?.emoji || "👍"}`,
          duration: 3000,
        });
        break;

      case "user_status_update":
        console.log(`User ${message.user_id} is now ${message.status}`);
        break;

      case "typing_status":
        // Handle typing indicators
        break;

      case "pong":
        // Ping response
        break;

      case "error":
        console.error("WebSocket error:", message.message);
        toast({
          title: "Connection Error",
          description: message.message || "An error occurred",
          variant: "destructive",
        });
        break;
    }
  };

  const connect = useCallback(() => {
    try {
      const url = getWebSocketUrl();
      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        setReconnectAttempts(0);
        onConnectionStatusChange?.(true);

        pingIntervalRef.current = setInterval(() => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: "ping" }));
          }
        }, 30000);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);
          onMessage?.(message);
          handleWebSocketMessage(message);
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log("WebSocket disconnected:", event.code, event.reason);
        setIsConnected(false);
        onConnectionStatusChange?.(false);

        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = null;
        }

        if (
          autoReconnect &&
          event.code !== 1000 &&
          reconnectAttempts < maxReconnectAttempts
        ) {
          const timeout = Math.min(
            reconnectInterval * Math.pow(2, reconnectAttempts),
            30000
          );
          console.log(`Attempting to reconnect in ${timeout}ms`);

          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempts((prev) => prev + 1);
            connect();
          }, timeout);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    } catch (error) {
      console.error("Failed to connect WebSocket:", error);
      onConnectionStatusChange?.(false);
    }
  }, [
    autoReconnect,
    reconnectInterval,
    maxReconnectAttempts,
    reconnectAttempts,
    onMessage,
    onConnectionStatusChange,
  ]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close(1000, "Manual disconnect");
      wsRef.current = null;
    }

    setIsConnected(false);
    setReconnectAttempts(0);
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    return false;
  }, []);

  const sendTypingStatus = useCallback(
    (chatId: string, isTyping: boolean) => {
      sendMessage({
        type: "typing",
        chat_id: chatId,
        is_typing: isTyping,
      });
    },
    [sendMessage]
  );

  const updateUserStatus = useCallback(
    (status: "online" | "away") => {
      sendMessage({
        type: status === "online" ? "mark_online" : "mark_away",
      });
    },
    [sendMessage]
  );

  useEffect(() => {
    connect();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        updateUserStatus("away");
      } else {
        updateUserStatus("online");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      disconnect();
    };
  }, [connect, disconnect, updateUserStatus]);

  return {
    isConnected,
    lastMessage,
    sendMessage,
    sendTypingStatus,
    updateUserStatus,
    reconnectAttempts,
    connect,
    disconnect,
  };
};

interface WebSocketContextType {
  isConnected: boolean;
  lastMessage: WebSocketMessage | null;
  sendMessage: (message: any) => boolean;
  sendTypingStatus: (chatId: string, isTyping: boolean) => void;
  updateUserStatus: (status: "online" | "away") => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const webSocket = useWebSocket({
    onMessage: (message) => {
      console.log("Global WebSocket message:", message);
    },
    onConnectionStatusChange: (connected) => {
      console.log("WebSocket connection status:", connected);
    },
  });

  return (
    <WebSocketContext.Provider value={webSocket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error(
      "useWebSocketContext must be used within a WebSocketProvider"
    );
  }
  return context;
};
