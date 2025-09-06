"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWebSocketContext } from "@/components/providers/websocket-provider";
import { useToast } from "@/hooks/use-toast";
import {
  Wifi,
  WifiOff,
  Send,
  MessageSquare,
  UserPlus,
  Heart,
  Users,
  Activity,
  TestTube,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
} from "lucide-react";

interface LogEntry {
  id: number;
  timestamp: string;
  type: "info" | "success" | "warning" | "error";
  message: string;
}

export function WebSocketTestPanel() {
  const {
    isConnected,
    lastMessage,
    sendMessage,
    sendTypingStatus,
    updateUserStatus,
    reconnectAttempts,
    connect,
    disconnect,
  } = useWebSocketContext();

  const { toast } = useToast();
  const [testMessage, setTestMessage] = useState("");
  const [testChatId, setTestChatId] = useState("test-chat-123");
  const [testUserId, setTestUserId] = useState("test-user-456");
  const [messageHistory, setMessageHistory] = useState<any[]>([]);
  const [userStatus, setUserStatus] = useState<"online" | "away">("online");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [rawWsTest, setRawWsTest] = useState<{
    connected: boolean;
    status: string;
    ws: WebSocket | null;
  }>({
    connected: false,
    status: "Disconnected",
    ws: null,
  });

  const addLog = (type: LogEntry["type"], message: string) => {
    const newLog: LogEntry = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
    };
    setLogs((prev) => [newLog, ...prev].slice(0, 50));
  };

  // Track received messages
  useEffect(() => {
    if (lastMessage) {
      setMessageHistory((prev) => [
        ...prev.slice(-9),
        {
          ...lastMessage,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      addLog("success", `📥 Received via provider: ${lastMessage.type}`);
    }
  }, [lastMessage]);

  // Log connection status changes
  useEffect(() => {
    if (isConnected) {
      addLog("success", "✅ WebSocket Provider connected");
    } else {
      addLog("warning", "🔌 WebSocket Provider disconnected");
    }
  }, [isConnected]);

  const testDirectWebSocket = () => {
    const token =
      localStorage.getItem("access_token") || localStorage.getItem("token");
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const wsUrl = baseUrl.replace(/^https?:/, protocol);

    addLog("info", "🔄 Testing direct WebSocket connection...");
    addLog(
      "info",
      `🔑 Using token: ${token ? "Present" : "Missing"} (${
        token?.length || 0
      } chars)`
    );

    if (rawWsTest.ws) {
      rawWsTest.ws.close();
    }

    const url = token
      ? `${wsUrl}/ws?token=${encodeURIComponent(token)}`
      : `${wsUrl}/ws`;
    addLog(
      "info",
      `🌐 Connecting to: ${url.replace(/token=[^&]+/, "token=[REDACTED]")}`
    );

    const ws = new WebSocket(url);

    ws.onopen = () => {
      setRawWsTest((prev) => ({
        ...prev,
        connected: true,
        status: "Connected",
        ws,
      }));
      addLog("success", "✅ Direct WebSocket connected!");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        addLog(
          "success",
          `📥 Direct WS received: ${data.type} - ${
            data.message || JSON.stringify(data)
          }`
        );
      } catch (e) {
        addLog("info", `📥 Direct WS raw: ${event.data}`);
      }
    };

    ws.onclose = (event) => {
      setRawWsTest((prev) => ({
        ...prev,
        connected: false,
        status: `Closed (${event.code})`,
        ws: null,
      }));
      addLog(
        "warning",
        `🔌 Direct WS closed. Code: ${event.code}, Reason: ${
          event.reason || "No reason"
        }`
      );

      if (event.code === 1008) {
        addLog("error", "🚫 Authentication failed (Code 1008)");
      }
    };

    ws.onerror = (error) => {
      addLog("error", `❌ Direct WS error: ${error}`);
      setRawWsTest((prev) => ({ ...prev, status: "Error" }));
    };
  };

  const testAuthInfo = () => {
    const accessToken = localStorage.getItem("access_token");
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    addLog("info", "🔍 Authentication info:");
    addLog(
      "info",
      `📋 access_token: ${accessToken ? "Present" : "Missing"} (${
        accessToken?.length || 0
      } chars)`
    );
    addLog(
      "info",
      `📋 token: ${token ? "Present" : "Missing"} (${token?.length || 0} chars)`
    );
    addLog("info", `📋 user data: ${user ? "Present" : "Missing"}`);

    if (user) {
      try {
        const userData = JSON.parse(user);
        addLog(
          "info",
          `👤 User: ${userData.username || userData.email || "Unknown"} (ID: ${
            userData.id || userData._id || "Unknown"
          })`
        );
      } catch (e) {
        addLog("warning", "⚠️ User data is not valid JSON");
      }
    }
  };

  const handleSendTestMessage = () => {
    if (!testMessage.trim()) return;

    const success = sendMessage({
      type: "test_message",
      data: {
        content: testMessage,
        chatId: testChatId,
        userId: testUserId,
      },
    });

    if (success) {
      toast({
        title: "Test Message Sent",
        description: `Sent: ${testMessage}`,
      });
      setTestMessage("");
    } else {
      toast({
        title: "Failed to Send",
        description: "WebSocket not connected",
        variant: "destructive",
      });
    }
  };

  const handleSendConnectionRequest = () => {
    const success = sendMessage({
      type: "connection_request",
      data: {
        receiverId: testUserId,
        senderName: "Test User",
        message: "Would like to connect with you!",
      },
    });

    if (success) {
      toast({
        title: "Connection Request Sent",
        description: "Test connection request sent via WebSocket",
      });
    }
  };

  const handleSendTyping = () => {
    sendTypingStatus(testChatId, true);
    setTimeout(() => sendTypingStatus(testChatId, false), 3000);
    toast({
      title: "Typing Status Sent",
      description: "Typing indicator sent for 3 seconds",
    });
  };

  const handleUpdateStatus = () => {
    const newStatus = userStatus === "online" ? "away" : "online";
    updateUserStatus(newStatus);
    setUserStatus(newStatus);
    toast({
      title: "Status Updated",
      description: `Status changed to ${newStatus}`,
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-500" />
            )}
            WebSocket Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Connection:</span>
            <Badge variant={isConnected ? "default" : "destructive"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span>Reconnect Attempts:</span>
            <Badge variant="outline">{reconnectAttempts}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span>User Status:</span>
            <Badge variant={userStatus === "online" ? "default" : "secondary"}>
              {userStatus}
            </Badge>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={connect}
              disabled={isConnected}
              size="sm"
              variant="outline"
            >
              Connect
            </Button>
            <Button
              onClick={disconnect}
              disabled={!isConnected}
              size="sm"
              variant="outline"
            >
              Disconnect
            </Button>
            <Button onClick={handleUpdateStatus} size="sm" variant="outline">
              <Activity className="h-4 w-4 mr-2" />
              Toggle Status
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Test Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Test Chat ID:</label>
            <Input
              value={testChatId}
              onChange={(e) => setTestChatId(e.target.value)}
              placeholder="Enter chat ID"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Test User ID:</label>
            <Input
              value={testUserId}
              onChange={(e) => setTestUserId(e.target.value)}
              placeholder="Enter user ID"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Test Message:</label>
            <div className="flex gap-2">
              <Input
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="Enter test message"
                onKeyPress={(e) => e.key === "Enter" && handleSendTestMessage()}
              />
              <Button
                onClick={handleSendTestMessage}
                disabled={!isConnected || !testMessage.trim()}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={handleSendConnectionRequest}
              disabled={!isConnected}
              variant="outline"
              size="sm"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Test Connection
            </Button>
            <Button
              onClick={handleSendTyping}
              disabled={!isConnected}
              variant="outline"
              size="sm"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Test Typing
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Message History */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Real-time Message History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {messageHistory.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No messages received yet. Test the WebSocket connection above.
              </p>
            ) : (
              messageHistory.map((msg, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-2 border rounded"
                >
                  <Badge variant="outline" className="text-xs">
                    {msg.timestamp}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant={
                          msg.type === "connection_request"
                            ? "default"
                            : msg.type === "message"
                            ? "secondary"
                            : msg.type === "typing"
                            ? "outline"
                            : "destructive"
                        }
                      >
                        {msg.type}
                      </Badge>
                    </div>
                    <pre className="text-xs text-muted-foreground whitespace-pre-wrap overflow-hidden">
                      {JSON.stringify(msg.data, null, 2)}
                    </pre>
                  </div>
                </div>
              ))
            )}
          </div>
          {messageHistory.length > 0 && (
            <Button
              onClick={() => setMessageHistory([])}
              variant="outline"
              size="sm"
              className="mt-2 w-full"
            >
              Clear History
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
