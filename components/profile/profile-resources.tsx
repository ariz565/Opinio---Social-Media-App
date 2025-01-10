"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Bookmark, Network, Zap } from "lucide-react";

interface ProfileResourcesProps {
  isOwnProfile?: boolean;
}

export function ProfileResources({ isOwnProfile }: ProfileResourcesProps) {
  if (!isOwnProfile) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Resources</CardTitle>
        <p className="text-sm text-muted-foreground">Private to you</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-lg">
          <Network className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">My Network</p>
            <p className="text-sm text-muted-foreground">
              See and manage your connections
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-lg">
          <Bookmark className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">Saved items</p>
            <p className="text-sm text-muted-foreground">
              Save posts and articles
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-lg">
          <Zap className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">Creator mode</p>
            <p className="text-sm text-muted-foreground">
              Get discovered, showcase content
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
