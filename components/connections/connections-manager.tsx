"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Search,
  Filter,
  MoreHorizontal,
  MessageCircle,
  Shield,
  Star,
  CheckCircle,
  Clock,
  X,
  Send,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  username: string;
  full_name: string;
  profile_picture?: string;
  bio?: string;
  is_verified: boolean;
  is_online?: boolean;
  mutual_connections?: number;
}

interface ConnectionRequest {
  connection_id: string;
  user: User;
  message?: string;
  connection_type: string;
  created_at: string;
  expires_at?: string;
}

interface Connection {
  connection_id: string;
  user: User;
  connection_type: string;
  connected_at: string;
  mutual_connections: number;
}

interface ConnectionSuggestion {
  user: User;
  mutual_connections: number;
  reason: string;
}

interface ConnectionStats {
  connections: number;
  pending_requests: number;
}

export default function ConnectionsManager() {
  const [activeTab, setActiveTab] = useState("connections");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Data states
  const [connections, setConnections] = useState<Connection[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<ConnectionRequest[]>(
    []
  );
  const [outgoingRequests, setOutgoingRequests] = useState<ConnectionRequest[]>(
    []
  );
  const [suggestions, setSuggestions] = useState<ConnectionSuggestion[]>([]);
  const [stats, setStats] = useState<ConnectionStats>({
    connections: 0,
    pending_requests: 0,
  });

  // UI states
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState("");

  // Mock data for demonstration
  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    // Mock connections
    setConnections([
      {
        connection_id: "1",
        user: {
          id: "user1",
          username: "sarah.johnson",
          full_name: "Sarah Johnson",
          profile_picture: "https://github.com/shadcn.png",
          bio: "Product Manager at TechCorp",
          is_verified: true,
          is_online: true,
        },
        connection_type: "professional",
        connected_at: "2024-01-15T10:30:00Z",
        mutual_connections: 12,
      },
      {
        connection_id: "2",
        user: {
          id: "user2",
          username: "mike.chen",
          full_name: "Mike Chen",
          profile_picture: "https://github.com/shadcn.png",
          bio: "Software Engineer at StartupXYZ",
          is_verified: false,
          is_online: false,
        },
        connection_type: "standard",
        connected_at: "2024-01-10T14:20:00Z",
        mutual_connections: 8,
      },
    ]);

    // Mock incoming requests
    setIncomingRequests([
      {
        connection_id: "req1",
        user: {
          id: "user3",
          username: "alex.martinez",
          full_name: "Alex Martinez",
          profile_picture: "https://github.com/shadcn.png",
          bio: "UX Designer",
          is_verified: false,
          is_online: true,
        },
        message: "Hi! I'd love to connect and discuss design opportunities.",
        connection_type: "professional",
        created_at: "2024-01-20T09:15:00Z",
      },
    ]);

    // Mock suggestions
    setSuggestions([
      {
        user: {
          id: "user4",
          username: "emma.wilson",
          full_name: "Emma Wilson",
          profile_picture: "https://github.com/shadcn.png",
          bio: "Marketing Director",
          is_verified: true,
          is_online: false,
        },
        mutual_connections: 15,
        reason: "15 mutual connections",
      },
    ]);

    setStats({ connections: 42, pending_requests: 3 });
  };

  const sendConnectionRequest = async (userId: string, message?: string) => {
    setLoading(true);
    try {
      // API call would go here
      toast({
        title: "Connection request sent",
        description: "Your connection request has been sent successfully.",
      });
      setShowConnectionModal(false);
      setConnectionMessage("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send connection request.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const respondToRequest = async (connectionId: string, accept: boolean) => {
    setLoading(true);
    try {
      // API call would go here
      setIncomingRequests((prev) =>
        prev.filter((req) => req.connection_id !== connectionId)
      );
      toast({
        title: accept ? "Connection accepted" : "Connection declined",
        description: accept
          ? "You are now connected!"
          : "Connection request declined.",
      });
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

  const removeConnection = async (connectionId: string) => {
    setLoading(true);
    try {
      // API call would go here
      setConnections((prev) =>
        prev.filter((conn) => conn.connection_id !== connectionId)
      );
      toast({
        title: "Connection removed",
        description: "Connection has been removed successfully.",
      });
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

  const filteredConnections = connections.filter(
    (connection) =>
      connection.user.full_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      connection.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      suggestion.user.full_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      suggestion.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Connections
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your professional network
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.connections}
            </div>
            <div className="text-sm text-gray-500">Connections</div>
          </div>
          {stats.pending_requests > 0 && (
            <Badge variant="destructive" className="px-3 py-1">
              {stats.pending_requests} pending
            </Badge>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search connections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedFilter("all")}>
                  All Connections
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedFilter("professional")}
                >
                  Professional
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedFilter("standard")}>
                  Standard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedFilter("online")}>
                  Online Now
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="connections" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Connections
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Requests
            {stats.pending_requests > 0 && (
              <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                {stats.pending_requests}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="sent" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Sent
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Suggestions
          </TabsTrigger>
        </TabsList>

        {/* Connections Tab */}
        <TabsContent value="connections" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredConnections.map((connection) => (
              <ConnectionCard
                key={connection.connection_id}
                connection={connection}
                onRemove={() => removeConnection(connection.connection_id)}
                onMessage={() => {
                  /* Handle message */
                }}
              />
            ))}
          </div>
          {filteredConnections.length === 0 && (
            <EmptyState
              icon={Users}
              title="No connections found"
              description="Try adjusting your search or filters."
            />
          )}
        </TabsContent>

        {/* Incoming Requests Tab */}
        <TabsContent value="requests" className="space-y-4">
          <div className="space-y-4">
            {incomingRequests.map((request) => (
              <ConnectionRequestCard
                key={request.connection_id}
                request={request}
                onAccept={() => respondToRequest(request.connection_id, true)}
                onDecline={() => respondToRequest(request.connection_id, false)}
              />
            ))}
          </div>
          {incomingRequests.length === 0 && (
            <EmptyState
              icon={Clock}
              title="No pending requests"
              description="You have no incoming connection requests at the moment."
            />
          )}
        </TabsContent>

        {/* Sent Requests Tab */}
        <TabsContent value="sent" className="space-y-4">
          <div className="space-y-4">
            {outgoingRequests.map((request) => (
              <SentRequestCard
                key={request.connection_id}
                request={request}
                onCancel={() => {
                  /* Handle cancel */
                }}
              />
            ))}
          </div>
          {outgoingRequests.length === 0 && (
            <EmptyState
              icon={Send}
              title="No sent requests"
              description="You haven't sent any connection requests recently."
            />
          )}
        </TabsContent>

        {/* Suggestions Tab */}
        <TabsContent value="suggestions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSuggestions.map((suggestion) => (
              <SuggestionCard
                key={suggestion.user.id}
                suggestion={suggestion}
                onConnect={(user) => {
                  setSelectedUser(user);
                  setShowConnectionModal(true);
                }}
              />
            ))}
          </div>
          {filteredSuggestions.length === 0 && (
            <EmptyState
              icon={UserPlus}
              title="No suggestions available"
              description="Check back later for new connection suggestions."
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Connection Request Modal */}
      <Dialog open={showConnectionModal} onOpenChange={setShowConnectionModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Connection Request</DialogTitle>
            <DialogDescription>
              Send a connection request to {selectedUser?.full_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Avatar>
                <AvatarImage src={selectedUser?.profile_picture} />
                <AvatarFallback>
                  {selectedUser?.full_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{selectedUser?.full_name}</div>
                <div className="text-sm text-gray-500">
                  @{selectedUser?.username}
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Message (optional)
              </label>
              <Textarea
                placeholder="Add a personal message..."
                value={connectionMessage}
                onChange={(e) => setConnectionMessage(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowConnectionModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() =>
                  selectedUser &&
                  sendConnectionRequest(selectedUser.id, connectionMessage)
                }
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Request"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Component: ConnectionCard
function ConnectionCard({
  connection,
  onRemove,
  onMessage,
}: {
  connection: Connection;
  onRemove: () => void;
  onMessage: () => void;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarImage src={connection.user.profile_picture} />
              <AvatarFallback>
                {connection.user.full_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {connection.user.is_online && (
              <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <h3 className="font-medium truncate">
                {connection.user.full_name}
              </h3>
              {connection.user.is_verified && (
                <CheckCircle className="h-4 w-4 text-blue-500" />
              )}
            </div>
            <p className="text-sm text-gray-500">@{connection.user.username}</p>
            {connection.user.bio && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
                {connection.user.bio}
              </p>
            )}
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span>{connection.mutual_connections} mutual</span>
              <span>
                Connected{" "}
                {new Date(connection.connected_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onMessage}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Send Message
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onRemove} className="text-red-600">
                <UserX className="h-4 w-4 mr-2" />
                Remove Connection
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}

// Component: ConnectionRequestCard
function ConnectionRequestCard({
  request,
  onAccept,
  onDecline,
}: {
  request: ConnectionRequest;
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={request.user.profile_picture} />
            <AvatarFallback>{request.user.full_name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-1">
              <h3 className="font-medium">{request.user.full_name}</h3>
              {request.user.is_verified && (
                <CheckCircle className="h-4 w-4 text-blue-500" />
              )}
            </div>
            <p className="text-sm text-gray-500">@{request.user.username}</p>
            {request.user.bio && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {request.user.bio}
              </p>
            )}
            {request.message && (
              <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                &ldquo;{request.message}&rdquo;
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Sent {new Date(request.created_at).toLocaleDateString()}
            </p>
          </div>

          <div className="flex gap-2">
            <Button size="sm" onClick={onAccept}>
              <UserCheck className="h-4 w-4 mr-1" />
              Accept
            </Button>
            <Button size="sm" variant="outline" onClick={onDecline}>
              <UserX className="h-4 w-4 mr-1" />
              Decline
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Component: SentRequestCard
function SentRequestCard({
  request,
  onCancel,
}: {
  request: ConnectionRequest;
  onCancel: () => void;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={request.user.profile_picture} />
            <AvatarFallback>{request.user.full_name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-1">
              <h3 className="font-medium">{request.user.full_name}</h3>
              {request.user.is_verified && (
                <CheckCircle className="h-4 w-4 text-blue-500" />
              )}
            </div>
            <p className="text-sm text-gray-500">@{request.user.username}</p>
            <Badge variant="outline" className="mt-2">
              <Clock className="h-3 w-3 mr-1" />
              Pending
            </Badge>
            <p className="text-xs text-gray-500 mt-2">
              Sent {new Date(request.created_at).toLocaleDateString()}
            </p>
          </div>

          <Button size="sm" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Component: SuggestionCard
function SuggestionCard({
  suggestion,
  onConnect,
}: {
  suggestion: ConnectionSuggestion;
  onConnect: (user: User) => void;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={suggestion.user.profile_picture} />
            <AvatarFallback>
              {suggestion.user.full_name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <h3 className="font-medium truncate">
                {suggestion.user.full_name}
              </h3>
              {suggestion.user.is_verified && (
                <CheckCircle className="h-4 w-4 text-blue-500" />
              )}
            </div>
            <p className="text-sm text-gray-500">@{suggestion.user.username}</p>
            {suggestion.user.bio && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
                {suggestion.user.bio}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-2">{suggestion.reason}</p>
          </div>
        </div>

        <Button
          className="w-full mt-3"
          size="sm"
          onClick={() => onConnect(suggestion.user)}
        >
          <UserPlus className="h-4 w-4 mr-1" />
          Connect
        </Button>
      </CardContent>
    </Card>
  );
}

// Component: EmptyState
function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center py-12">
      <Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );
}
