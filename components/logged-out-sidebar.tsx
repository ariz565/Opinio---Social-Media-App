"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { AuthButtons } from "./auth/auth-buttons";

export function LoggedOutSidebar() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Gulf Return</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Connect with professionals, share ideas, and grow your network.
          </p>
          <AuthButtons />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Why Join Gulf Return?</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Connect with professionals</li>
            <li>• Share your thoughts and ideas</li>
            <li>• Discover new opportunities</li>
            <li>• Stay updated with trends</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
