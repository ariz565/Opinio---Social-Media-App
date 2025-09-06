// Connection and Messaging API utilities
import { useState, useEffect, useCallback } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Connection API endpoints
export const connectionsApi = {
  // Send connection request
  sendRequest: async (
    receiverId: string,
    message?: string,
    connectionType = "standard"
  ) => {
    const response = await fetch(`${API_BASE}/api/v1/connections/request`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        receiver_id: receiverId,
        message,
        connection_type: connectionType,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send connection request");
    }

    return response.json();
  },

  // Respond to connection request
  respondToRequest: async (connectionId: string, accept: boolean) => {
    const response = await fetch(`${API_BASE}/api/v1/connections/respond`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        connection_id: connectionId,
        accept,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to respond to connection request");
    }

    return response.json();
  },

  // Get connection requests
  getRequests: async (incoming = true, limit = 20, skip = 0) => {
    const params = new URLSearchParams({
      incoming: incoming.toString(),
      limit: limit.toString(),
      skip: skip.toString(),
    });

    const response = await fetch(
      `${API_BASE}/api/v1/connections/requests?${params}`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get connection requests");
    }

    return response.json();
  },

  // Get user connections
  getConnections: async (connectionType?: string, limit = 50, skip = 0) => {
    const params = new URLSearchParams({
      limit: limit.toString(),
      skip: skip.toString(),
      ...(connectionType && { connection_type: connectionType }),
    });

    const response = await fetch(`${API_BASE}/api/v1/connections?${params}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to get connections");
    }

    return response.json();
  },

  // Remove connection
  removeConnection: async (connectionId: string) => {
    const response = await fetch(`${API_BASE}/api/v1/connections`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        connection_id: connectionId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to remove connection");
    }

    return response.json();
  },

  // Get connection status
  getConnectionStatus: async (userId: string) => {
    const response = await fetch(
      `${API_BASE}/api/v1/connections/status/${userId}`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Connection status error ${response.status}:`, errorText);
      throw new Error(
        `Failed to get connection status: ${response.status} - ${errorText}`
      );
    }

    return response.json();
  },

  // Block user
  blockUser: async (userId: string) => {
    const response = await fetch(`${API_BASE}/api/v1/connections/block`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        user_id: userId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to block user");
    }

    return response.json();
  },

  // Unblock user
  unblockUser: async (userId: string) => {
    const response = await fetch(
      `${API_BASE}/api/v1/connections/block/${userId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to unblock user");
    }

    return response.json();
  },

  // Get blocked users
  getBlockedUsers: async (limit = 50, skip = 0) => {
    const params = new URLSearchParams({
      limit: limit.toString(),
      skip: skip.toString(),
    });

    const response = await fetch(
      `${API_BASE}/api/v1/connections/blocked?${params}`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get blocked users");
    }

    return response.json();
  },

  // Get connection suggestions
  getSuggestions: async (limit = 10) => {
    const params = new URLSearchParams({
      limit: limit.toString(),
    });

    const response = await fetch(
      `${API_BASE}/api/v1/connections/suggestions?${params}`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get connection suggestions");
    }

    return response.json();
  },

  // Get mutual connections
  getMutualConnections: async (userId: string, limit = 10) => {
    const params = new URLSearchParams({
      limit: limit.toString(),
    });

    const response = await fetch(
      `${API_BASE}/api/v1/connections/mutual/${userId}?${params}`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get mutual connections");
    }

    return response.json();
  },

  // Get connection stats
  getStats: async () => {
    const response = await fetch(`${API_BASE}/api/v1/connections/stats`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to get connection stats");
    }

    return response.json();
  },

  // Check if can message user
  canMessageUser: async (userId: string) => {
    const response = await fetch(
      `${API_BASE}/api/v1/connections/can-message/${userId}`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to check messaging permission");
    }

    return response.json();
  },
};

// Messaging API endpoints
export const messagingApi = {
  // Create chat
  createChat: async (
    participantIds: string[],
    chatType = "direct",
    chatName?: string
  ) => {
    const response = await fetch(`${API_BASE}/api/v1/messages/chat`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        participant_ids: participantIds,
        chat_type: chatType,
        chat_name: chatName,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create chat");
    }

    return response.json();
  },

  // Get user chats
  getChats: async (limit = 50, skip = 0) => {
    const params = new URLSearchParams({
      limit: limit.toString(),
      skip: skip.toString(),
    });

    const response = await fetch(
      `${API_BASE}/api/v1/messages/chats?${params}`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get chats");
    }

    return response.json();
  },

  // Send message
  sendMessage: async (
    chatId: string,
    content: string,
    messageType = "text",
    replyTo?: string,
    mediaUrl?: string
  ) => {
    const response = await fetch(`${API_BASE}/api/v1/messages/send`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        chat_id: chatId,
        content,
        message_type: messageType,
        reply_to: replyTo,
        media_url: mediaUrl,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send message");
    }

    return response.json();
  },

  // Get chat messages
  getChatMessages: async (chatId: string, limit = 50, skip = 0) => {
    const params = new URLSearchParams({
      limit: limit.toString(),
      skip: skip.toString(),
    });

    const response = await fetch(
      `${API_BASE}/api/v1/messages/chat/${chatId}?${params}`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get chat messages");
    }

    return response.json();
  },

  // Mark messages as read
  markAsRead: async (chatId: string) => {
    const response = await fetch(`${API_BASE}/api/v1/messages/read`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        chat_id: chatId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to mark messages as read");
    }

    return response.json();
  },

  // Edit message
  editMessage: async (messageId: string, newContent: string) => {
    const response = await fetch(`${API_BASE}/api/v1/messages/edit`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        message_id: messageId,
        new_content: newContent,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to edit message");
    }

    return response.json();
  },

  // Delete message
  deleteMessage: async (messageId: string) => {
    const response = await fetch(`${API_BASE}/api/v1/messages/${messageId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to delete message");
    }

    return response.json();
  },

  // Add reaction
  addReaction: async (messageId: string, emoji: string) => {
    const response = await fetch(`${API_BASE}/api/v1/messages/reaction`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        message_id: messageId,
        emoji,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add reaction");
    }

    return response.json();
  },

  // Remove reaction
  removeReaction: async (messageId: string) => {
    const response = await fetch(
      `${API_BASE}/api/v1/messages/reaction/${messageId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to remove reaction");
    }

    return response.json();
  },

  // Search messages
  searchMessages: async (query: string, chatId?: string, limit = 20) => {
    const response = await fetch(`${API_BASE}/api/v1/messages/search`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        query,
        chat_id: chatId,
        limit,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to search messages");
    }

    return response.json();
  },

  // Check if can message user
  canMessageUser: async (userId: string) => {
    const response = await fetch(
      `${API_BASE}/api/v1/messages/can-message/${userId}`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to check messaging permission");
    }

    return response.json();
  },
};

// Hook for managing connection status
export const useConnectionStatus = (userId: string) => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkStatus = useCallback(async () => {
    setLoading(true);
    try {
      const result = await connectionsApi.getConnectionStatus(userId);
      setStatus(result);
    } catch (error) {
      console.error("Failed to check connection status:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      checkStatus();
    }
  }, [userId, checkStatus]);

  return { status, loading, refreshStatus: checkStatus };
};

// Hook for managing messaging permission
export const useMessagingPermission = (userId: string) => {
  const [canMessage, setCanMessage] = useState(false);
  const [reason, setReason] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const checkPermission = useCallback(async () => {
    setLoading(true);
    try {
      const result = await messagingApi.canMessageUser(userId);
      setCanMessage(result.can_message);
      setReason(result.reason);
    } catch (error) {
      console.error("Failed to check messaging permission:", error);
      setCanMessage(false);
      setReason("Unable to check messaging permission");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      checkPermission();
    }
  }, [userId, checkPermission]);

  return { canMessage, reason, loading, refreshPermission: checkPermission };
};
