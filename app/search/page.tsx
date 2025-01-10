"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  // Mock search results - replace with real API data
  const results = [
    {
      id: "1",
      name: "John Smith",
      username: "johnsmith",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      position: "Senior Software Engineer",
      company: "Tech Corp",
      location: "San Francisco, CA",
    },
    {
      id: "2",
      name: "John Davis",
      username: "johndavis",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
      position: "Product Designer",
      company: "Design Co",
      location: "New York, NY",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Search Results for "{query}"</h1>
      <div className="grid gap-4">
        {results.map((user) => (
          <Card key={user.id} className="p-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.image} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-muted-foreground">
                  {user.position} at {user.company}
                </p>
                <p className="text-sm text-muted-foreground">{user.location}</p>
              </div>
              <Link href={`/profile/${user.username}`}>
                <Button>View Profile</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
