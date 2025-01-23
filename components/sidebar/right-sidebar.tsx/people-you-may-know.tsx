"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { Users } from "lucide-react";
import Link from "next/link";

const suggestedPeople = [
  {
    name: "Alice Johnson",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    title: "UX Designer at Design Co",
    mutualConnections: 12,
  },
  {
    name: "Michael Chen",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    title: "Software Engineer at Tech Corp",
    mutualConnections: 8,
  },
  {
    name: "Sarah Williams",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    title: "Product Manager at Startup Inc",
    mutualConnections: 15,
  },
];

export function PeopleYouMayKnow() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            People You May Know
          </div>
          <Link href="/people">
            <Button variant="ghost" size="sm">
              See all
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestedPeople.map((person, index) => (
          <div key={index} className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={person.image} />
              <AvatarFallback>{person.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{person.name}</p>
              <p className="text-sm text-muted-foreground truncate">
                {person.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {person.mutualConnections} mutual connections
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
