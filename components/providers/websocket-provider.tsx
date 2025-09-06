"use client";

import { createContext, useContext, ReactNode, useCallback } from "react";
import { useWebSocket, WebSocketMessage } from "../../hooks/use-websocket-hook";

interface WebSocketContextType {
  isConnected: boolean;
  lastMessage: WebSocketMessage | null;
  sendMessage: (message: any) => boolean;
  sendTypingStatus: (chatId: string, isTyping: boolean) => void;
  updateUserStatus: (status: "online" | "away") => void;
  reconnectAttempts: number;
  connect: () => void;
  disconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const handleMessage = useCallback((message: WebSocketMessage) => {
    console.log("Global WebSocket message:", message);
  }, []);

  const handleConnectionStatusChange = useCallback((connected: boolean) => {
    console.log("WebSocket connection status:", connected);
  }, []);

  const webSocket = useWebSocket({
    onMessage: handleMessage,
    onConnectionStatusChange: handleConnectionStatusChange,
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
