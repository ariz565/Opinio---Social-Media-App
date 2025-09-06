"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { WebSocketTestPanel } from "@/components/testing/websocket-test-panel";
import { AuthDebugPanel } from "@/components/testing/auth-debug-panel";
import { RealUsersProfileList } from "@/components/profile/real-users-profile-list";
import { 
  TestTube2, 
  Users, 
  Wifi, 
  Shield,
  Database,
  Activity
} from "lucide-react";

export default function IntegrationTestPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube2 className="h-6 w-6" />
            API Integration & Real-time Features Test
          </CardTitle>
          <p className="text-sm text-gray-600">
            Test WebSocket connections, database integration, and real-time features
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <Database className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-sm font-medium">Database Users</div>
              <Badge variant="outline" className="mt-1">API Integration</Badge>
            </div>
            <div className="text-center">
              <Wifi className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-sm font-medium">WebSocket</div>
              <Badge variant="outline" className="mt-1">Real-time</Badge>
            </div>
            <div className="text-center">
              <Shield className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-sm font-medium">Authentication</div>
              <Badge variant="outline" className="mt-1">Security</Badge>
            </div>
            <div className="text-center">
              <Activity className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <div className="text-sm font-medium">Notifications</div>
              <Badge variant="outline" className="mt-1">Live Updates</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Database Users
          </TabsTrigger>
          <TabsTrigger value="websocket" className="flex items-center gap-2">
            <Wifi className="h-4 w-4" />
            WebSocket Test
          </TabsTrigger>
          <TabsTrigger value="auth" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Auth Debug
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Real Database Users Test
              </CardTitle>
              <p className="text-sm text-gray-600">
                Testing user data loading from multiple API sources
              </p>
            </CardHeader>
            <CardContent>
              <RealUsersProfileList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="websocket" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5" />
                WebSocket Connection Test
              </CardTitle>
              <p className="text-sm text-gray-600">
                Testing real-time WebSocket connections and authentication
              </p>
            </CardHeader>
            <CardContent>
              <WebSocketTestPanel />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Authentication Debug
              </CardTitle>
              <p className="text-sm text-gray-600">
                Debug authentication tokens and user session data
              </p>
            </CardHeader>
            <CardContent>
              <AuthDebugPanel />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
