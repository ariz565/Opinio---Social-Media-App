"use client";

import { WebSocketTestPanel } from "@/components/testing/websocket-test-panel";
import { AuthDebugPanel } from "@/components/testing/auth-debug-panel";
import { RealUsersProfileList } from "@/components/profile/real-users-profile-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Zap, 
  MessageSquare, 
  Users, 
  Bell,
  Activity,
  Wifi
} from "lucide-react";

export default function RealTimeFeaturesPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Zap className="h-8 w-8 text-yellow-500" />
          Real-Time Features Demo
        </h1>
        <p className="text-muted-foreground">
          Test WebSocket integration, live notifications, and real-time
          communication
        </p>
      </div>

      {/* Features Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Wifi className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <h3 className="font-semibold">WebSocket</h3>
            <p className="text-sm text-muted-foreground">
              Real-time connection
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <h3 className="font-semibold">Live Messaging</h3>
            <p className="text-sm text-muted-foreground">
              Instant message delivery
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <h3 className="font-semibold">Connections</h3>
            <p className="text-sm text-muted-foreground">
              Real-time connection requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Bell className="h-8 w-8 mx-auto mb-2 text-orange-500" />
            <h3 className="font-semibold">Notifications</h3>
            <p className="text-sm text-muted-foreground">
              Live toast notifications
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Authentication Debug Panel */}
      <AuthDebugPanel />

      {/* WebSocket Test Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            WebSocket Testing Panel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <WebSocketTestPanel />
        </CardContent>
      </Card>

      {/* Real Users from Database */}
      <RealUsersProfileList />

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Test Real-Time Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">1. WebSocket Connection</h4>
            <p className="text-sm text-muted-foreground">
              The WebSocket should automatically connect when you load this
              page. Check the connection status in the testing panel above.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">2. Test Messages</h4>
            <p className="text-sm text-muted-foreground">
              Send test messages using the testing panel. You&apos;ll see them
              appear in the message history in real-time.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">3. Connection Requests</h4>
            <p className="text-sm text-muted-foreground">
              Click the connection buttons on the sample profiles to test
              real-time connection requests and notifications.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">4. Typing Indicators</h4>
            <p className="text-sm text-muted-foreground">
              Test typing status broadcasts to see how real-time typing
              indicators work in chat conversations.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">5. User Status</h4>
            <p className="text-sm text-muted-foreground">
              Toggle your online/away status to test real-time user presence
              updates.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
