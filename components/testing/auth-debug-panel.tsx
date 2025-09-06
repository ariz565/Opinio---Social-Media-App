"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Key,
  User,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";

export function AuthDebugPanel() {
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [showToken, setShowToken] = useState(false);
  const [customToken, setCustomToken] = useState("");

  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    const user = localStorage.getItem("user");

    setTokenInfo({
      hasToken: !!token,
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      hasUser: !!user,
      token: token || "None",
      accessToken: accessToken || "None",
      refreshToken: refreshToken || "None",
      user: user ? JSON.parse(user) : null,
      tokenLength: token?.length || 0,
      accessTokenLength: accessToken?.length || 0,
    });
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const setCustomTokenInStorage = () => {
    if (customToken.trim()) {
      localStorage.setItem("token", customToken.trim());
      console.log("✅ Custom token set in localStorage");
      checkAuthStatus();
    }
  };

  const clearAllTokens = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    console.log("🗑️ All tokens cleared");
    checkAuthStatus();
  };

  const createDummyToken = () => {
    const dummyToken = "dummy-jwt-token-for-testing-websocket-connection";
    localStorage.setItem("token", dummyToken);
    console.log("🎭 Dummy token created");
    checkAuthStatus();
  };

  const fixWebSocketToken = () => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      localStorage.setItem("token", accessToken);
      console.log("🔧 Copied access_token to token for WebSocket compatibility");
      checkAuthStatus();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Authentication Debug Panel
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Auth Status */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <span>Token:</span>
            {tokenInfo?.hasToken ? (
              <Badge variant="default" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Present ({tokenInfo.tokenLength} chars)
              </Badge>
            ) : (
              <Badge variant="destructive" className="flex items-center gap-1">
                <XCircle className="h-3 w-3" />
                Missing
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span>Access Token:</span>
            {tokenInfo?.hasAccessToken ? (
              <Badge variant="default" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Present ({tokenInfo.accessTokenLength} chars)
              </Badge>
            ) : (
              <Badge variant="secondary" className="flex items-center gap-1">
                <XCircle className="h-3 w-3" />
                Missing
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span>Refresh Token:</span>
            {tokenInfo?.hasRefreshToken ? (
              <Badge variant="default" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Present
              </Badge>
            ) : (
              <Badge variant="secondary" className="flex items-center gap-1">
                <XCircle className="h-3 w-3" />
                Missing
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span>User Data:</span>
            {tokenInfo?.hasUser ? (
              <Badge variant="default" className="flex items-center gap-1">
                <User className="h-3 w-3" />
                Present
              </Badge>
            ) : (
              <Badge variant="secondary" className="flex items-center gap-1">
                <XCircle className="h-3 w-3" />
                Missing
              </Badge>
            )}
          </div>
        </div>

        {/* Token Display */}
        {tokenInfo?.hasToken && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Current Token:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowToken(!showToken)}
              >
                {showToken ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="p-2 bg-muted rounded text-xs font-mono break-all">
              {showToken
                ? tokenInfo.token
                : `${tokenInfo.token.substring(
                    0,
                    20
                  )}...${tokenInfo.token.substring(
                    tokenInfo.token.length - 10
                  )}`}
            </div>
          </div>
        )}

        {/* User Info */}
        {tokenInfo?.user && (
          <div className="space-y-2">
            <span className="text-sm font-medium">User Info:</span>
            <div className="p-2 bg-muted rounded text-xs">
              <pre>{JSON.stringify(tokenInfo.user, null, 2)}</pre>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={checkAuthStatus} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Status
          </Button>

          {tokenInfo?.hasAccessToken && !tokenInfo?.hasToken && (
            <Button onClick={fixWebSocketToken} variant="default" size="sm">
              🔧 Fix WebSocket Token
            </Button>
          )}
          
          <Button onClick={createDummyToken} variant="outline" size="sm">
            🎭 Create Dummy Token
          </Button>
          
          <Button onClick={clearAllTokens} variant="destructive" size="sm">
            🗑️ Clear All Tokens
          </Button>
        </div>        {/* Custom Token Input */}
        <div className="space-y-2">
          <span className="text-sm font-medium">
            Set Custom Token (for testing):
          </span>
          <div className="flex gap-2">
            <Input
              placeholder="Enter JWT token..."
              value={customToken}
              onChange={(e) => setCustomToken(e.target.value)}
              type="password"
            />
            <Button onClick={setCustomTokenInStorage} size="sm">
              Set Token
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>
            <strong>For WebSocket Testing:</strong>
          </p>
          <p>1. If you&apos;re logged in, your real token should be present</p>
          <p>
            2. If not logged in, create a dummy token to test WebSocket
            connection
          </p>
          <p>3. Check browser console for detailed WebSocket logs</p>
        </div>
      </CardContent>
    </Card>
  );
}
