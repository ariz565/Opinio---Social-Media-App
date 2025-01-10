"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

interface Connection {
  id: string;
  name: string;
  image: string;
  title: string;
  mutualConnections: number;
}

interface ProfileConnectionsProps {
  connections: Connection[];
}

export function ProfileConnections({ connections }: ProfileConnectionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>People Also Viewed</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {connections.map((connection) => (
          <div key={connection.id} className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={connection.image} />
              <AvatarFallback>{connection.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{connection.name}</p>
              <p className="text-sm text-muted-foreground truncate">
                {connection.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {connection.mutualConnections} mutual connections
              </p>
            </div>
            <Button variant="outline" size="sm">
              Connect
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
