"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

const activities = [
  {
    id: "1",
    user: {
      name: "Demo Test",
      email: "john@example.com",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    },
    action: "Created Post",
    details: "Posted a new article about web development",
    ip: "192.168.1.1",
    timestamp: "2024-03-15 14:30",
  },
  {
    id: "2",
    user: {
      name: "Sarah Smith",
      email: "sarah@example.com",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    },
    action: "Login",
    details: "Logged in from new device",
    ip: "192.168.1.2",
    timestamp: "2024-03-15 14:25",
  },
  {
    id: "3",
    user: {
      name: "Mike Johnson",
      email: "mike@example.com",
      avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5",
    },
    action: "Updated Profile",
    details: "Changed profile picture and bio",
    ip: "192.168.1.3",
    timestamp: "2024-03-15 14:20",
  },
];

export default function ActivityPage() {
  const [search, setSearch] = useState("");

  return (
    <main className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">User Activity</h2>
        <Button>Export Log</Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search activity..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activity.user.avatar} />
                    <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{activity.user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.user.email}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{activity.action}</Badge>
                </TableCell>
                <TableCell>{activity.details}</TableCell>
                <TableCell>
                  <code className="rounded bg-muted px-2 py-1">
                    {activity.ip}
                  </code>
                </TableCell>
                <TableCell>{activity.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
